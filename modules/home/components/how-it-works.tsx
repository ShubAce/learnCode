"use client";

import { Code2, MousePointerClick, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { Accent, SectionHeading } from "@/components/shared/section-heading";

const STEPS = [
	{
		icon: MousePointerClick,
		title: "Pick a challenge",
		description: "Filter by difficulty, topic or status and open a problem in a distraction-free workspace.",
	},
	{
		icon: Code2,
		title: "Write and run",
		description: "Code in your favourite language, run it against the testcases and iterate with instant feedback.",
	},
	{
		icon: Trophy,
		title: "Submit and grow",
		description: "Get a verdict, then watch your heatmap, acceptance rate and solved count climb on your profile.",
	},
];

export function HowItWorks() {
	const reduceMotion = useReducedMotion();

	return (
		<section className="px-4 py-24 sm:px-6">
			<div className="mx-auto max-w-6xl">
				<Reveal>
					<SectionHeading
						eyebrow="How it works"
						title={
							<>
								From blank editor to <Accent>Accepted</Accent>
							</>
						}
						description="Three steps, repeated daily, is all it takes to build real problem-solving muscle."
					/>
				</Reveal>

				<div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
					{/* Connector line that draws itself on scroll */}
					<div
						aria-hidden
						className="absolute top-7 left-[16.6%] hidden h-px w-[66.8%] border-t border-dashed md:block"
					>
						<motion.div
							className="absolute inset-x-0 -top-px h-[2px] origin-left rounded-full bg-linear-to-r from-primary to-brand-2"
							initial={{ scaleX: reduceMotion ? 1 : 0 }}
							whileInView={{ scaleX: 1 }}
							viewport={{ once: true, margin: "-120px" }}
							transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
						/>
					</div>

					{STEPS.map((step, index) => (
						<Reveal
							key={step.title}
							delay={0.2 + index * 0.18}
							className="relative flex flex-col items-center text-center"
						>
							<div className="relative">
								<span className="absolute inset-0 animate-pulse-ring rounded-2xl border border-primary/50" />
								<span className="relative grid size-14 place-items-center rounded-2xl border bg-card shadow-lg shadow-primary/10">
									<step.icon className="size-6 text-primary" />
								</span>
							</div>
							<span className="mt-6 font-mono text-xs tracking-[0.2em] text-muted-foreground">STEP 0{index + 1}</span>
							<h3 className="mt-2 text-xl font-semibold tracking-tight">{step.title}</h3>
							<p className="mt-2 max-w-xs text-sm text-pretty text-muted-foreground">{step.description}</p>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
