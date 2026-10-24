import type { LanguageId } from "@/config/languages";
import { ExecutionProviderError } from "./types";

/**
 * Runs `fn` over `items` with at most `limit` promises in flight, preserving order.
 * After the first failure no new items are started, so a failing provider isn't hammered further.
 */
export async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
	const results = new Array<R>(items.length);
	let cursor = 0;
	let failed = false;
	let failure: unknown;

	const worker = async () => {
		while (cursor < items.length && !failed) {
			const index = cursor++;
			try {
				results[index] = await fn(items[index], index);
			} catch (error) {
				if (!failed) failure = error;
				failed = true;
			}
		}
	};

	await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker));
	if (failed) throw failure;
	return results;
}

export const isTimeoutError = (error: unknown) => error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");

type JsonRequestInit = Omit<RequestInit, "body"> & { body?: unknown; timeoutMs?: number };

/** fetch() wrapper that turns transport and HTTP failures into ExecutionProviderError. */
export async function requestJson<T>(provider: string, url: string, { body, timeoutMs = 30_000, headers, ...init }: JsonRequestInit = {}): Promise<T> {
	let response: Response;
	try {
		response = await fetch(url, {
			...init,
			headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: AbortSignal.timeout(timeoutMs),
			cache: "no-store",
		});
	} catch (error) {
		if (isTimeoutError(error)) throw error;
		throw new ExecutionProviderError(provider, "network request failed", { cause: error });
	}

	if (!response.ok) {
		const text = await response.text().catch(() => "");
		const retryAfter = Number(response.headers.get("retry-after"));
		throw new ExecutionProviderError(provider, `HTTP ${response.status}${text ? ` - ${text.slice(0, 200)}` : ""}`, {
			status: response.status,
			retryAfterMs: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : undefined,
		});
	}

	try {
		return (await response.json()) as T;
	} catch (error) {
		throw new ExecutionProviderError(provider, "returned a malformed response", { cause: error });
	}
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Retries rate-limited (429) and server-side (5xx) failures with exponential backoff. */
export async function withRetry<T>(fn: () => Promise<T>, { retries = 3, baseDelayMs = 1500, maxDelayMs = 8000 } = {}): Promise<T> {
	for (let attempt = 0; ; attempt++) {
		try {
			return await fn();
		} catch (error) {
			const status = error instanceof ExecutionProviderError ? (error.status ?? 0) : 0;
			if (attempt >= retries || !(status === 429 || status >= 500)) throw error;
			const hint = error instanceof ExecutionProviderError ? error.retryAfterMs : undefined;
			await sleep(Math.min(hint ?? baseDelayMs * 2 ** attempt, maxDelayMs));
		}
	}
}

export const toBase64 = (value: string) => Buffer.from(value, "utf8").toString("base64");
export const fromBase64 = (value: string | null | undefined) => (value ? Buffer.from(value, "base64").toString("utf8") : "");

/**
 * Reads optional per-language overrides from a JSON env var, e.g.
 * WANDBOX_COMPILERS='{"PYTHON":"cpython-3.13.8"}'.
 */
export function readLanguageOverrides<T>(envName: string): Partial<Record<LanguageId, T>> {
	const raw = process.env[envName];
	if (!raw) return {};
	try {
		const parsed: unknown = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? (parsed as Partial<Record<LanguageId, T>>) : {};
	} catch {
		console.warn(`[execution] Ignoring ${envName}: not valid JSON`);
		return {};
	}
}

const SIGNALS: Record<number, string> = {
	6: "SIGABRT (aborted)",
	8: "SIGFPE (arithmetic error, e.g. division by zero)",
	9: "SIGKILL (killed - time or memory limit)",
	11: "SIGSEGV (segmentation fault)",
};

/** Describes a POSIX exit status such as 139 (128 + SIGSEGV). */
export function describeExitCode(code: number): string {
	if (code > 128 && SIGNALS[code - 128]) return `Process terminated by ${SIGNALS[code - 128]}`;
	return `Process exited with code ${code}`;
}
