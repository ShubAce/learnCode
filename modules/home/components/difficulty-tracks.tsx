import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { Accent, SectionHeading } from "@/components/shared/section-heading";
import { DIFFICULTIES, DIFFICULTY_META, type Difficulty } from "@/config/difficulty";
import { cn } from "@/lib/utils";
import type { PlatformStats } from "@/modules/home/data";

type DifficultyTracksProps = {
	stats: PlatformStats;
	/** Solved counts for the signed-in user, or null for guests */
	solved: Record<Difficulty, number> | null;
};

export function DifficultyTracks({ stats, solved }: DifficultyTracksProps) {
	return (
		<section className="px-4 py-24 sm:px-6">
			<div className="mx-auto max-w-6xl">
				<Reveal>
					<SectionHeading
						eyebrow="Tracks"
						title={
							<>
								Pick a level. <Accent>Climb</Accent> from there.
							</>
						}
						description="Problems are graded by difficulty so you always know what you're walking into — and what to tackle next."
					/>
				</Reveal>

				<div className="mt-16 grid gap-4 md:grid-cols-3">
					{DIFFICULTIES.map((difficulty, index) => {
						const meta = DIFFICULTY_META[difficulty];
						const total = stats.problems[difficulty];
						const done = solved?.[difficulty] ?? 0;
						const percent = total > 0 ? Math.round((done / total) * 100) : 0;

						return (
							<Reveal
								key={difficulty}
								delay={index * 0.1}
							>
								<SpotlightCard className="h-full">
									<div
										aria-hidden
										className={cn("pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b to-transparent opacity-70", meta.classes.glow)}
									/>
									<div className="relative flex h-full flex-col gap-5 p-7">
										<div className="flex items-center justify-between">
											<span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">{meta.level}</span>
											<DifficultyBadge difficulty={difficulty} />
										</div>
										<div className="flex items-baseline gap-2 pt-4">
											<span className="font-mono text-6xl font-semibold tracking-tighter">
												<AnimatedNumber value={total} />
											</span>
											<span className="text-sm text-muted-foreground">{total === 1 ? "problem" : "problems"}</span>
										</div>
										<p className="text-sm text-pretty text-muted-foreground">{meta.blurb}</p>

										{solved && (
											<div className="flex flex-col gap-2">
												<div className="flex justify-between text-xs">
													<span className="text-muted-foreground">Your progress</span>
													<span className="font-mono font-medium">
														{done}/{total}
													</span>
												</div>
												<div className="h-1.5 overflow-hidden rounded-full bg-muted">
													<div
														className={cn("h-full rounded-full transition-[width] duration-1000", meta.classes.solid)}
														style={{ width: `${percent}%` }}
													/>
												</div>
											</div>
										)}

										<Link
											href={`/problems?difficulty=${difficulty}`}
											className={cn("group mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium", meta.classes.text)}
										>
											Browse {meta.label.toLowerCase()} problems
											<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
										</Link>
									</div>
								</SpotlightCard>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}
