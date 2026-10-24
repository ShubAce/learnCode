/** Normalises program output: unify line endings, strip trailing spaces per line and surrounding blank lines. */
export function normalizeOutput(value: string | null | undefined): string {
	if (!value) return "";
	return value
		.replace(/\r\n?/g, "\n")
		.split("\n")
		.map((line) => line.trimEnd())
		.join("\n")
		.trim();
}

const tokens = (value: string) => value.split(/\s+/).filter(Boolean);

/** Parses JSON-ish literals, accepting Python spellings such as True / None and single quotes. */
function parseLiteral(value: string): unknown {
	if (!/^[[{]/.test(value)) return undefined;
	try {
		return JSON.parse(value.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null").replace(/'/g, '"'));
	} catch {
		return undefined;
	}
}

function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
	if (Array.isArray(a) !== Array.isArray(b)) return false;
	const keysA = Object.keys(a as object);
	const keysB = Object.keys(b as object);
	return keysA.length === keysB.length && keysA.every((key) => deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
}

/**
 * Compares normalised outputs. Beyond an exact match it tolerates harmless formatting differences:
 * spacing between tokens, `[1, 2]` vs `[1,2]`, and Python's `True` vs `true`.
 */
export function outputsMatch(actual: string, expected: string): boolean {
	if (actual === expected) return true;

	const a = tokens(actual);
	const e = tokens(expected);
	if (a.length === e.length && a.every((token, i) => token === e[i])) return true;

	if (/^(true|false)$/i.test(actual) && /^(true|false)$/i.test(expected)) return actual.toLowerCase() === expected.toLowerCase();

	const parsedActual = parseLiteral(actual);
	const parsedExpected = parseLiteral(expected);
	return parsedActual !== undefined && parsedExpected !== undefined && deepEqual(parsedActual, parsedExpected);
}
