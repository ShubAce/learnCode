import { CheckCircle2, Flame, Send, Target, type LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import type { ProfileData } from "../data";

type Tile = { icon: LucideIcon; label: string; value: number; decimals?: number; suffix?: string; hint: string; accent: string };

export function StatTiles({ stats }: { stats: ProfileData["stats"] }) {
	const tiles: Tile[] = [
		{ icon: CheckCircle2, label: "Problems solved", value: stats.solved, hint: `${stats.activeDays} active days`, accent: "text-success bg-success/10" },
		{
			icon: Target,
			label: "Acceptance rate",
			value: stats.acceptanceRate ?? 0,
			decimals: stats.acceptanceRate !== null && stats.acceptanceRate % 1 !== 0 ? 1 : 0,
			suffix: "%",
			hint: stats.acceptanceRate === null ? "No submissions yet" : "Accepted / all submissions",
			accent: "text-info bg-info/10",
		},
		{ icon: Send, label: "Submissions", value: stats.submissions, hint: `${stats.playlists} playlists`, accent: "text-primary bg-primary/10" },
		{ icon: Flame, label: "Current streak", value: stats.currentStreak, suffix: stats.currentStreak === 1 ? " day" : " days", hint: `Longest: ${stats.longestStreak} days`, accent: "text-brand-2 bg-brand-2/10" },
	];

	return (
		<StaggerGroup className="grid grid-cols-2 gap-3 lg:grid-cols-4">
			{tiles.map((tile) => (
				<StaggerItem key={tile.label}>
					<div className="flex h-full flex-col gap-3 rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur transition-colors hover:border-primary/30">
						<span className={`grid size-9 place-items-center rounded-xl ${tile.accent}`}>
							<tile.icon className="size-4.5" />
						</span>
						<div className="flex flex-col gap-0.5">
							<span className="font-mono text-3xl font-semibold tracking-tight">
								<AnimatedNumber
									value={tile.value}
									decimals={tile.decimals}
									suffix={tile.suffix}
								/>
							</span>
							<span className="text-sm font-medium">{tile.label}</span>
							<span className="text-xs text-muted-foreground">{tile.hint}</span>
						</div>
					</div>
				</StaggerItem>
			))}
		</StaggerGroup>
	);
}
