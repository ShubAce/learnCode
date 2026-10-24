import { ArrowUpRight, History } from "lucide-react";
import Link from "next/link";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LanguageChip } from "@/components/shared/language-chip";
import { VerdictBadge } from "@/components/shared/verdict-badge";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/format";
import type { ProfileData } from "../data";
import { Card } from "./card";

export function RecentSubmissions({ submissions }: { submissions: ProfileData["recentSubmissions"] }) {
	return (
		<Card
			title="Recent submissions"
			description="Your latest attempts across all problems"
		>
			{submissions.length === 0 ? (
				<EmptyState
					icon={History}
					title="No submissions yet"
					description="Solve your first problem and it will appear here."
					action={
						<Button
							asChild
							size="sm"
						>
							<Link href="/problems">Browse problems</Link>
						</Button>
					}
				/>
			) : (
				<ul className="-mx-2 flex flex-col">
					{submissions.map((submission) => (
						<li key={submission.id}>
							<Link
								href={`/problem/${submission.problem.id}`}
								className="group flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent/50"
							>
								<div className="flex min-w-0 flex-1 flex-col gap-1">
									<span className="flex items-center gap-1.5 truncate text-sm font-medium group-hover:text-primary">
										{submission.problem.title}
										<ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
									</span>
									<span className="text-xs text-muted-foreground">{timeAgo(submission.createdAt)}</span>
								</div>
								<div className="flex items-center gap-2">
									<LanguageChip language={submission.language} />
									<DifficultyBadge
										difficulty={submission.problem.difficulty}
										className="hidden sm:inline-flex"
									/>
									<VerdictBadge status={submission.status} />
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
