import type { LanguageId } from "@/config/languages";
import type { ExecutionProvider, ExecutionRequest, ExecutionResult, ExecutionStatus } from "../types";
import { ExecutionProviderError } from "../types";
import { fromBase64, readLanguageOverrides, requestJson, sleep, toBase64 } from "../utils";

/**
 * Judge0 (https://judge0.com) — works with the RapidAPI-hosted CE edition or a self-hosted instance.
 *
 * Env:
 *   JUDGE0_API_URL        e.g. https://judge0-ce.p.rapidapi.com or http://localhost:2358
 *   JUDGE0_API_KEY        RapidAPI key, or X-Auth-Token for self-hosted instances
 *   RAPIDAPI_HOST         set when using RapidAPI (defaults to the URL host)
 *   JUDGE0_LANGUAGE_IDS   optional JSON overrides, e.g. {"PYTHON":100}
 */

const LANGUAGE_IDS: Record<LanguageId, number> = {
	JAVASCRIPT: 63, // Node.js 12
	PYTHON: 71, // Python 3.8
	JAVA: 62, // OpenJDK 13
	CPP: 54, // GCC 9.2
};

const BATCH_LIMIT = 20;
const POLL_INTERVAL_MS = 800;
const POLL_TIMEOUT_MS = 30_000;

type Judge0Submission = {
	token: string;
	status?: { id: number; description: string };
	stdout?: string | null;
	stderr?: string | null;
	compile_output?: string | null;
	message?: string | null;
	time?: string | null;
	memory?: number | null;
};

const config = () => {
	const url = process.env.JUDGE0_API_URL?.replace(/\/+$/, "");
	const key = process.env.JUDGE0_API_KEY;
	const rapidHost = process.env.RAPIDAPI_HOST || (url?.includes("rapidapi.com") ? new URL(url).host : undefined);
	return { url, key, rapidHost, languageIds: { ...LANGUAGE_IDS, ...readLanguageOverrides<number>("JUDGE0_LANGUAGE_IDS") } };
};

function headers(): Record<string, string> {
	const { key, rapidHost } = config();
	if (rapidHost) return { "X-RapidAPI-Key": key ?? "", "X-RapidAPI-Host": rapidHost };
	return key ? { "X-Auth-Token": key } : {};
}

// https://ce.judge0.com/#statuses-and-languages-status-get
function toStatus(id: number): ExecutionStatus {
	if (id === 3) return "OK";
	if (id === 5) return "TIME_LIMIT_EXCEEDED";
	if (id === 6) return "COMPILATION_ERROR";
	if (id >= 7 && id <= 12) return "RUNTIME_ERROR";
	return "INTERNAL_ERROR";
}

function toResult(submission: Judge0Submission): ExecutionResult {
	const status = toStatus(submission.status?.id ?? 13);
	const stderr = fromBase64(submission.stderr);
	return {
		status,
		stdout: fromBase64(submission.stdout),
		stderr: stderr || (status === "RUNTIME_ERROR" || status === "INTERNAL_ERROR" ? (submission.status?.description ?? "") : ""),
		compileOutput: fromBase64(submission.compile_output),
		timeMs: submission.time ? Math.round(parseFloat(submission.time) * 1000) : null,
		memoryKb: submission.memory ?? null,
	};
}

async function runBatch(requests: ExecutionRequest[]): Promise<ExecutionResult[]> {
	const { url, languageIds } = config();

	const created = await requestJson<Array<{ token?: string; error?: string }>>("Judge0", `${url}/submissions/batch?base64_encoded=true`, {
		method: "POST",
		headers: headers(),
		body: {
			submissions: requests.map(({ language, source, stdin }) => ({
				language_id: languageIds[language],
				source_code: toBase64(source),
				stdin: toBase64(stdin),
			})),
		},
	});

	const tokens = Array.isArray(created) ? created.map((item) => item.token) : [];
	if (tokens.length !== requests.length || tokens.some((token) => !token)) {
		throw new ExecutionProviderError("Judge0", `rejected the batch: ${JSON.stringify(created).slice(0, 200)}`);
	}

	const deadline = Date.now() + POLL_TIMEOUT_MS;
	while (Date.now() < deadline) {
		await sleep(POLL_INTERVAL_MS);
		const { submissions } = await requestJson<{ submissions: Judge0Submission[] }>(
			"Judge0",
			`${url}/submissions/batch?base64_encoded=true&fields=token,status,stdout,stderr,compile_output,message,time,memory&tokens=${tokens.join(",")}`,
			{ headers: headers() },
		);
		// Status 1 = In Queue, 2 = Processing; anything above is final.
		if (Array.isArray(submissions) && submissions.every((s) => (s.status?.id ?? 0) > 2)) {
			return submissions.map(toResult);
		}
	}
	throw new ExecutionProviderError("Judge0", "timed out waiting for results");
}

export const judge0Provider: ExecutionProvider = {
	id: "judge0",
	label: "Judge0",
	isConfigured: () => Boolean(config().url),
	async execute(requests) {
		const results: ExecutionResult[] = [];
		for (let i = 0; i < requests.length; i += BATCH_LIMIT) {
			results.push(...(await runBatch(requests.slice(i, i + BATCH_LIMIT))));
		}
		return results;
	},
};
