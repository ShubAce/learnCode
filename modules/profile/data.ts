import "server-only";

import { addDays, differenceInCalendarDays, format, startOfWeek, subWeeks } from "date-fns";
import { DIFFICULTIES, type Difficulty } from "@/config/difficulty";
import { db } from "@/lib/db";

const HEATMAP_WEEKS = 26;

export type HeatmapDay = { date: string; count: number };

const dayKey = (date: Date) => format(date, "yyyy-MM-dd");
const emptyByDifficulty = () => Object.fromEntries(DIFFICULTIES.map((d) => [d, 0])) as Record<Difficulty, number>;

function computeStreaks(activeDays: Set<string>) {
	const sorted = [...activeDays].sort();
	let longest = 0;
	let run = 0;
	let previous: Date | null = null;
	for (const key of sorted) {
		const date = new Date(`${key}T00:00:00`);
		run = previous && differenceInCalendarDays(date, previous) === 1 ? run + 1 : 1;
		longest = Math.max(longest, run);
		previous = date;
	}

	// The current streak may end today or yesterday (today isn't over yet)
	let current = 0;
	let cursor = new Date();
	if (!activeDays.has(dayKey(cursor))) cursor = addDays(cursor, -1);
	while (activeDays.has(dayKey(cursor))) {
		current += 1;
		cursor = addDays(cursor, -1);
	}

	return { current, longest };
}

function buildHeatmap(counts: Map<string, number>): HeatmapDay[] {
	const today = new Date();
	const start = startOfWeek(subWeeks(today, HEATMAP_WEEKS - 1));
	const days: HeatmapDay[] = [];
	for (let date = start; date <= today; date = addDays(date, 1)) {
		days.push({ date: dayKey(date), count: counts.get(dayKey(date)) ?? 0 });
	}
	return days;
}

export async function getProfileData(userId: string) {
	const [user, submissions, recentSubmissions, solvedProblems, playlists, problemTotals] = await Promise.all([
		db.user.findUniqueOrThrow({
			where: { id: userId },
			select: { firstName: true, lastName: true, email: true, imageUrl: true, role: true, createdAt: true },
		}),
		db.submission.findMany({ where: { userId }, select: { status: true, language: true, createdAt: true } }),
		db.submission.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			take: 8,
			select: { id: true, status: true, language: true, createdAt: true, problem: { select: { id: true, title: true, difficulty: true } } },
		}),
		db.problemSolved.findMany({
			where: { userId },
			orderBy: { solvedAt: "desc" },
			select: { id: true, solvedAt: true, problem: { select: { id: true, title: true, difficulty: true, tags: true } } },
		}),
		db.playlist.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			select: { id: true, name: true, description: true, createdAt: true, _count: { select: { problems: true } } },
		}),
		db.problem.groupBy({ by: ["difficulty"], _count: { _all: true } }),
	]);

	const solvedByDifficulty = emptyByDifficulty();
	for (const { problem } of solvedProblems) solvedByDifficulty[problem.difficulty] += 1;

	const totalsByDifficulty = emptyByDifficulty();
	for (const row of problemTotals) totalsByDifficulty[row.difficulty] = row._count._all;

	const dailyCounts = new Map<string, number>();
	const languageCounts = new Map<string, number>();
	let accepted = 0;
	for (const submission of submissions) {
		const key = dayKey(submission.createdAt);
		dailyCounts.set(key, (dailyCounts.get(key) ?? 0) + 1);
		languageCounts.set(submission.language, (languageCounts.get(submission.language) ?? 0) + 1);
		if (submission.status === "Accepted") accepted += 1;
	}

	const streaks = computeStreaks(new Set(dailyCounts.keys()));

	return {
		user,
		stats: {
			solved: solvedProblems.length,
			submissions: submissions.length,
			acceptanceRate: submissions.length > 0 ? (accepted / submissions.length) * 100 : null,
			currentStreak: streaks.current,
			longestStreak: streaks.longest,
			activeDays: dailyCounts.size,
			playlists: playlists.length,
		},
		solvedByDifficulty,
		totalsByDifficulty,
		languages: [...languageCounts.entries()].map(([language, count]) => ({ language, count })).sort((a, b) => b.count - a.count),
		heatmap: buildHeatmap(dailyCounts),
		recentSubmissions,
		solvedProblems,
		playlists: playlists.map(({ _count, ...playlist }) => ({ ...playlist, problemCount: _count.problems })),
	};
}

export type ProfileData = Awaited<ReturnType<typeof getProfileData>>;
