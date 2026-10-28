import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDbUser } from "@/modules/auth/server";
import { ProblemWorkspace } from "@/modules/problems/components/workspace/problem-workspace";
import { getSubmissionsForProblem, getWorkspaceProblem, hasSolved } from "@/modules/problems/data";

type ProblemPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
	const { id } = await params;
	const problem = await getWorkspaceProblem(id);
	return problem
		? { title: `${problem.number}. ${problem.title}`, description: problem.description.slice(0, 160) }
		: { title: "Problem not found" };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
	const { id } = await params;
	const [problem, user] = await Promise.all([getWorkspaceProblem(id), getDbUser()]);
	if (!problem) notFound();

	const [submissions, solved] = user ? await Promise.all([getSubmissionsForProblem(user.id, id), hasSolved(user.id, id)]) : [[], false];

	return (
		<ProblemWorkspace
			key={problem.id}
			problem={problem}
			initialSubmissions={submissions}
			initialSolved={solved}
			isSignedIn={Boolean(user)}
		/>
	);
}
