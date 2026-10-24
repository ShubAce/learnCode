/**
 * Single source of truth for the programming languages the platform supports.
 *
 * Execution providers map these ids to their own runtimes (see lib/execution/providers),
 * so adding a language here and to each provider map is all it takes to support it.
 */
export type LanguageConfig = {
	id: string;
	label: string;
	/** Monaco editor language id */
	monaco: string;
	extension: string;
	/** Brand colour used for small language chips */
	color: string;
	/** Starter template used when an admin creates a new problem */
	template: string;
};

export const LANGUAGES = {
	JAVASCRIPT: {
		id: "JAVASCRIPT",
		label: "JavaScript",
		monaco: "javascript",
		extension: "js",
		color: "#f7df1e",
		template: `// Read the whole input from stdin
const input = require("fs").readFileSync(0, "utf8").trim();

function solve(input) {
  // Write your code here
}

console.log(solve(input));`,
	},
	PYTHON: {
		id: "PYTHON",
		label: "Python",
		monaco: "python",
		extension: "py",
		color: "#4b8bbe",
		template: `import sys


def solve(data: str):
    # Write your code here
    pass


print(solve(sys.stdin.read().strip()))`,
	},
	JAVA: {
		id: "JAVA",
		label: "Java",
		monaco: "java",
		extension: "java",
		color: "#e76f00",
		template: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your code here
    }
}`,
	},
	CPP: {
		id: "CPP",
		label: "C++",
		monaco: "cpp",
		extension: "cpp",
		color: "#f34b7d",
		template: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,
	},
} as const satisfies Record<string, LanguageConfig>;

export type LanguageId = keyof typeof LANGUAGES;

export const LANGUAGE_IDS = Object.keys(LANGUAGES) as LanguageId[];

export const DEFAULT_LANGUAGE: LanguageId = "JAVASCRIPT";

export function isLanguageId(value: unknown): value is LanguageId {
	return typeof value === "string" && value in LANGUAGES;
}

export function getLanguageLabel(id: string): string {
	return isLanguageId(id) ? LANGUAGES[id].label : id;
}

/** Builds an object with one entry per supported language. */
export function mapLanguages<T>(fn: (language: (typeof LANGUAGES)[LanguageId]) => T): Record<LanguageId, T> {
	return Object.fromEntries(LANGUAGE_IDS.map((id) => [id, fn(LANGUAGES[id])])) as Record<LanguageId, T>;
}
