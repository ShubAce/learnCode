import type { LanguageId } from "@/config/languages";

export type ProviderId = "wandbox" | "judge0" | "piston";

export type ExecutionRequest = {
	language: LanguageId;
	source: string;
	stdin: string;
};

export type ExecutionStatus =
	| "OK"
	| "COMPILATION_ERROR"
	| "RUNTIME_ERROR"
	| "TIME_LIMIT_EXCEEDED"
	| "MEMORY_LIMIT_EXCEEDED"
	| "INTERNAL_ERROR";

export type ExecutionResult = {
	status: ExecutionStatus;
	stdout: string;
	stderr: string;
	compileOutput: string;
	/** CPU time in milliseconds, when the provider reports it */
	timeMs: number | null;
	/** Peak memory in kilobytes, when the provider reports it */
	memoryKb: number | null;
};

export interface ExecutionProvider {
	readonly id: ProviderId;
	readonly label: string;
	/** Whether the environment holds everything this provider needs */
	isConfigured(): boolean;
	/** Runs every request and returns results in the same order */
	execute(requests: ExecutionRequest[]): Promise<ExecutionResult[]>;
}

/** Thrown when a provider itself fails (auth, quota, network), as opposed to the user's code failing. */
export class ExecutionProviderError extends Error {
	readonly provider: string;
	readonly status?: number;
	readonly retryAfterMs?: number;

	constructor(provider: string, message: string, options?: ErrorOptions & { status?: number; retryAfterMs?: number }) {
		super(`[${provider}] ${message}`, options);
		this.name = "ExecutionProviderError";
		this.provider = provider;
		this.status = options?.status;
		this.retryAfterMs = options?.retryAfterMs;
	}
}
