import "server-only";

import { createHash } from "node:crypto";
import { judge0Provider } from "./providers/judge0";
import { pistonProvider } from "./providers/piston";
import { wandboxProvider } from "./providers/wandbox";
import type { ExecutionProvider, ExecutionRequest, ExecutionResult, ProviderId } from "./types";

export type { ExecutionRequest, ExecutionResult } from "./types";

const PROVIDERS: Record<ProviderId, ExecutionProvider> = {
	wandbox: wandboxProvider,
	judge0: judge0Provider,
	piston: pistonProvider,
};

const isProviderId = (value: string): value is ProviderId => value in PROVIDERS;

/**
 * Providers are tried in the order given by CODE_EXECUTION_PROVIDERS (comma separated),
 * e.g. "judge0,wandbox" uses Judge0 and falls back to Wandbox if it is down or out of quota.
 * Unconfigured providers are skipped; Wandbox is the key-less default.
 */
export function getProviderChain(): ExecutionProvider[] {
	const requested = (process.env.CODE_EXECUTION_PROVIDERS ?? "wandbox")
		.split(",")
		.map((value) => value.trim().toLowerCase())
		.filter(isProviderId);

	const chain = requested.map((id) => PROVIDERS[id]).filter((provider) => provider.isConfigured());
	return chain.length > 0 ? chain : [wandboxProvider];
}

/*
 * Execution is deterministic for a given (language, source, stdin), so results are cached briefly.
 * Running and then submitting unchanged code costs no extra provider calls, which matters on rate-limited hosts.
 */
type CacheEntry = { result: ExecutionResult; provider: string; expiresAt: number };

const CACHE_TTL_MS = 10 * 60_000;
const CACHE_MAX_ENTRIES = 500;
const globalForCache = globalThis as unknown as { executionCache?: Map<string, CacheEntry> };
const cache = (globalForCache.executionCache ??= new Map());

const cacheKey = ({ language, source, stdin }: ExecutionRequest) => createHash("sha256").update(`${language}\0${source}\0${stdin}`).digest("hex");

// Infrastructure-dependent outcomes may succeed on retry, so they are never cached.
const isCacheable = (result: ExecutionResult) => result.status !== "INTERNAL_ERROR" && result.status !== "TIME_LIMIT_EXCEEDED";

function remember(key: string, entry: Omit<CacheEntry, "expiresAt">) {
	if (cache.size >= CACHE_MAX_ENTRIES) cache.delete(cache.keys().next().value!);
	cache.set(key, { ...entry, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function runOnChain(requests: ExecutionRequest[]): Promise<{ provider: string; results: ExecutionResult[] }> {
	const failures: string[] = [];

	for (const provider of getProviderChain()) {
		try {
			return { provider: provider.label, results: await provider.execute(requests) };
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			console.error(`[execution] ${provider.label} failed, trying next provider:`, reason);
			failures.push(reason);
		}
	}

	throw new Error(`Code execution is temporarily unavailable. ${failures.join(" | ")}`);
}

export async function execute(requests: ExecutionRequest[]): Promise<{ provider: string; results: ExecutionResult[] }> {
	if (requests.length === 0) return { provider: "none", results: [] };

	const keys = requests.map(cacheKey);
	const now = Date.now();
	const hits = keys.map((key) => {
		const entry = cache.get(key);
		return entry && entry.expiresAt > now ? entry : undefined;
	});

	const missing = requests.map((request, index) => ({ request, index })).filter(({ index }) => !hits[index]);
	if (missing.length === 0) return { provider: hits[0]!.provider, results: hits.map((hit) => hit!.result) };

	const { provider, results } = await runOnChain(missing.map(({ request }) => request));

	const merged = hits.map((hit) => hit?.result);
	missing.forEach(({ index }, i) => {
		merged[index] = results[i];
		if (isCacheable(results[i])) remember(keys[index], { result: results[i], provider });
	});

	return { provider, results: merged as ExecutionResult[] };
}
