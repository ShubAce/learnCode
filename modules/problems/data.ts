import "server-only";

import { cache } from "react";
import { isDifficulty } from "@/config/difficulty";
import { isLanguageId, LANGUAGE_IDS, mapLanguages, type LanguageId } from "@/config/languages";
import { maxOf, parseMetricList } from "@/lib/format";
import { db } from "@/lib/db";
import type { ProblemFormValues } from "./schema";
import type { Example, ProblemListItem, ProblemStatus, SubmissionSummary, TestCase, WorkspaceProblem } from "./types";

/* ───────────── JSON column parsing (stored as Prisma Json) ───────────── */

export function parseTestCases(value: unknown): TestCase[] {
	if (!Array.isArray(value)) return [];
	return value
		.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
		.map((item) => ({ input: String(item.input ?? ""), output: String(item.output ?? ""), hidden: item.hidden === true }));
}

/** Examples are stored per language; the workspace shows each distinct example once. */
export function parseExamples(value: unknown): Example[] {
	const candidates: unknown[] = Array.isArray(value)
		? value
		: value && typeof value === "object"
			? LANGUAGE_IDS.map((id) => (value as Record<string, unknown>)[id])
			: [];

	const seen = new Set<string>();
	const examples: Example[] = [];
	for (const candidate of candidates) {
		if (!candidate || typeof candidate !== "object") continue;
		const { input, output, explanation } = candidate as Record<string, unknown>;
		if (!input && !output) continue;
		const key = `${input}\u0000${output}`;
		if (seen.has(key)) continue;
		seen.add(key);
		examples.push({ input: String(input ?? ""), output: String(output ?? ""), explanation: explanation ? String(explanation) : undefined });
	}
	return examples;
}

export function parseCodeSnippets(value: unknown): Partial<Record<LanguageId, string>> {
	if (!value || typeof value !== "object") return {};
	return Object.fromEntries(
		Object.entries(value as Record<string, unknown>).filter(([key, code]) => isLanguageId(key) && typeof code === "string"),
	) as Partial<Record<LanguageId, string>>;
}

type SubmissionRow = {
	id: string;
	status: string;
	language: string;
	time: string | null;
	memory: string | null;
	createdAt: Date;
	sourcecode: unknown;
};

export function toSubmissionSummary(row: SubmissionRow): SubmissionSummary {
	const source = row.sourcecode as { code?: unknown } | string | null;
	return {
		id: row.id,
		status: row.status,
		language: row.language,
		runtimeMs: maxOf(parseMetricList(row.time, "time")),
		memoryKb: maxOf(parseMetricList(row.memory, "memory")),
		createdAt: row.createdAt,
		code: typeof source === "string" ? source : typeof source?.code === "string" ? source.code : "",
	};
}

/* ───────────── Queries ───────────── */

async function acceptanceByProblem() {
	const rows = await db.submission.groupBy({ by: ["problemId", "status"], _count: { _all: true } });
	const stats = new Map<string, { total: number; accepted: number }>();
	for (const row of rows) {
		const entry = stats.get(row.problemId) ?? { total: 0, accepted: 0 };
		entry.total += row._count._all;
		if (row.status === "Accepted") entry.accepted += row._count._all;
		stats.set(row.problemId, entry);
	}
	return stats;
}

export async function getProblemList(userId: string | null): Promise<ProblemListItem[]> {
	const [problems, acceptance, solved, attempted] = await Promise.all([
		db.problem.findMany({
			select: { id: true, title: true, difficulty: true, tags: true },
			orderBy: { createdAt: "asc" },
		}),
		acceptanceByProblem(),
		userId ? db.problemSolved.findMany({ where: { userId }, select: { problemId: true } }) : [],
		userId ? db.submission.findMany({ where: { userId }, select: { problemId: true }, distinct: ["problemId"] }) : [],
	]);

	const solvedIds = new Set(solved.map((row) => row.problemId));
	const attemptedIds = new Set(attempted.map((row) => row.problemId));

	return problems.map((problem, index) => {
		const stats = acceptance.get(problem.id);
		const status: ProblemStatus = solvedIds.has(problem.id) ? "solved" : attemptedIds.has(problem.id) ? "attempted" : "todo";
		return {
			id: problem.id,
			number: index + 1,
			title: problem.title,
			difficulty: problem.difficulty,
			tags: problem.tags,
			status,
			acceptanceRate: stats && stats.total > 0 ? (stats.accepted / stats.total) * 100 : null,
			submissionCount: stats?.total ?? 0,
		};
	});
}

/** Deduplicated per request — metadata and the page both need it. */
export const getWorkspaceProblem = cache(async (id: string): Promise<WorkspaceProblem | null> => {
	const [problem, ordered, submissionStats] = await Promise.all([
		db.problem.findUnique({
			where: { id },
			select: {
				id: true,
				title: true,
				description: true,
				difficulty: true,
				tags: true,
				constraints: true,
				hints: true,
				editorial: true,
				examples: true,
				testCases: true,
				codeSnippets: true,
			},
		}),
		db.problem.findMany({ select: { id: true, title: true }, orderBy: { createdAt: "asc" } }),
		db.submission.groupBy({ by: ["status"], where: { problemId: id }, _count: { _all: true } }),
	]);

	if (!problem || !isDifficulty(problem.difficulty)) return null;

	const index = ordered.findIndex((item) => item.id === id);
	const total = submissionStats.reduce((sum, row) => sum + row._count._all, 0);
	const accepted = submissionStats.find((row) => row.status === "Accepted")?._count._all ?? 0;
	const testCases = parseTestCases(problem.testCases);

	return {
		id: problem.id,
		number: index + 1,
		total: ordered.length,
		title: problem.title,
		description: problem.description,
		difficulty: problem.difficulty,
		tags: problem.tags,
		constraints: problem.constraints,
		hints: problem.hints,
		editorial: problem.editorial,
		examples: parseExamples(problem.examples),
		// Hidden test cases never leave the server
		testCases: testCases.filter((testCase) => !testCase.hidden).map(({ input, output }) => ({ input, output })),
		hiddenTestCount: testCases.filter((testCase) => testCase.hidden).length,
		codeSnippets: parseCodeSnippets(problem.codeSnippets),
		acceptanceRate: total > 0 ? (accepted / total) * 100 : null,
		prev: ordered[index - 1] ?? null,
		next: ordered[index + 1] ?? null,
	};
});

export async function getSubmissionsForProblem(userId: string, problemId: string): Promise<SubmissionSummary[]> {
	const rows = await db.submission.findMany({
		where: { userId, problemId },
		orderBy: { createdAt: "desc" },
		take: 50,
		select: { id: true, status: true, language: true, time: true, memory: true, createdAt: true, sourcecode: true },
	});
	return rows.map(toSubmissionSummary);
}

export async function hasSolved(userId: string, problemId: string) {
	const row = await db.problemSolved.findUnique({ where: { userId_problemId: { userId, problemId } }, select: { id: true } });
	return Boolean(row);
}

const asRecord = (value: unknown): Record<string, unknown> => (value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {});

/** A stored problem mapped onto the authoring form, including reference solutions — admin editing only. */
export async function getProblemFormValues(id: string): Promise<ProblemFormValues | null> {
	const problem = await db.problem.findUnique({ where: { id } });
	if (!problem) return null;

	const examples = asRecord(problem.examples);
	const snippets = asRecord(problem.codeSnippets);
	const solutions = asRecord(problem.referenceSolutions);
	const testCases = parseTestCases(problem.testCases);

	return {
		title: problem.title,
		description: problem.description,
		difficulty: problem.difficulty,
		tags: problem.tags,
		constraints: problem.constraints,
		hints: problem.hints ?? "",
		editorial: problem.editorial ?? "",
		testCases: testCases.length > 0 ? testCases : [{ input: "", output: "" }],
		examples: mapLanguages((language) => {
			const example = asRecord(examples[language.id]);
			return { input: String(example.input ?? ""), output: String(example.output ?? ""), explanation: String(example.explanation ?? "") };
		}),
		codeSnippets: mapLanguages((language) => (typeof snippets[language.id] === "string" ? (snippets[language.id] as string) : language.template)),
		referenceSolutions: mapLanguages((language) => (typeof solutions[language.id] === "string" ? (solutions[language.id] as string) : "")),
	};
}

export async function getExistingProblemTitles() {
	const problems = await db.problem.findMany({ select: { title: true } });
	return problems.map((problem) => problem.title);
}
