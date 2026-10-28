import { format, formatDistanceToNowStrict } from "date-fns";

export function formatRuntime(ms: number | null | undefined): string {
	if (ms === null || ms === undefined || Number.isNaN(ms)) return "—";
	return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;
}

export function formatMemory(kb: number | null | undefined): string {
	if (kb === null || kb === undefined || Number.isNaN(kb)) return "—";
	return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

export function formatPercent(value: number | null | undefined, digits = 1): string {
	if (value === null || value === undefined || Number.isNaN(value)) return "—";
	return `${value.toFixed(digits).replace(/\.0+$/, "")}%`;
}

export function formatDate(value: Date | string, pattern = "MMM d, yyyy"): string {
	return format(new Date(value), pattern);
}

export function timeAgo(value: Date | string): string {
	return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

/**
 * Submissions persist per-test metrics as JSON arrays of strings such as ["4032 KB"] or ["0.017 sec"].
 * Returns the numeric values in KB (memory) or milliseconds (time).
 */
export function parseMetricList(raw: string | null | undefined, kind: "memory" | "time"): number[] {
	if (!raw) return [];
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed
			.map((entry) => {
				if (entry === null || entry === undefined) return NaN;
				const value = parseFloat(String(entry));
				if (kind === "time" && /\bs(ec)?\b/.test(String(entry)) && !/ms/.test(String(entry))) return value * 1000;
				return value;
			})
			.filter((value) => Number.isFinite(value));
	} catch {
		return [];
	}
}

export const maxOf = (values: number[]) => (values.length > 0 ? Math.max(...values) : null);
