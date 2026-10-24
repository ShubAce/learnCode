import { Bot, Gauge, Keyboard, Languages, LineChart, ListMusic, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Accent, SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import { AiVisual, LanguagesVisual, PlaylistsVisual, ProgressVisual, VerdictVisual, WorkspaceVisual } from "./feature-visuals";

type Feature = {
	icon: LucideIcon;
	title: string;
	description: string;
	visual: React.ReactNode;
	className: string;
	/** Lay copy and visual side by side on wide screens */
	wide?: boolean;
};

const FEATURES: Feature[] = [
	{
		icon: Gauge,
		title: "A real judge, not a toy",
		description:
			"Every run compiles and executes your code in a sandbox, then grades it against hidden expectations with precise verdicts — from Accepted to Time Limit Exceeded.",
		visual: <VerdictVisual />,
		className: "md:col-span-4",
	},
	{
		icon: Bot,
		title: "An AI tutor that reads your code",
		description: "Ask for a nudge, a complexity check or a code review. It sees the problem and your current solution.",
		visual: <AiVisual />,
		className: "md:col-span-2",
	},
	{
		icon: Languages,
		title: "Your language, your rules",
		description: "Switch languages per problem. Starter code and your drafts follow you.",
		visual: <LanguagesVisual />,
		className: "md:col-span-2",
	},
	{
		icon: LineChart,
		title: "Progress you can see",
		description: "Activity heatmaps, difficulty breakdowns and acceptance stats on your profile.",
		visual: <ProgressVisual />,
		className: "md:col-span-2",
	},
	{
		icon: ListMusic,
		title: "Playlists for focus",
		description: "Group problems into themed lists and work through them at your pace.",
		visual: <PlaylistsVisual />,
		className: "md:col-span-2",
	},
	{
		icon: Keyboard,
		title: "A workspace built like an IDE",
		description:
			"Resizable panes, Monaco — the editor behind VS Code — keyboard shortcuts and automatic drafts. Stay in flow from first idea to accepted solution.",
		visual: <WorkspaceVisual />,
		className: "md:col-span-6",
		wide: true,
	},
];

export function Features() {
	return (
		<section
			id="features"
			className="relative px-4 py-24 sm:px-6"
		>
			<div className="mx-auto max-w-6xl">
				<Reveal>
					<SectionHeading
						eyebrow="Features"
						title={
							<>
								Everything you need to <Accent>get better</Accent>, nothing you don&apos;t
							</>
						}
						description="A focused toolkit for deliberate practice — designed to keep you in flow and show you exactly where you stand."
					/>
				</Reveal>

				<div className="mt-16 grid gap-4 md:grid-cols-6">
					{FEATURES.map((feature, index) => (
						<Reveal
							key={feature.title}
							delay={(index % 3) * 0.08}
							className={cn("h-full", feature.className)}
						>
							<SpotlightCard className="h-full">
								<div className={cn("flex h-full flex-col gap-6 p-6", feature.wide && "md:grid md:grid-cols-2 md:items-center md:gap-12 md:p-8")}>
									<div className="flex flex-col gap-3">
										<span className="grid size-10 place-items-center rounded-xl border bg-primary/10 text-primary">
											<feature.icon className="size-5" />
										</span>
										<h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
										<p className="text-sm text-pretty text-muted-foreground">{feature.description}</p>
									</div>
									<div className="mt-auto">{feature.visual}</div>
								</div>
							</SpotlightCard>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
