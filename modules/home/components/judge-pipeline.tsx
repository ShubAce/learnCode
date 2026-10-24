"use client";

import { Braces, CheckCircle2, Server, Cpu } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { EXECUTION_PROVIDERS } from "@/config/stack";

const STEPS = [
	{ icon: Braces, title: "Your code", description: "Written in the in-browser Monaco editor and sent with a server action." },
	{ icon: Server, title: "LearnCode server", description: "Validates the request and loads the hidden testcases from the database." },
	{ icon: Cpu, title: "Sandboxed runner", description: "Compiles and executes once per testcase on a pluggable provider." },
	{ icon: CheckCircle2, title: "Verdict", description: "Outputs are compared and graded — Accepted, Wrong Answer, TLE and more." },
];

/** Animated diagram of a submission's journey through the judge. */
export function JudgePipeline() {
	const reduceMotion = useReducedMotion();

	return (
		<div className="flex flex-col gap-8">
			<div className="relative grid gap-4 md:grid-cols-4">
				{/* Travelling pulse along the pipeline */}
				<div
					aria-hidden
					className="absolute top-9 right-[12%] left-[12%] hidden h-px bg-border md:block"
				>
					{!reduceMotion && (
						<motion.span
							className="absolute -top-[3px] size-[7px] rounded-full bg-primary shadow-[0_0_12px] shadow-primary"
							animate={{ left: ["0%", "100%"] }}
							transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
						/>
					)}
				</div>

				{STEPS.map((step, index) => (
					<motion.div
						key={step.title}
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.12, duration: 0.6 }}
						className="relative flex flex-col items-center gap-3 text-center"
					>
						<span className="relative grid size-[4.5rem] place-items-center rounded-2xl border bg-card shadow-lg shadow-primary/5">
							<step.icon className="size-7 text-primary" />
							<span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full border bg-background font-mono text-[11px] text-muted-foreground">
								{index + 1}
							</span>
						</span>
						<h3 className="font-semibold">{step.title}</h3>
						<p className="max-w-[16rem] text-sm text-pretty text-muted-foreground">{step.description}</p>
					</motion.div>
				))}
			</div>

			<div className="mx-auto flex flex-wrap items-center justify-center gap-2 text-sm">
				<span className="text-muted-foreground">Runs on</span>
				{EXECUTION_PROVIDERS.map((provider) => (
					<span
						key={provider.id}
						className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1"
					>
						<span className="font-medium">{provider.name}</span>
						<span className="text-xs text-muted-foreground">{provider.note}</span>
					</span>
				))}
			</div>
		</div>
	);
}
