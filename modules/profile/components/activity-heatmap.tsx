import { format, parseISO } from "date-fns";
import { cn, pluralize } from "@/lib/utils";
import type { HeatmapDay } from "../data";
import { Card } from "./card";

const LEVELS = ["bg-muted", "bg-primary/25", "bg-primary/45", "bg-primary/70", "bg-primary"];
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const levelFor = (count: number, max: number) => (count === 0 ? 0 : Math.min(4, Math.ceil((count / Math.max(max, 1)) * 4)));

export function ActivityHeatmap({ days, activeDays }: { days: HeatmapDay[]; activeDays: number }) {
	const max = Math.max(0, ...days.map((day) => day.count));
	const total = days.reduce((sum, day) => sum + day.count, 0);

	// Group into week columns (days start on a Sunday)
	const weeks: HeatmapDay[][] = [];
	for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

	return (
		<Card
			title="Activity"
			description={`${pluralize(total, "submission")} in the last 6 months · ${pluralize(activeDays, "active day")} overall`}
		>
			<div className="overflow-x-auto pb-1">
				<div className="flex min-w-fit gap-[3px]">
					<div className="mr-1 grid grid-rows-7 gap-[3px] pt-5 text-[10px] text-muted-foreground">
						{WEEKDAY_LABELS.map((label, i) => (
							<span
								key={i}
								className="flex h-3 items-center leading-none"
							>
								{label}
							</span>
						))}
					</div>
					{weeks.map((week, weekIndex) => {
						const firstOfMonth = week.find((day) => day.date.endsWith("-01")) ?? (weekIndex === 0 ? week[0] : undefined);
						return (
							<div
								key={week[0].date}
								className="flex flex-col gap-[3px]"
							>
								<span className="h-4 text-[10px] whitespace-nowrap text-muted-foreground">{firstOfMonth ? format(parseISO(firstOfMonth.date), "MMM") : ""}</span>
								{week.map((day) => (
									<span
										key={day.date}
										title={`${pluralize(day.count, "submission")} on ${format(parseISO(day.date), "MMM d, yyyy")}`}
										className={cn("size-3 rounded-[3px] transition-transform hover:scale-125", LEVELS[levelFor(day.count, max)])}
									/>
								))}
							</div>
						);
					})}
				</div>
			</div>
			<div className="flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
				Less
				{LEVELS.map((level) => (
					<span
						key={level}
						className={cn("size-3 rounded-[3px]", level)}
					/>
				))}
				More
			</div>
		</Card>
	);
}
