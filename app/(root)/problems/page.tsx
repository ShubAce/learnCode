import type { Metadata } from "next";
import { isDifficulty } from "@/config/difficulty";
import { getDbUser } from "@/modules/auth/server";
import { ProblemExplorer } from "@/modules/problems/components/problem-explorer";
import { ProblemsHeader } from "@/modules/problems/components/problems-header";
import { getProblemList } from "@/modules/problems/data";

export const metadata: Metadata = {
	title: "Problems",
	description: "Browse, filter and solve curated coding problems by difficulty and topic.",
};

type ProblemsPageProps = {
	searchParams: Promise<{ difficulty?: string }>;
};

export default async function ProblemsPage({ searchParams }: ProblemsPageProps) {
	const [user, params] = await Promise.all([getDbUser(), searchParams]);
	const problems = await getProblemList(user?.id ?? null);

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-32 pb-8 sm:px-6">
			<ProblemsHeader
				problems={problems}
				isSignedIn={Boolean(user)}
			/>
			<ProblemExplorer
				problems={problems}
				isSignedIn={Boolean(user)}
				isAdmin={user?.role === "ADMIN"}
				initialDifficulty={isDifficulty(params.difficulty) ? params.difficulty : "ALL"}
			/>
		</div>
	);
}
