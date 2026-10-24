import { CheckCircle2, Trophy } from "lucide-react";
import Link from "next/link";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { ProfileData } from "../data";
import { Card } from "./card";

export function SolvedProblems({ solved }: { solved: ProfileData["solvedProblems"] }) {
	return (
		<Card
			title="Solved problems"
			description={solved.length > 0 ? `${solved.length} conquered so far` : undefined}
		>
			{solved.length === 0 ? (
				<EmptyState
					icon={Trophy}
					title="No problems solved yet"
					description="Your first accepted submission will land here. Start with an easy one."
					action={
						<Button
							asChild
							size="sm"
						>
							<Link href="/problems?difficulty=EASY">Find an easy problem</Link>
						</Button>
					}
				/>
			) : (
				<ul className="grid gap-2 sm:grid-cols-2">
					{solved.map((item) => (
						<li key={item.id}>
							<Link
								href={`/problem/${item.problem.id}`}
								className="group flex items-center gap-3 rounded-xl border bg-background/50 p-3 transition-colors hover:border-success/40 hover:bg-success/5"
							>
								<span className="grid size-8 shrink-0 place-items-center rounded-lg bg-success/15 text-success">
									<CheckCircle2 className="size-4" />
								</span>
								<span className="flex min-w-0 flex-col">
									<span className="truncate text-sm font-medium group-hover:text-success">{item.problem.title}</span>
									<span className="text-xs text-muted-foreground">Solved {formatDate(item.solvedAt)}</span>
								</span>
								<DifficultyBadge
									difficulty={item.problem.difficulty}
									className="ml-auto"
								/>
							</Link>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
