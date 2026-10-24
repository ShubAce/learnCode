import { ProgressRing } from "@/components/shared/progress-ring";
import { DIFFICULTIES, DIFFICULTY_META, type Difficulty } from "@/config/difficulty";
import { cn } from "@/lib/utils";
import { Card } from "./card";

const STROKES: Record<Difficulty, string> = { EASY: "stroke-easy", MEDIUM: "stroke-medium", HARD: "stroke-hard" };

type DifficultyBreakdownProps = {
	solved: Record<Difficulty, number>;
	totals: Record<Difficulty, number>;
};

export function DifficultyBreakdown({ solved, totals }: DifficultyBreakdownProps) {
	const solvedTotal = DIFFICULTIES.reduce((sum, d) => sum + solved[d], 0);
	const total = DIFFICULTIES.reduce((sum, d) => sum + totals[d], 0);

	return (
		<Card
			title="Solved by difficulty"
			description={`${solvedTotal} of ${total} problems`}
		>
			<div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row">
				<ProgressRing
					size={140}
					strokeWidth={10}
					total={total}
					segments={DIFFICULTIES.map((d) => ({ value: solved[d], className: STROKES[d] }))}
				>
					<div className="flex flex-col items-center">
						<span className="font-mono text-3xl font-semibold">{solvedTotal}</span>
						<span className="text-[11px] tracking-wider text-muted-foreground uppercase">solved</span>
					</div>
				</ProgressRing>
				<div className="flex w-full flex-1 flex-col gap-4">
					{DIFFICULTIES.map((d) => {
						const meta = DIFFICULTY_META[d];
						return (
							<div
								key={d}
								className="flex flex-col gap-1.5"
							>
								<div className="flex items-center justify-between text-sm">
									<span className={cn("font-medium", meta.classes.text)}>{meta.label}</span>
									<span className="font-mono text-xs text-muted-foreground">
										{solved[d]} / {totals[d]}
									</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-muted">
									<div
										className={cn("h-full rounded-full transition-[width] duration-1000", meta.classes.solid)}
										style={{ width: `${totals[d] ? (solved[d] / totals[d]) * 100 : 0}%` }}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</Card>
	);
}
