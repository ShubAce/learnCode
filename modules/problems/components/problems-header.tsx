import { LogIn, Trophy } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ProgressRing } from "@/components/shared/progress-ring";
import { Accent, Eyebrow } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { DIFFICULTIES, DIFFICULTY_META } from "@/config/difficulty";
import { cn } from "@/lib/utils";
import type { ProblemListItem } from "../types";

const RING_STROKE = { EASY: "stroke-easy", MEDIUM: "stroke-medium", HARD: "stroke-hard" } as const;

export function ProblemsHeader({ problems, isSignedIn }: { problems: ProblemListItem[]; isSignedIn: boolean }) {
	const totals = Object.fromEntries(DIFFICULTIES.map((d) => [d, problems.filter((p) => p.difficulty === d).length]));
	const solved = Object.fromEntries(DIFFICULTIES.map((d) => [d, problems.filter((p) => p.difficulty === d && p.status === "solved").length]));
	const solvedTotal = Object.values(solved).reduce((a, b) => a + b, 0);

	return (
		<div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
			<Reveal className="flex flex-col gap-4">
				<Eyebrow className="w-fit">Problem set</Eyebrow>
				<h1 className="text-4xl font-semibold tracking-tighter text-balance sm:text-5xl">
					Sharpen your skills, <Accent>one problem</Accent> at a time
				</h1>
				<p className="max-w-xl text-pretty text-muted-foreground">
					{problems.length} hand-picked challenges across {new Set(problems.flatMap((p) => p.tags)).size} topics. Filter, search, or let us pick one
					for you.
				</p>
			</Reveal>

			<Reveal delay={0.1}>
				<div className="flex items-center gap-6 rounded-2xl border bg-card/70 p-5 shadow-sm backdrop-blur lg:min-w-[25rem]">
					{isSignedIn ? (
						<>
							<ProgressRing
								size={112}
								strokeWidth={9}
								total={problems.length}
								segments={DIFFICULTIES.map((d) => ({ value: solved[d], className: RING_STROKE[d] }))}
							>
								<div className="flex flex-col items-center">
									<span className="font-mono text-2xl font-semibold">{solvedTotal}</span>
									<span className="text-[10px] tracking-wider text-muted-foreground uppercase">of {problems.length}</span>
								</div>
							</ProgressRing>
							<div className="flex flex-1 flex-col gap-3">
								{DIFFICULTIES.map((d) => (
									<div
										key={d}
										className="flex flex-col gap-1.5"
									>
										<div className="flex items-center justify-between text-xs">
											<span className={cn("font-medium", DIFFICULTY_META[d].classes.text)}>{DIFFICULTY_META[d].label}</span>
											<span className="font-mono text-muted-foreground">
												{solved[d]}/{totals[d]}
											</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded-full bg-muted">
											<div
												className={cn("h-full rounded-full", DIFFICULTY_META[d].classes.solid)}
												style={{ width: `${totals[d] ? (solved[d] / totals[d]) * 100 : 0}%` }}
											/>
										</div>
									</div>
								))}
							</div>
						</>
					) : (
						<div className="flex items-center gap-4">
							<div className="grid size-12 shrink-0 place-items-center rounded-xl border bg-primary/10 text-primary">
								<Trophy className="size-5" />
							</div>
							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium">Track your progress</p>
								<p className="text-xs text-muted-foreground">Sign in to save submissions, playlists and streaks.</p>
								<Button
									asChild
									size="sm"
									className="w-fit rounded-full"
								>
									<Link href="/sign-in">
										<LogIn /> Sign in
									</Link>
								</Button>
							</div>
						</div>
					)}
				</div>
			</Reveal>
		</div>
	);
}
