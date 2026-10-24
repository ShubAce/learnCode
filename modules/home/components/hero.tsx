"use client";

import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Button } from "@/components/ui/button";
import { LANGUAGES, LANGUAGE_IDS } from "@/config/languages";
import type { PlatformStats } from "@/modules/home/data";
import { CodeShowcase } from "./code-showcase";

const EASE = [0.22, 1, 0.36, 1] as const;

function Words({ text, delay = 0 }: { text: string; delay?: number }) {
	return (
		<>
			{text.split(" ").map((word, index) => (
				<motion.span
					key={`${word}-${index}`}
					className="inline-block"
					initial={{ opacity: 0, y: "0.45em", filter: "blur(10px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ duration: 0.8, delay: delay + index * 0.08, ease: EASE }}
				>
					{word}&nbsp;
				</motion.span>
			))}
		</>
	);
}

export function Hero({ stats, isSignedIn }: { stats: PlatformStats; isSignedIn: boolean }) {
	const reduceMotion = useReducedMotion();
	const showcaseRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: showcaseRef, offset: ["start end", "start 0.25"] });
	const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
	const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
	const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

	const heroStats = [
		{ value: stats.problems.total, label: "Curated problems" },
		{ value: stats.languages, label: "Languages" },
		{ value: stats.submissions, label: "Submissions judged" },
		{ value: stats.developers, label: "Developers" },
	];

	return (
		<section className="relative overflow-hidden px-4 pt-32 pb-12 sm:px-6 sm:pt-40">
			<div className="mx-auto flex max-w-5xl flex-col items-center text-center">
				<motion.div
					initial={{ opacity: 0, y: 12, scale: 0.96 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.6, ease: EASE }}
				>
					<Link
						href="/problems"
						className="group inline-flex items-center gap-2 rounded-full border bg-card/70 py-1 pr-3 pl-1 text-xs font-medium shadow-sm backdrop-blur transition-colors hover:border-primary/40"
					>
						<span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
							<Sparkles className="size-3" /> New
						</span>
						<span className="text-muted-foreground">AI tutor + free code execution in {stats.languages} languages</span>
						<ChevronRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
					</Link>
				</motion.div>

				<h1 className="mt-7 text-[2.75rem] leading-[1.02] font-semibold tracking-tighter text-balance sm:text-6xl md:text-7xl lg:text-[5.25rem]">
					<Words text="Master the art of" />
					<br className="hidden sm:block" />
					<span className="relative inline-block">
						<motion.span
							className="inline-block pr-2 font-display text-gradient italic"
							initial={{ opacity: 0, y: "0.4em", filter: "blur(12px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
						>
							problem solving
						</motion.span>
						<svg
							aria-hidden
							viewBox="0 0 400 24"
							preserveAspectRatio="none"
							className="absolute -bottom-2 left-0 h-3 w-full text-primary/70 sm:-bottom-3 sm:h-4"
						>
							<motion.path
								d="M4 18 C 90 4, 210 4, 396 14"
								fill="none"
								stroke="currentColor"
								strokeWidth="5"
								strokeLinecap="round"
								initial={{ pathLength: reduceMotion ? 1 : 0 }}
								animate={{ pathLength: 1 }}
								transition={{ duration: 1.1, delay: 0.9, ease: EASE }}
							/>
						</svg>
					</span>
				</h1>

				<motion.p
					className="mt-8 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
				>
					Solve hand-picked challenges in {LANGUAGE_IDS.map((id) => LANGUAGES[id].label).join(", ").replace(/, ([^,]*)$/, " and $1")}. Get instant
					verdicts from a real judge, track every win, and learn with an AI tutor that actually reads your code.
				</motion.p>

				<motion.div
					className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
				>
					<Button
						asChild
						size="lg"
						className="group relative h-12 overflow-hidden rounded-full px-7 text-[15px] font-semibold shadow-lg shadow-primary/25"
					>
						<Link href="/problems">
							<span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-linear-to-r from-transparent via-white/25 to-transparent" />
							{isSignedIn ? "Continue solving" : "Start solving — it's free"}
							<ArrowRight className="transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="h-12 rounded-full bg-card/60 px-7 text-[15px] backdrop-blur"
					>
						<Link href={isSignedIn ? "/profile" : "/about"}>{isSignedIn ? "View your progress" : "How it works"}</Link>
					</Button>
				</motion.div>

				<motion.dl
					className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-4"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
				>
					{heroStats.map((stat) => (
						<div
							key={stat.label}
							className="flex flex-col items-center gap-1 bg-card/80 px-4 py-5 backdrop-blur"
						>
							<dd className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
								<AnimatedNumber value={stat.value} />
							</dd>
							<dt className="text-xs text-muted-foreground">{stat.label}</dt>
						</div>
					))}
				</motion.dl>
			</div>

			<div
				ref={showcaseRef}
				className="relative mx-auto mt-20 max-w-5xl perspective-[1400px]"
			>
				<div
					aria-hidden
					className="absolute inset-x-[8%] -top-10 bottom-0 rounded-[3rem] bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-3xl"
				/>
				<motion.div
					style={reduceMotion ? undefined : { rotateX, scale, y, transformOrigin: "center top" }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 0.9 }}
					className="relative"
				>
					<CodeShowcase />
				</motion.div>
			</div>
		</section>
	);
}
