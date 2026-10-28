"use client";

import { Check, Loader2, Play, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { cn } from "@/lib/utils";

type Tone = "kw" | "fn" | "num" | "type" | "plain";
type Token = [text: string, tone?: Tone];

const SOLUTION: Token[][] = [
	[["function ", "kw"], ["twoSum", "fn"], ["(nums, target) {"]],
	[["  const ", "kw"], ["seen = "], ["new ", "kw"], ["Map", "type"], ["();"]],
	[["  for ", "kw"], ["("], ["let ", "kw"], ["i = "], ["0", "num"], ["; i < nums.length; i++) {"]],
	[["    const ", "kw"], ["need = target - nums[i];"]],
	[["    if ", "kw"], ["(seen."], ["has", "fn"], ["(need)) "], ["return ", "kw"], ["[seen."], ["get", "fn"], ["(need), i];"]],
	[["    seen."], ["set", "fn"], ["(nums[i], i);"]],
	[["  }"]],
	[["}"]],
];

const TONE_CLASS: Record<Tone, string> = {
	kw: "text-(--code-keyword)",
	fn: "text-(--code-function)",
	num: "text-(--code-number)",
	type: "text-(--code-type)",
	plain: "text-(--code-fg)",
};

const CASES = ["nums = [2,7,11,15], target = 9", "nums = [3,2,4], target = 6", "nums = [3,3], target = 6"];

type Phase = "typing" | "running" | "judging" | "accepted";

// Character offsets for every line and token, computed once so rendering stays pure
type LaidOutToken = { text: string; tone: Tone; start: number };
type LaidOutLine = { start: number; end: number; tokens: LaidOutToken[] };

const LINES: LaidOutLine[] = [];
let cursorOffset = 0;
for (const line of SOLUTION) {
	const start = cursorOffset;
	const tokens = line.map(([text, tone = "plain"]) => {
		const token = { text, tone, start: cursorOffset };
		cursorOffset += text.length;
		return token;
	});
	LINES.push({ start, end: cursorOffset, tokens });
	cursorOffset += 1; // newline
}
const TOTAL_CHARS = cursorOffset;

/** Renders the solution truncated to `count` characters, keeping syntax colours. */
function TypedCode({ count }: { count: number }) {
	const visibleLines = LINES.filter((line, index) => index === 0 || line.start <= count);
	const currentIndex = visibleLines.length - 1;

	return (
		<>
			{visibleLines.map((line, lineIndex) => (
				<div
					key={lineIndex}
					className="flex"
				>
					<span className="w-7 shrink-0 pr-3 text-right text-muted-foreground/50 select-none">{lineIndex + 1}</span>
					<span className="whitespace-pre">
						{line.tokens.map((token, tokenIndex) => (
							<span
								key={tokenIndex}
								className={TONE_CLASS[token.tone]}
							>
								{token.text.slice(0, Math.max(0, count - token.start))}
							</span>
						))}
						{lineIndex === currentIndex && count < TOTAL_CHARS && (
							<span className="ml-px inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-blink bg-primary" />
						)}
					</span>
				</div>
			))}
		</>
	);
}

export function CodeShowcase() {
	const reduceMotion = useReducedMotion();
	const [typed, setTyped] = useState(0);
	const [phase, setPhase] = useState<Phase>("typing");
	const [passed, setPassed] = useState(0);

	// Drives the loop: type → run → judge each case → accepted → restart
	useEffect(() => {
		if (reduceMotion) return;
		let timer: ReturnType<typeof setTimeout>;

		if (phase === "typing") {
			if (typed < TOTAL_CHARS) timer = setTimeout(() => setTyped((t) => Math.min(TOTAL_CHARS, t + 2)), 26);
			else timer = setTimeout(() => setPhase("running"), 600);
		} else if (phase === "running") {
			timer = setTimeout(() => setPhase("judging"), 900);
		} else if (phase === "judging") {
			if (passed < CASES.length) timer = setTimeout(() => setPassed((p) => p + 1), 420);
			else timer = setTimeout(() => setPhase("accepted"), 250);
		} else {
			timer = setTimeout(() => {
				setTyped(0);
				setPassed(0);
				setPhase("typing");
			}, 4200);
		}
		return () => clearTimeout(timer);
	}, [phase, typed, passed, reduceMotion]);

	const view = useMemo(
		() => (reduceMotion ? { typed: TOTAL_CHARS, phase: "accepted" as Phase, passed: CASES.length } : { typed, phase, passed }),
		[reduceMotion, typed, phase, passed],
	);
	const busy = view.phase === "running" || view.phase === "judging";

	return (
		<div className="overflow-hidden rounded-2xl border bg-card/95 text-left shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/50">
			{/* Window chrome */}
			<div className="flex items-center gap-3 border-b bg-muted/40 px-4 py-2.5">
				<div className="flex gap-1.5">
					<span className="size-3 rounded-full bg-[#ff5f57]" />
					<span className="size-3 rounded-full bg-[#febc2e]" />
					<span className="size-3 rounded-full bg-[#28c840]" />
				</div>
				<div className="mx-auto hidden w-full max-w-xs items-center justify-center gap-2 rounded-md border bg-background/70 px-3 py-1 font-mono text-[11px] text-muted-foreground sm:flex">
					learncode / problems / two-sum
				</div>
				<div className="ml-auto flex items-center gap-2">
					<span
						className={cn(
							"inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-[11px] font-medium transition-all",
							view.phase === "running" && "scale-95 border-primary/50 text-primary",
						)}
					>
						{busy ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
						Run
					</span>
					<span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
						<Send className="size-3" />
						Submit
					</span>
				</div>
			</div>

			<div className="grid md:grid-cols-[0.85fr_1.15fr]">
				{/* Problem pane */}
				<div className="hidden flex-col gap-4 border-r p-5 md:flex">
					<div className="flex items-center gap-2">
						<h3 className="text-base font-semibold">1. Two Sum</h3>
						<DifficultyBadge difficulty="EASY" />
					</div>
					<p className="text-[13px] leading-relaxed text-muted-foreground">
						Given an array of integers <code className="rounded bg-muted px-1 font-mono text-[12px] text-foreground">nums</code> and an integer{" "}
						<code className="rounded bg-muted px-1 font-mono text-[12px] text-foreground">target</code>, return the indices of the two numbers that add up
						to the target.
					</p>
					<div className="rounded-xl border bg-muted/30 p-3 font-mono text-[11.5px] leading-relaxed">
						<p>
							<span className="text-muted-foreground">Input:</span> nums = [2,7,11,15], target = 9
						</p>
						<p>
							<span className="text-muted-foreground">Output:</span> [0,1]
						</p>
					</div>
					<div className="mt-auto flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-[12px]">
						<Sparkles className="size-4 shrink-0 text-primary" />
						<span className="text-muted-foreground">
							<span className="font-medium text-foreground">AI hint:</span> a hash map turns the inner loop into an O(1) lookup.
						</span>
					</div>
				</div>

				{/* Editor + console */}
				<div className="flex min-w-0 flex-col">
					<div className="flex items-center gap-2 border-b px-4 py-2 text-[11px] text-muted-foreground">
						<span className="size-2 rounded-full bg-[#f7df1e]" />
						JavaScript
						<span className="ml-auto font-mono">solution.js</span>
					</div>
					<div className="h-[218px] overflow-hidden bg-(--code-bg) px-2 py-3 font-mono text-[12.5px] leading-[1.7]">
						<TypedCode count={view.typed} />
					</div>
					<div className="border-t">
						<div className="flex items-center gap-4 border-b px-4 py-2 text-[11px]">
							<span className={cn("font-medium", view.phase === "typing" ? "text-foreground" : "text-muted-foreground")}>Testcase</span>
							<span className={cn("font-medium", view.phase !== "typing" ? "text-foreground" : "text-muted-foreground")}>Test result</span>
							{busy && (
								<span className="relative ml-auto h-1 w-24 overflow-hidden rounded-full bg-muted">
									<span className="absolute inset-y-0 w-1/2 animate-scan rounded-full bg-primary" />
								</span>
							)}
						</div>
						<div className="flex min-h-[92px] flex-col gap-2 px-4 py-3">
							<AnimatePresence mode="wait">
								{view.phase === "accepted" ? (
									<motion.div
										key="accepted"
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0 }}
										className="flex items-baseline gap-3"
									>
										<span className="text-lg font-semibold text-success">Accepted</span>
										<span className="text-[11px] text-muted-foreground">3 / 3 testcases passed</span>
									</motion.div>
								) : (
									<motion.p
										key="status"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="text-[11px] text-muted-foreground"
									>
										{view.phase === "typing" ? "Write your solution, then run it against the testcases." : "Judging your code…"}
									</motion.p>
								)}
							</AnimatePresence>
							<div className="flex flex-wrap gap-2">
								{CASES.map((label, index) => {
									const done = index < view.passed;
									return (
										<span
											key={label}
											title={label}
											className={cn(
												"inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-all duration-300",
												done ? "border-success/30 bg-success/10 text-success" : "text-muted-foreground",
											)}
										>
											{done ? (
												<Check className="size-3" />
											) : (
												<span className={cn("size-1.5 rounded-full bg-muted-foreground/40", busy && "animate-pulse")} />
											)}
											Case {index + 1}
										</span>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
