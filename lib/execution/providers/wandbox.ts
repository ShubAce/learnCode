import type { LanguageId } from "@/config/languages";
import type { ExecutionProvider, ExecutionRequest, ExecutionResult } from "../types";
import { ExecutionProviderError } from "../types";
import { describeExitCode, isTimeoutError, mapWithConcurrency, readLanguageOverrides, requestJson, withRetry } from "../utils";

/**
 * Wandbox (https://wandbox.org) — a free, key-less online compiler.
 * It is the zero-configuration default so code execution works out of the box.
 * The public instance limits how many compiles an IP can make per minute, so requests back off on HTTP 429
 * and identical runs are served from the cache in ../index.ts.
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
	concurrency: Number(process.env.WANDBOX_CONCURRENCY) || 4,
	compilers: readLanguageOverrides<string>("WANDBOX_COMPILERS"),
});

function toResult(response: WandboxResponse): ExecutionResult {
	const exitCode = response.status ? Number(response.status) : null;
	const signal = response.signal?.trim() ?? "";
	const stdout = response.program_output ?? "";
	const stderr = response.program_error ?? "";
	const compilerOutput = response.compiler_error ?? "";
	const base = { stdout, stderr, compileOutput: "", timeMs: null, memoryKb: null };

	if (!signal && (exitCode === 0 || exitCode === null)) return { ...base, status: "OK" };

	// The program never ran: the compiler reported an error.
	if (!response.program_message && /\berror\b/i.test(compilerOutput)) {
		return { ...base, status: "COMPILATION_ERROR", compileOutput: compilerOutput };
	}

	// Exit 137 / SIGKILL is what Wandbox sends when the time or memory limit is hit.
	if (exitCode === 137 || /kill|cpu time/i.test(signal)) {
		return { ...base, status: "TIME_LIMIT_EXCEEDED", stderr: stderr || describeExitCode(137) };
	}

	const reason = signal ? `Process terminated by signal: ${signal}` : describeExitCode(exitCode ?? 1);
	return { ...base, status: "RUNTIME_ERROR", stderr: stderr || reason };
}

// When the Wandbox host is overloaded its container runtime can fail before the program starts,
// e.g. "OCI runtime error: crun: clone: Resource temporarily unavailable". That is Wandbox failing, not the user's code.
const SANDBOX_FAILURE = /OCI runtime error|\b(?:crun|runc):/i;

function assertSandboxStarted(response: WandboxResponse) {
	const failure = [response.compiler_error, response.program_error].find((output) => output && SANDBOX_FAILURE.test(output));
	// 503 so withRetry backs off and retries, and the result is never cached as a verdict
	if (failure) throw new ExecutionProviderError("Wandbox", `sandbox failed to start: ${failure.trim().slice(0, 200)}`, { status: 503 });
	return response;
}

const timeLimitResult = (timeoutMs: number): ExecutionResult => ({
	status: "TIME_LIMIT_EXCEEDED",
	stdout: "",
	stderr: `Execution exceeded the ${timeoutMs / 1000}s time limit`,
	compileOutput: "",
	timeMs: null,
	memoryKb: null,
});

/** A trivial program that should answer in a couple of seconds whenever Wandbox is healthy. */
async function isResponsive(url: string) {
	try {
		const response = await requestJson<WandboxResponse>("Wandbox", `${url}/compile.json`, {
			method: "POST",
			timeoutMs: 8_000,
			body: { compiler: RUNTIMES.PYTHON.compiler, code: "print(1)" },
		});
		return response.status === "0";
	} catch {
		return false;
	}
}

export const wandboxProvider: ExecutionProvider = {
	id: "wandbox",
	label: "Wandbox",
	isConfigured: () => true,
	async execute(requests: ExecutionRequest[]) {
		const { url, timeoutMs, concurrency, compilers } = config();
		let timedOut = false;

		const results = await mapWithConcurrency(requests, concurrency, async ({ language, source, stdin }) => {
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
					}).then(assertSandboxStarted),
				);
				return toResult(response);
			} catch (error) {
				// Wandbox only kills runaway programs after ~40s, so we enforce our own limit.
				if (isTimeoutError(error)) {
					timedOut = true;
					return timeLimitResult(timeoutMs);
				}
				throw error;
			}
		});

		// A timeout is either the user's code looping or Wandbox itself stalling. Only blame the code
		// when a trivial program still runs promptly; otherwise let the provider chain fall back.
		if (timedOut && !(await isResponsive(url))) {
			throw new ExecutionProviderError("Wandbox", "is not responding");
		}
		return results;
	},
};
