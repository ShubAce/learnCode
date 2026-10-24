"use client";

import { Bot, Gauge, LineChart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Accent } from "@/components/shared/section-heading";
import { VerdictBadge } from "@/components/shared/verdict-badge";

const POINTS = [
	{ icon: Gauge, text: "A real judge with precise verdicts" },
	{ icon: Bot, text: "An AI tutor that reads your code" },
	{ icon: LineChart, text: "Streaks, heatmaps and progress tracking" },
];

/** Decorative brand panel shown beside the sign-in and sign-up forms. */
export function AuthShowcase() {
	const reduceMotion = useReducedMotion();
	const float = (delay: number) =>
		reduceMotion ? {} : { animate: { y: [0, -10, 0] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const, delay } };

	return (
		<div className="relative flex flex-1 flex-col justify-center gap-10">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
				className="flex flex-col gap-5"
			>
				<h2 className="max-w-md text-4xl leading-[1.1] font-semibold tracking-tighter xl:text-5xl">
					Every expert started by <Accent>hitting submit</Accent>
				</h2>
				<ul className="flex flex-col gap-3">
					{POINTS.map((point, index) => (
						<motion.li
							key={point.text}
							initial={{ opacity: 0, x: -12 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 + index * 0.1 }}
							className="flex items-center gap-3 text-muted-foreground"
						>
							<span className="grid size-8 place-items-center rounded-lg border bg-card text-primary">
								<point.icon className="size-4" />
							</span>
							{point.text}
						</motion.li>
					))}
				</ul>
			</motion.div>

			<div className="relative h-56 max-w-md">
				<motion.div
					{...float(0)}
					className="absolute top-0 left-0 w-72 rounded-2xl border bg-card/90 p-4 shadow-xl backdrop-blur"
				>
					<div className="mb-3 flex gap-1.5">
						<span className="size-2.5 rounded-full bg-[#ff5f57]" />
						<span className="size-2.5 rounded-full bg-[#febc2e]" />
						<span className="size-2.5 rounded-full bg-[#28c840]" />
					</div>
					<pre className="font-mono text-[12px] leading-relaxed">
						<span className="text-(--code-keyword)">def</span> <span className="text-(--code-function)">max_profit</span>(prices):
						{"\n"}    low, best = prices[<span className="text-(--code-number)">0</span>], <span className="text-(--code-number)">0</span>
						{"\n"}    <span className="text-(--code-keyword)">for</span> p <span className="text-(--code-keyword)">in</span> prices:
						{"\n"}        best = max(best, p - low)
					</pre>
				</motion.div>
				<motion.div
					{...float(1.2)}
					className="absolute top-24 right-0 rounded-xl border bg-card/90 px-4 py-3 shadow-xl backdrop-blur"
				>
					<VerdictBadge status="Accepted" />
					<p className="mt-2 font-mono text-[11px] text-muted-foreground">4 / 4 testcases passed</p>
				</motion.div>
				<motion.div
					{...float(2.4)}
					className="absolute bottom-0 left-16 rounded-xl border bg-card/90 px-4 py-3 shadow-xl backdrop-blur"
				>
					<p className="text-xs text-muted-foreground">Current streak</p>
					<p className="font-mono text-lg font-semibold">🔥 7 days</p>
				</motion.div>
			</div>
		</div>
	);
}
