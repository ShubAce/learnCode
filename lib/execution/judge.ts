import "server-only";

import type { LanguageId } from "@/config/languages";
import type { Verdict } from "@/config/verdicts";
import { normalizeOutput, outputsMatch } from "./compare";
import { execute } from "./index";
import type { ExecutionStatus } from "./types";

export type TestCase = { input: string; output: string };

export type TestCaseOutcome = {
	index: number;
	input: string;
	expected: string;
	stdout: string;
	stderr: string;
	compileOutput: string;
	verdict: Verdict;
	passed: boolean;
	timeMs: number | null;
	memoryKb: number | null;
};

export type JudgeReport = {
	verdict: Verdict;
	passedCount: number;
	totalCount: number;
	/** Slowest test case, when the provider reports timings */
	runtimeMs: number | null;
	/** Peak memory across test cases, when reported */
	memoryKb: number | null;
	provider: string;
	outcomes: TestCaseOutcome[];
};

const VERDICT_BY_STATUS: Record<Exclude<ExecutionStatus, "OK">, Verdict> = {
	COMPILATION_ERROR: "Compilation Error",
	RUNTIME_ERROR: "Runtime Error",
	TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
	MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
	INTERNAL_ERROR: "Internal Error",
};

const maxOf = (values: (number | null)[]) => {
	const known = values.filter((value): value is number => value !== null);
	return known.length > 0 ? Math.max(...known) : null;
};

/** Runs `source` against every test case and grades the output. */
export async function judge(language: LanguageId, source: string, testCases: TestCase[]): Promise<JudgeReport> {
	const { provider, results } = await execute(testCases.map((testCase) => ({ language, source, stdin: testCase.input })));

	const outcomes = results.map((result, index): TestCaseOutcome => {
		const expected = normalizeOutput(testCases[index].output);
		const stdout = normalizeOutput(result.stdout);
		const verdict: Verdict =
			result.status === "OK" ? (outputsMatch(stdout, expected) ? "Accepted" : "Wrong Answer") : VERDICT_BY_STATUS[result.status];

		return {
			index,
			input: testCases[index].input,
			expected,
			stdout,
			stderr: result.stderr.trim(),
			compileOutput: result.compileOutput.trim(),
			verdict,
			passed: verdict === "Accepted",
			timeMs: result.timeMs,
			memoryKb: result.memoryKb,
		};
	});

	const firstFailure = outcomes.find((outcome) => !outcome.passed);

	return {
		verdict: firstFailure?.verdict ?? "Accepted",
		passedCount: outcomes.filter((outcome) => outcome.passed).length,
		totalCount: outcomes.length,
		runtimeMs: maxOf(outcomes.map((outcome) => outcome.timeMs)),
		memoryKb: maxOf(outcomes.map((outcome) => outcome.memoryKb)),
		provider,
		outcomes,
	};
}
