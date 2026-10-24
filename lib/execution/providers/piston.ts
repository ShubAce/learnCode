import type { LanguageId } from "@/config/languages";
import type { ExecutionProvider, ExecutionResult } from "../types";
import { describeExitCode, mapWithConcurrency, readLanguageOverrides, requestJson } from "../utils";

/**
 * Piston (https://github.com/engineer-man/piston) — ideal for self-hosting with Docker.
 *
 * Env:
 *   PISTON_API_URL    e.g. http://localhost:2000/api/v2
 *   PISTON_API_KEY    optional, sent as the Authorization header
 *   PISTON_RUNTIMES   optional JSON overrides, e.g. {"PYTHON":{"language":"python","version":"3.12.0"}}
 */

type Runtime = { language: string; version: string; file: string };

const RUNTIMES: Record<LanguageId, Runtime> = {
	JAVASCRIPT: { language: "javascript", version: "*", file: "main.js" },
	PYTHON: { language: "python", version: "*", file: "main.py" },
	JAVA: { language: "java", version: "*", file: "Main.java" },
	CPP: { language: "c++", version: "*", file: "main.cpp" },
};

type Stage = {
	stdout?: string;
	stderr?: string;
	output?: string;
	code?: number | null;
	signal?: string | null;
	cpu_time?: number;
	memory?: number;
};

type PistonResponse = { run?: Stage; compile?: Stage; message?: string };

const config = () => ({
	url: process.env.PISTON_API_URL?.replace(/\/+$/, ""),
	key: process.env.PISTON_API_KEY,
	runtimes: { ...RUNTIMES, ...readLanguageOverrides<Runtime>("PISTON_RUNTIMES") },
});

function toResult({ run, compile }: PistonResponse): ExecutionResult {
	const metrics = {
		timeMs: typeof run?.cpu_time === "number" ? run.cpu_time : null,
		memoryKb: typeof run?.memory === "number" ? Math.round(run.memory / 1024) : null,
	};

	if (compile && compile.code !== 0) {
		return { status: "COMPILATION_ERROR", stdout: "", stderr: "", compileOutput: compile.stderr || compile.output || "", ...metrics };
	}

	const stdout = run?.stdout ?? "";
	const stderr = run?.stderr ?? "";
	if (run?.signal === "SIGKILL") return { status: "TIME_LIMIT_EXCEEDED", stdout, stderr, compileOutput: "", ...metrics };
	if (run?.code) return { status: "RUNTIME_ERROR", stdout, stderr: stderr || describeExitCode(run.code), compileOutput: "", ...metrics };
	return { status: "OK", stdout, stderr, compileOutput: "", ...metrics };
}

export const pistonProvider: ExecutionProvider = {
	id: "piston",
	label: "Piston",
	isConfigured: () => Boolean(config().url),
	async execute(requests) {
		const { url, key, runtimes } = config();

		return mapWithConcurrency(requests, 4, async ({ language, source, stdin }) => {
			const runtime = runtimes[language];
			const response = await requestJson<PistonResponse>("Piston", `${url}/execute`, {
				method: "POST",
				headers: key ? { Authorization: key } : undefined,
				body: {
					language: runtime.language,
					version: runtime.version,
					files: [{ name: runtime.file, content: source }],
					stdin,
					compile_timeout: 10_000,
					run_timeout: 5_000,
				},
			});
			return toResult(response);
		});
	},
};
