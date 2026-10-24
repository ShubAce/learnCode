import { ArrowUpRight, Compass, HeartHandshake, Scale } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { GitHubIcon } from "@/components/brand/github-icon";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Accent, Eyebrow, SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { TECH_STACK } from "@/config/stack";
import { JudgePipeline } from "@/modules/home/components/judge-pipeline";
import { getPlatformStats } from "@/modules/home/data";

export const metadata: Metadata = {
	title: "About",
	description: `Why ${siteConfig.name} exists, how its judge works and what it's built with.`,
};

const PRINCIPLES = [
	{
		icon: Compass,
		title: "Deliberate practice",
		description: "Short, focused problems with instant feedback beat passive reading. Every feature is built to keep you writing code.",
	},
	{
		icon: Scale,
		title: "Honest feedback",
		description: "A real judge compiles and runs your code against hidden testcases. No green ticks you didn't earn.",
	},
	{
		icon: HeartHandshake,
		title: "Learning over copying",
		description: "Hints, editorials and the AI tutor nudge you towards the idea instead of handing over the answer.",
	},
];

export default async function AboutPage() {
	const stats = await getPlatformStats();

	const liveStats = [
		{ label: "Problems", value: stats.problems.total },
		{ label: "Developers", value: stats.developers },
		{ label: "Submissions judged", value: stats.submissions },
		{ label: "Acceptance rate", value: stats.acceptanceRate ?? 0, suffix: "%", decimals: 0 },
	];

	return (
		<div className="flex flex-col">
			<section className="px-4 pt-36 pb-16 sm:px-6">
				<Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
					<Eyebrow>About {siteConfig.name}</Eyebrow>
					<h1 className="text-5xl leading-[1.05] font-semibold tracking-tighter text-balance sm:text-6xl">
						Built for people who <Accent>love</Accent> solving problems
					</h1>
					<p className="max-w-2xl text-lg text-pretty text-muted-foreground">
						{siteConfig.name} is an open-source practice platform for algorithms and data structures — a focused place to sharpen problem-solving
						skills, prepare for interviews and actually enjoy the grind.
					</p>
				</Reveal>
			</section>

			<section className="px-4 py-12 sm:px-6">
				<StaggerGroup className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
					{PRINCIPLES.map((principle) => (
						<StaggerItem key={principle.title}>
							<SpotlightCard className="h-full">
								<div className="flex flex-col gap-4 p-7">
									<span className="grid size-11 place-items-center rounded-xl border bg-primary/10 text-primary">
										<principle.icon className="size-5" />
									</span>
									<h2 className="text-lg font-semibold tracking-tight">{principle.title}</h2>
									<p className="text-sm text-pretty text-muted-foreground">{principle.description}</p>
								</div>
							</SpotlightCard>
						</StaggerItem>
					))}
				</StaggerGroup>
			</section>

			<section className="px-4 py-24 sm:px-6">
				<div className="mx-auto flex max-w-6xl flex-col gap-16">
					<Reveal>
						<SectionHeading
							eyebrow="Under the hood"
							title={
								<>
									How a submission gets <Accent>judged</Accent>
								</>
							}
							description="Code execution is pluggable: the judge talks to whichever sandbox you configure and falls back automatically if one is unavailable."
						/>
					</Reveal>
					<JudgePipeline />
				</div>
			</section>

			<section className="px-4 py-12 sm:px-6">
				<Reveal className="mx-auto max-w-6xl">
					<dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border bg-border md:grid-cols-4">
						{liveStats.map((stat) => (
							<div
								key={stat.label}
								className="flex flex-col items-center gap-2 bg-card/90 px-6 py-10 backdrop-blur"
							>
								<dd className="font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
									<AnimatedNumber
										value={stat.value}
										suffix={stat.suffix}
										decimals={stat.decimals}
									/>
								</dd>
								<dt className="text-sm text-muted-foreground">{stat.label}</dt>
							</div>
						))}
					</dl>
					<p className="mt-3 text-center text-xs text-muted-foreground">Live numbers, straight from the database.</p>
				</Reveal>
			</section>

			<section className="px-4 py-24 sm:px-6">
				<div className="mx-auto flex max-w-6xl flex-col gap-12">
					<Reveal>
						<SectionHeading
							eyebrow="Stack"
							title={
								<>
									Crafted with <Accent>modern</Accent> tools
								</>
							}
							description="A typed, server-first architecture that is pleasant to extend."
						/>
					</Reveal>
					<StaggerGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{TECH_STACK.map((tech) => (
							<StaggerItem key={tech.name}>
								<Link
									href={tech.url}
									target="_blank"
									rel="noreferrer"
									className="group flex items-center justify-between gap-4 rounded-2xl border bg-card/70 px-5 py-4 backdrop-blur transition-colors hover:border-primary/40"
								>
									<span className="flex flex-col">
										<span className="font-medium">{tech.name}</span>
										<span className="text-sm text-muted-foreground">{tech.role}</span>
									</span>
									<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
								</Link>
							</StaggerItem>
						))}
					</StaggerGroup>
				</div>
			</section>

			<section className="px-4 py-12 sm:px-6">
				<Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl border bg-card/80 px-6 py-14 text-center backdrop-blur">
					<h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
						Open source, and <Accent>open</Accent> to ideas
					</h2>
					<p className="max-w-lg text-pretty text-muted-foreground">Found a bug, want a feature or a new problem? Contributions are welcome.</p>
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button
							asChild
							size="lg"
							className="rounded-full"
						>
							<Link
								href={siteConfig.links.github}
								target="_blank"
								rel="noreferrer"
							>
								<GitHubIcon className="size-4" /> View on GitHub
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="rounded-full"
						>
							<Link href="/problems">Start solving</Link>
						</Button>
					</div>
				</Reveal>
			</section>
		</div>
	);
}
