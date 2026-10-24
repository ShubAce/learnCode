import type { Difficulty } from "@/config/difficulty";
import type { LanguageId } from "@/config/languages";
import type { Verdict } from "@/config/verdicts";

export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

export type ProblemStatus = "solved" | "attempted" | "todo";

export type ProblemListItem = {
	id: string;
	/** 1-based position in creation order, shown like "12." */
	number: number;
	title: string;
	difficulty: Difficulty;
	tags: string[];
	status: ProblemStatus;
	acceptanceRate: number | null;
	submissionCount: number;
};

export type Example = { input: string; output: string; explanation?: string };

export type TestCase = { input: string; output: string };

export type ProblemNeighbor = { id: string; title: string } | null;

/** Everything the solving workspace needs — never includes reference solutions. */
export type WorkspaceProblem = {
	id: string;
	number: number;
	total: number;
	title: string;
	description: string;
	difficulty: Difficulty;
	tags: string[];
	constraints: string;
	hints: string | null;
	editorial: string | null;
	examples: Example[];
	testCases: TestCase[];
	codeSnippets: Partial<Record<LanguageId, string>>;
	acceptanceRate: number | null;
	prev: ProblemNeighbor;
	next: ProblemNeighbor;
};

export type SubmissionSummary = {
	id: string;
	status: string;
	language: string;
	runtimeMs: number | null;
	memoryKb: number | null;
	createdAt: Date;
	code: string;
};

export type CaseResult = {
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

export type ExecutionReport = {
	mode: "run" | "submit";
	verdict: Verdict;
	passedCount: number;
	totalCount: number;
	runtimeMs: number | null;
	memoryKb: number | null;
	provider: string;
	cases: CaseResult[];
	/** Present after a submission was saved */
	submission?: SubmissionSummary;
	/** True the first time this user gets the problem accepted */
	firstSolve?: boolean;
};
