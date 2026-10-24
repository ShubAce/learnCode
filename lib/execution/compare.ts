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

const sameTokens = (a: string, b: string) => {
	const left = tokens(a);
	const right = tokens(b);
	return left.length === right.length && left.every((token, i) => token === right[i]);
};

const PYTHON_LITERALS: Record<string, string> = { True: "true", False: "false", None: "null" };

/**
 * Canonical form of a JSON / Python literal such as `[1, 2]`, `['a', "b"]` or `{'k': True}`:
 * whitespace outside strings is dropped, quotes become double quotes and Python keywords map to JSON.
 * Numbers stay as text, so large integers are compared exactly. Returns undefined for non-literals.
 */
function canonicalLiteral(value: string): string | undefined {
	if (!/^[[{(]/.test(value)) return undefined;

	let out = "";
	let bare = "";
	let quote: string | null = null;
	const flushBare = () => {
		out += bare.replace(/\b(True|False|None)\b/g, (word) => PYTHON_LITERALS[word]);
		bare = "";
	};

	for (let i = 0; i < value.length; i++) {
		const char = value[i];
		if (quote) {
			if (char === "\\") {
				out += char + (value[i + 1] ?? "");
				i++;
			} else if (char === quote) {
				out += '"';
				quote = null;
			} else {
				out += char === '"' ? '\\"' : char;
			}
		} else if (char === '"' || char === "'") {
			flushBare();
			quote = char;
			out += '"';
		} else if (!/\s/.test(char)) {
			bare += char === "(" ? "[" : char === ")" ? "]" : char;
		}
	}
	flushBare();
	return quote ? undefined : out;
}

function linesMatch(actual: string, expected: string): boolean {
	if (actual === expected || sameTokens(actual, expected)) return true;
	if (/^(true|false)$/i.test(actual) && /^(true|false)$/i.test(expected)) return actual.toLowerCase() === expected.toLowerCase();
	const canonicalActual = canonicalLiteral(actual.trim());
	return canonicalActual !== undefined && canonicalActual === canonicalLiteral(expected.trim());
}

/**
 * Compares normalised outputs. Beyond an exact match it tolerates harmless formatting differences:
 * spacing between tokens, `[1, 2]` vs `[1,2]`, Python's `True` vs `true`, and values split
 * across lines differently (`1 2 3` vs one value per line).
 */
export function outputsMatch(actual: string, expected: string): boolean {
	if (actual === expected) return true;

	const actualLines = actual.split("\n");
	const expectedLines = expected.split("\n");
	if (actualLines.length === expectedLines.length && actualLines.every((line, i) => linesMatch(line, expectedLines[i]))) return true;

	return sameTokens(actual, expected);
}
