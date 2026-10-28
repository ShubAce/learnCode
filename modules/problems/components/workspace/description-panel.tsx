"use client";

import { SignInButton } from "@clerk/nextjs";
import { BookOpen, CheckCircle2, ChevronDown, Eye, FileText, History, Lightbulb, LogIn, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Markdown } from "@/components/shared/markdown";
import { Button } from "@/components/ui/button";
import type { LanguageId } from "@/config/languages";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SubmissionSummary, WorkspaceProblem } from "../../types";
import { SubmissionList } from "./submission-list";

export type DescriptionTab = "description" | "editorial" | "hints" | "submissions";

const TABS: { id: DescriptionTab; label: string; icon: typeof FileText }[] = [
	{ id: "description", label: "Description", icon: FileText },
	{ id: "editorial", label: "Editorial", icon: BookOpen },
	{ id: "hints", label: "Hints", icon: Lightbulb },
	{ id: "submissions", label: "Submissions", icon: History },
];

/** Constraints are often stored as one sentence-separated line; show them as a list. */
const splitConstraints = (text: string) =>
	text
		.split(/\n|\.\s+(?=\S)/)
		.map((item) => item.trim().replace(/\.$/, ""))
		.filter(Boolean);

const splitHints = (text: string | null) =>
	(text ?? "")
		.split(/\n+/)
		.map((hint) => hint.trim())
		.filter(Boolean);

type DescriptionPanelProps = {
	problem: WorkspaceProblem;
	tab: DescriptionTab;
	onTabChange: (tab: DescriptionTab) => void;
	solved: boolean;
	isSignedIn: boolean;
	submissions: SubmissionSummary[];
	onLoadCode: (language: LanguageId, code: string) => void;
	onAskAi: () => void;
};

function HintItem({ index, hint }: { index: number; hint: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="overflow-hidden rounded-xl border bg-background/50">
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent/40"
				aria-expanded={open}
			>
				<span className="grid size-6 place-items-center rounded-md bg-primary/15 font-mono text-xs text-primary">{index + 1}</span>
				Hint {index + 1}
				<ChevronDown className={cn("ml-auto size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
					>
						<div className="border-t px-4 py-3">
							<Markdown content={hint} />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export function DescriptionPanel({ problem, tab, onTabChange, solved, isSignedIn, submissions, onLoadCode, onAskAi }: DescriptionPanelProps) {
	const [editorialRevealed, setEditorialRevealed] = useState(false);
	const hints = splitHints(problem.hints);

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center gap-0.5 overflow-x-auto border-b px-2 py-1.5">
				{TABS.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => onTabChange(item.id)}
						className={cn(
							"relative inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors",
							tab === item.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
						)}
					>
						{tab === item.id && (
							<motion.span
								layoutId="description-tab"
								className="absolute inset-0 rounded-md bg-accent"
								transition={{ type: "spring", stiffness: 420, damping: 34 }}
							/>
						)}
						<item.icon className={cn("relative size-3.5", tab === item.id && "text-primary")} />
						<span className="relative">{item.label}</span>
						{item.id === "submissions" && submissions.length > 0 && (
							<span className="relative rounded-full bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">{submissions.length}</span>
						)}
					</button>
				))}
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto">
				<AnimatePresence mode="wait">
					<motion.div
						key={tab}
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={{ duration: 0.18 }}
						className="p-5 sm:p-6"
					>
						{tab === "description" && (
							<article className="flex flex-col gap-6">
								<header className="flex flex-col gap-3">
									<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
										<span className="text-muted-foreground">{problem.number}.</span> {problem.title}
									</h1>
									<div className="flex flex-wrap items-center gap-2">
										<DifficultyBadge difficulty={problem.difficulty} />
										{solved && (
											<span className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
												<CheckCircle2 className="size-3.5" /> Solved
											</span>
										)}
										{problem.acceptanceRate !== null && (
											<span className="text-xs text-muted-foreground">Acceptance {formatPercent(problem.acceptanceRate)}</span>
										)}
									</div>
									{problem.tags.length > 0 && (
										<div className="flex flex-wrap gap-1.5">
											{problem.tags.map((tag) => (
												<span
													key={tag}
													className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
												>
													{tag}
												</span>
											))}
										</div>
									)}
								</header>

								<Markdown
									content={problem.description}
									breaks
									className="text-[14.5px] text-foreground/90"
								/>

								{problem.examples.map((example, index) => (
									<section
										key={index}
										className="flex flex-col gap-2"
									>
										<h2 className="text-sm font-semibold">Example {index + 1}</h2>
										<div className="flex flex-col gap-1.5 rounded-xl border-l-2 border-primary/60 bg-muted/40 px-4 py-3 font-mono text-[13px] leading-relaxed">
											<p>
												<span className="text-muted-foreground">Input: </span>
												<span className="whitespace-pre-wrap">{example.input}</span>
											</p>
											<p>
												<span className="text-muted-foreground">Output: </span>
												<span className="whitespace-pre-wrap">{example.output}</span>
											</p>
											{example.explanation && (
												<p className="font-sans text-[13.5px]">
													<span className="font-mono text-muted-foreground">Explanation: </span>
													<span className="whitespace-pre-wrap text-foreground/85">{example.explanation}</span>
												</p>
											)}
										</div>
									</section>
								))}

								{problem.constraints && (
									<section className="flex flex-col gap-2">
										<h2 className="text-sm font-semibold">Constraints</h2>
										<ul className="flex flex-col gap-1.5">
											{splitConstraints(problem.constraints).map((constraint) => (
												<li
													key={constraint}
													className="flex items-start gap-2 text-sm"
												>
													<span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
													<code className="rounded-md border bg-muted/50 px-1.5 py-0.5 font-mono text-[12.5px]">{constraint}</code>
												</li>
											))}
										</ul>
									</section>
								)}

								<button
									type="button"
									onClick={onAskAi}
									className="group flex items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-left transition-colors hover:border-primary/60 hover:bg-primary/10"
								>
									<span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
										<Sparkles className="size-4" />
									</span>
									<span className="flex flex-col">
										<span className="text-sm font-medium">Stuck? Ask the AI tutor</span>
										<span className="text-xs text-muted-foreground">Get a nudge, not the answer — it can see your current code.</span>
									</span>
								</button>
							</article>
						)}

						{tab === "editorial" &&
							(problem.editorial ? (
								<div className="relative">
									<div
										className={cn(
											"transition-[filter] duration-500",
											!(solved || editorialRevealed) && "pointer-events-none blur-md select-none",
										)}
									>
										<h2 className="mb-3 text-lg font-semibold">Editorial</h2>
										<Markdown
											content={problem.editorial}
											breaks
											className="text-[14.5px]"
										/>
									</div>
									{!(solved || editorialRevealed) && (
										<div className="absolute inset-0 grid place-items-start justify-center pt-10">
											<div className="flex flex-col items-center gap-3 rounded-2xl border bg-card/95 p-6 text-center shadow-xl backdrop-blur">
												<BookOpen className="size-6 text-primary" />
												<p className="text-sm font-medium">The editorial may spoil the solution</p>
												<p className="max-w-60 text-xs text-muted-foreground">Give it an honest try first — or peek if you&apos;re ready.</p>
												<Button
													size="sm"
													onClick={() => setEditorialRevealed(true)}
												>
													<Eye /> Reveal editorial
												</Button>
											</div>
										</div>
									)}
								</div>
							) : (
								<EmptyState
									icon={BookOpen}
									title="No editorial yet"
									description="An official walkthrough hasn't been written for this problem. Try the AI tutor for a guided explanation."
									action={
										<Button
											variant="outline"
											size="sm"
											onClick={onAskAi}
										>
											<Sparkles /> Ask the AI tutor
										</Button>
									}
								/>
							))}

						{tab === "hints" &&
							(hints.length > 0 ? (
								<div className="flex flex-col gap-2">
									<p className="mb-2 text-sm text-muted-foreground">Reveal hints one at a time — each one gives away a little more.</p>
									{hints.map((hint, index) => (
										<HintItem
											key={index}
											index={index}
											hint={hint}
										/>
									))}
								</div>
							) : (
								<EmptyState
									icon={Lightbulb}
									title="No hints for this one"
									description="You're on your own — or ask the AI tutor for a gentle nudge."
								/>
							))}

						{tab === "submissions" &&
							(isSignedIn ? (
								<SubmissionList
									submissions={submissions}
									onLoadCode={onLoadCode}
								/>
							) : (
								<EmptyState
									icon={LogIn}
									title="Sign in to track submissions"
									description="Your attempts, verdicts and source code are saved to your account."
									action={
										<SignInButton mode="modal">
											<Button size="sm">
												<LogIn /> Sign in
											</Button>
										</SignInButton>
									}
								/>
							))}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
