import "server-only";

import { cache } from "react";
import { DIFFICULTIES, type Difficulty } from "@/config/difficulty";
import { LANGUAGE_IDS } from "@/config/languages";
import { db } from "@/lib/db";

export type PlatformStats = {
	problems: Record<Difficulty, number> & { total: number };
	developers: number;
	submissions: number;
	acceptanceRate: number | null;
	languages: number;
	tags: string[];
};

/** Live numbers for the marketing pages — nothing here is hard-coded. */
export const getPlatformStats = cache(async (): Promise<PlatformStats> => {
	const [byDifficulty, developers, submissions, accepted, tagRows] = await Promise.all([
		db.problem.groupBy({ by: ["difficulty"], _count: { _all: true } }),
		db.user.count(),
		db.submission.count(),
		db.submission.count({ where: { status: "Accepted" } }),
		db.problem.findMany({ select: { tags: true } }),
	]);

	const problems = Object.fromEntries(DIFFICULTIES.map((d) => [d, 0])) as Record<Difficulty, number>;
	for (const row of byDifficulty) problems[row.difficulty] = row._count._all;

	const tagCounts = new Map<string, number>();
	for (const { tags } of tagRows) for (const tag of tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);

	return {
		problems: { ...problems, total: Object.values(problems).reduce((a, b) => a + b, 0) },
		developers,
		submissions,
		acceptanceRate: submissions > 0 ? (accepted / submissions) * 100 : null,
		languages: LANGUAGE_IDS.length,
		tags: [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag),
	};
});

/** How many problems of each difficulty the user has solved. */
export const getSolvedByDifficulty = cache(async (userId: string): Promise<Record<Difficulty, number>> => {
	const solved = await db.problemSolved.findMany({
		where: { userId },
		select: { problem: { select: { difficulty: true } } },
	});

	const counts = Object.fromEntries(DIFFICULTIES.map((d) => [d, 0])) as Record<Difficulty, number>;
	for (const { problem } of solved) counts[problem.difficulty] += 1;
	return counts;
});
