import type { LanguageId } from "@/config/languages";
import type { ExecutionProvider, ExecutionRequest, ExecutionResult } from "../types";
import { describeExitCode, isTimeoutError, mapWithConcurrency, readLanguageOverrides, requestJson, withRetry } from "../utils";

/**
 * Wandbox (https://wandbox.org) — a free, key-less online compiler.
 * It is the zero-configuration default so code execution works out of the box.
 * The public instance is rate limited, so requests run with low concurrency and back off on HTTP 429.
 */

type Runtime = {
	compiler: string;
	options?: string;
	rawOptions?: string;
	prepare?: (source: string) => string;
};

// Wandbox compiles Java from prog.java, so a top-level `public class Main` must drop its modifier.
const demotePublicClass = (source: string) => source.replace(/^(\s*)public\s+((?:final\s+|abstract\s+)*)class\s+/m, "$1$2class ");

const RUNTIMES: Record<LanguageId, Runtime> = {
	JAVASCRIPT: { compiler: "nodejs-20.17.0" },
	PYTHON: { compiler: "cpython-3.12.7" },
	JAVA: { compiler: "openjdk-jdk-22+36", prepare: demotePublicClass },
	CPP: { compiler: "gcc-13.2.0", options: "optimize", rawOptions: "-std=gnu++17" },
};

type WandboxResponse = {
	status?: string;
	signal?: string;
	compiler_error?: string;
	program_output?: string;
	program_error?: string;
	program_message?: string;
};

const config = () => ({
	url: (process.env.WANDBOX_API_URL ?? "https://wandbox.org/api").replace(/\/+$/, ""),
	timeoutMs: Number(process.env.WANDBOX_TIMEOUT_MS) || 20_000,
	concurrency: Number(process.env.WANDBOX_CONCURRENCY) || 2,
	compilers: readLanguageOverrides<string>("WANDBOX_COMPILERS"),
});

function toResult(response: WandboxResponse): ExecutionResult {
	const exitCode = Number(response.status ?? 0);
	const stdout = response.program_output ?? "";
	const stderr = response.program_error ?? "";
	const compilerOutput = response.compiler_error ?? "";
	const base = { stdout, stderr, compileOutput: "", timeMs: null, memoryKb: null };

	if (exitCode === 0) return { ...base, status: "OK" };

	// The program never ran: the compiler reported an error.
	if (!response.program_message && /\berror\b/i.test(compilerOutput)) {
		return { ...base, status: "COMPILATION_ERROR", compileOutput: compilerOutput };
	}

	// Exit 137 = SIGKILL, which Wandbox sends when the time or memory limit is hit.
	if (exitCode === 137) return { ...base, status: "TIME_LIMIT_EXCEEDED", stderr: stderr || describeExitCode(exitCode) };

	return { ...base, status: "RUNTIME_ERROR", stderr: stderr || describeExitCode(exitCode) };
}

export const wandboxProvider: ExecutionProvider = {
	id: "wandbox",
	label: "Wandbox",
	isConfigured: () => true,
	async execute(requests: ExecutionRequest[]) {
		const { url, timeoutMs, concurrency, compilers } = config();

		return mapWithConcurrency(requests, concurrency, async ({ language, source, stdin }) => {
			const runtime = RUNTIMES[language];
			try {
				const response = await withRetry(() =>
					requestJson<WandboxResponse>("Wandbox", `${url}/compile.json`, {
						method: "POST",
						timeoutMs,
						body: {
							compiler: compilers[language] ?? runtime.compiler,
							code: runtime.prepare ? runtime.prepare(source) : source,
							stdin,
							...(runtime.options && { options: runtime.options }),
							...(runtime.rawOptions && { "compiler-option-raw": runtime.rawOptions }),
						},
					}),
				);
				return toResult(response);
			} catch (error) {
				// Wandbox only kills runaway programs after ~40s, so we enforce our own limit.
				if (isTimeoutError(error)) {
					return {
						status: "TIME_LIMIT_EXCEEDED",
						stdout: "",
						stderr: `Execution exceeded the ${timeoutMs / 1000}s time limit`,
						compileOutput: "",
						timeMs: null,
						memoryKb: null,
					} satisfies ExecutionResult;
				}
				throw error;
			}
		});
	},
};
