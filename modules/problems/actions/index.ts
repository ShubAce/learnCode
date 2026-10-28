"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { judge, type JudgeReport } from "@/lib/execution/judge";
import { getDbUser, requireAdmin } from "@/modules/auth/server";
import { getExistingProblemTitles, parseTestCases, toSubmissionSummary } from "../data";
import { codeExecutionSchema, problemFormSchema, type CodeExecutionInput, type ProblemFormValues } from "../schema";
import type { ActionResult, ExecutionReport, TestCase } from "../types";

/* ───────────── Helpers ───────────── */

const errorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

function friendlyExecutionError(error: unknown) {
	const message = errorMessage(error, "");
	console.error("[judge]", message);
	if (message.includes("429")) return "The code runner is busy right now (rate limited). Wait a few seconds and try again.";
	return "Code execution is temporarily unavailable. Please try again in a moment.";
}

/** Builds the client-facing report, withholding everything that could reveal a hidden test case. */
function toReport(mode: ExecutionReport["mode"], report: JudgeReport, testCases: TestCase[]): ExecutionReport {
	return {
		mode,
		verdict: report.verdict,
		passedCount: report.passedCount,
		totalCount: report.totalCount,
		runtimeMs: report.runtimeMs,
		memoryKb: report.memoryKb,
		provider: report.provider,
		cases: report.outcomes.map((outcome) =>
			testCases[outcome.index]?.hidden ? { ...outcome, input: "", expected: "", stdout: "", stderr: "", hidden: true } : outcome,
		),
	};
}

/** Shared validation for run and submit: signed in, valid input, problem has test cases. */
async function prepareExecution(input: CodeExecutionInput) {
	const parsed = codeExecutionSchema.safeParse(input);
	if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." } as const;

	const user = await getDbUser();
	if (!user) return { ok: false, error: "Sign in to run your code." } as const;

	const problem = await db.problem.findUnique({ where: { id: parsed.data.problemId }, select: { id: true, testCases: true } });
	if (!problem) return { ok: false, error: "This problem no longer exists." } as const;

	// Test cases always come from the database — never trust expected outputs sent by the client.
	const testCases = parseTestCases(problem.testCases);
	if (testCases.length === 0) return { ok: false, error: "This problem has no test cases yet." } as const;

	return { ok: true, user, testCases, ...parsed.data } as const;
}

const metricList = (values: (number | null)[], format: (value: number) => string) =>
	values.some((value) => value !== null) ? JSON.stringify(values.map((value) => (value === null ? null : format(value)))) : null;

const toKb = (kb: number) => `${kb} KB`;
const toSeconds = (ms: number) => `${(ms / 1000).toFixed(3)} sec`;

/* ───────────── Code execution ───────────── */

/** Runs code against the visible test cases (all of them if none are visible) without saving anything. */
export async function runCode(input: CodeExecutionInput): Promise<ActionResult<ExecutionReport>> {
	const prepared = await prepareExecution(input);
	if (!prepared.ok) return { ok: false, error: prepared.error };

	const visible = prepared.testCases.filter((testCase) => !testCase.hidden);
	const testCases = visible.length > 0 ? visible : prepared.testCases;

	try {
		const report = await judge(prepared.language, prepared.code, testCases);
		return { ok: true, data: toReport("run", report, testCases) };
	} catch (error) {
		return { ok: false, error: friendlyExecutionError(error) };
	}
}

/** Judges the code and records the submission, whatever the verdict. */
export async function submitCode(input: CodeExecutionInput): Promise<ActionResult<ExecutionReport>> {
	const prepared = await prepareExecution(input);
	if (!prepared.ok) return { ok: false, error: prepared.error };
	const { user, problemId, language, code, testCases } = prepared;

	let report: JudgeReport;
	try {
		report = await judge(language, code, testCases);
	} catch (error) {
		return { ok: false, error: friendlyExecutionError(error) };
	}

	const accepted = report.verdict === "Accepted";
	const outcomes = report.outcomes;

	try {
		const submission = await db.submission.create({
			data: {
				userId: user.id,
				problemId,
				sourcecode: { code },
				language,
				stdin: testCases.map((testCase) => testCase.input).join("\n"),
				stdout: JSON.stringify(outcomes.map((outcome) => outcome.stdout || null)),
				stderr: outcomes.some((outcome) => outcome.stderr) ? JSON.stringify(outcomes.map((outcome) => outcome.stderr || null)) : null,
				compileOutput: outcomes.some((outcome) => outcome.compileOutput)
					? JSON.stringify(outcomes.map((outcome) => outcome.compileOutput || null))
					: null,
				status: report.verdict,
				memory: metricList(
					outcomes.map((outcome) => outcome.memoryKb),
					toKb,
				),
				time: metricList(
					outcomes.map((outcome) => outcome.timeMs),
					toSeconds,
				),
				testCases: {
					create: outcomes.map((outcome) => ({
						testCase: String(outcome.index + 1),
						passed: outcome.passed,
						stdout: outcome.stdout || null,
						expected: outcome.expected,
						stderr: outcome.stderr || null,
						compileOutput: outcome.compileOutput || null,
						status: outcome.verdict,
						memory: outcome.memoryKb === null ? null : toKb(outcome.memoryKb),
						time: outcome.timeMs === null ? null : toSeconds(outcome.timeMs),
					})),
				},
			},
		});

		// Atomic "insert if absent": concurrent first solves (e.g. two tabs) can't collide on the unique key
		const firstSolve = accepted
			? (await db.problemSolved.createMany({ data: [{ userId: user.id, problemId }], skipDuplicates: true })).count > 0
			: false;

		revalidatePath("/problems");
		revalidatePath("/profile");

		return { ok: true, data: { ...toReport("submit", report, testCases), submission: toSubmissionSummary(submission), firstSolve } };
	} catch (error) {
		console.error("[submit] failed to save submission:", error);
		return { ok: false, error: "Your code was judged, but saving the submission failed. Please try again." };
	}
}

/* ───────────── Problem authoring (admin) ───────────── */

function toProblemData(values: ProblemFormValues) {
	return {
		title: values.title,
		description: values.description,
		difficulty: values.difficulty,
		tags: values.tags,
		examples: values.examples,
		constraints: values.constraints,
		hints: values.hints?.trim() || null,
		editorial: values.editorial?.trim() || null,
		testCases: values.testCases,
		codeSnippets: values.codeSnippets,
		referenceSolutions: values.referenceSolutions,
	};
}

export async function createProblem(values: ProblemFormValues): Promise<ActionResult<{ id: string }>> {
	try {
		const admin = await requireAdmin();
		const parsed = problemFormSchema.safeParse(values);
		if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid problem data." };

		const problem = await db.problem.create({ data: { ...toProblemData(parsed.data), userId: admin.id }, select: { id: true } });
		revalidatePath("/problems");
		revalidatePath("/");
		return { ok: true, data: problem };
	} catch (error) {
		console.error("[createProblem]", error);
		return { ok: false, error: errorMessage(error, "Failed to create the problem.") };
	}
}

export async function updateProblem(problemId: string, values: ProblemFormValues): Promise<ActionResult<{ id: string }>> {
	try {
		await requireAdmin();
		const parsed = problemFormSchema.safeParse(values);
		if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid problem data." };

		const problem = await db.problem.update({ where: { id: problemId }, data: toProblemData(parsed.data), select: { id: true } });
		revalidatePath(`/problem/${problemId}`);
		revalidatePath("/problems");
		return { ok: true, data: problem };
	} catch (error) {
		console.error("[updateProblem]", error);
		return { ok: false, error: errorMessage(error, "Failed to update the problem.") };
	}
}

export async function deleteProblem(problemId: string): Promise<ActionResult> {
	try {
		await requireAdmin();
		await db.problem.delete({ where: { id: problemId } });
		revalidatePath("/problems");
		revalidatePath("/");
		return { ok: true, data: undefined };
	} catch (error) {
		console.error("[deleteProblem]", error);
		return { ok: false, error: errorMessage(error, "Failed to delete the problem.") };
	}
}

/** Titles already published, so the sample loader can skip them. */
export async function listProblemTitles(): Promise<string[]> {
	await requireAdmin();
	return getExistingProblemTitles();
}
