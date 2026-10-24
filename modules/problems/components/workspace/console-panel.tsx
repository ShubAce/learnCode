"use client";

import { AlertTriangle, Check, ChevronDown, ChevronUp, Clock3, Cpu, FlaskConical, Loader2, RotateCw, Terminal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { getVerdictMeta } from "@/config/verdicts";
import { formatMemory, formatRuntime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ExecutionReport, TestCase } from "../../types";

export type ConsoleTab = "testcase" | "result";

type ConsolePanelProps = {
	testCases: TestCase[];
	tab: ConsoleTab;
	onTabChange: (tab: ConsoleTab) => void;
	pending: "run" | "submit" | null;
	report: ExecutionReport | null;
	error: string | null;
	onRetry: () => void;
	collapsed?: boolean;
	onToggleCollapsed?: () => void;
};

function Block({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "danger" | "success" }) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-xs font-medium text-muted-foreground">{label}</span>
			<pre
				className={cn(
					"max-h-48 overflow-auto rounded-lg border bg-muted/50 px-3 py-2.5 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap",
					tone === "danger" && "border-destructive/25 bg-destructive/5 text-destructive",
					tone === "success" && "border-success/25 bg-success/5",
				)}
			>
				{value || <span className="text-muted-foreground italic">(empty)</span>}
			</pre>
		</div>
	);
}

function CaseTabs({ count, active, onSelect, passed }: { count: number; active: number; onSelect: (index: number) => void; passed?: boolean[] }) {
	return (
		<div className="flex flex-wrap gap-1.5">
			{Array.from({ length: count }, (_, index) => {
				const state = passed?.[index];
				return (
					<button
						key={index}
						type="button"
						onClick={() => onSelect(index)}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
							index === active ? "border-foreground/20 bg-accent text-foreground" : "border-transparent text-muted-foreground hover:bg-accent/60",
						)}
					>
						{state !== undefined && (
							<span className={cn("size-1.5 rounded-full", state ? "bg-success" : "bg-destructive")} />
						)}
						Case {index + 1}
					</button>
				);
			})}
		</div>
	);
}

function JudgingState({ mode }: { mode: "run" | "submit" }) {
	return (
		<motion.div
			key="judging"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="flex flex-col gap-4"
		>
			<div className="flex items-center gap-3">
				<span className="relative grid size-9 place-items-center rounded-xl border bg-primary/10 text-primary">
					<Loader2 className="size-4 animate-spin" />
				</span>
				<div className="flex flex-col">
					<span className="text-sm font-medium">{mode === "run" ? "Running your code…" : "Judging your submission…"}</span>
					<span className="text-xs text-muted-foreground">Compiling and executing against every testcase</span>
				</div>
			</div>
			<div className="relative h-1 overflow-hidden rounded-full bg-muted">
				<span className="absolute inset-y-0 w-1/3 animate-scan rounded-full bg-linear-to-r from-transparent via-primary to-transparent" />
			</div>
			<div className="flex flex-col gap-2">
				{[90, 70, 80].map((width, i) => (
					<div
						key={i}
						className="h-3 animate-pulse rounded bg-muted"
						style={{ width: `${width}%`, animationDelay: `${i * 120}ms` }}
					/>
				))}
			</div>
		</motion.div>
	);
}

function ResultView({ report }: { report: ExecutionReport }) {
	const [active, setActive] = useState(() => Math.max(0, report.cases.findIndex((c) => !c.passed)));
	const meta = getVerdictMeta(report.verdict);
	const compileError = report.verdict === "Compilation Error" ? report.cases.find((c) => c.compileOutput)?.compileOutput : null;
	const current = report.cases[active];

	return (
		<motion.div
			key="result"
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col gap-4"
		>
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div className="flex flex-col gap-1">
					<span className={cn("text-xl font-semibold tracking-tight", meta.text)}>{report.verdict}</span>
					<span className="text-xs text-muted-foreground">
						{report.passedCount} / {report.totalCount} testcases passed · judged by {report.provider}
						{report.mode === "run" && " · not saved"}
					</span>
				</div>
				{(report.runtimeMs !== null || report.memoryKb !== null) && (
					<div className="flex gap-2">
						<span className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/50 px-2.5 py-1 font-mono text-xs">
							<Clock3 className="size-3.5 text-muted-foreground" /> {formatRuntime(report.runtimeMs)}
						</span>
						<span className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/50 px-2.5 py-1 font-mono text-xs">
							<Cpu className="size-3.5 text-muted-foreground" /> {formatMemory(report.memoryKb)}
						</span>
					</div>
				)}
			</div>

			{compileError ? (
				<Block
					label="Compiler output"
					value={compileError}
					tone="danger"
				/>
			) : (
				<>
					<CaseTabs
						count={report.cases.length}
						active={active}
						onSelect={setActive}
						passed={report.cases.map((c) => c.passed)}
					/>
					{current && (
						<div className="flex flex-col gap-3">
							<Block
								label="Input"
								value={current.input}
							/>
							<div className="grid gap-3 md:grid-cols-2">
								<Block
									label="Your output"
									value={current.stdout}
									tone={current.passed ? "success" : current.verdict === "Wrong Answer" ? "danger" : "default"}
								/>
								<Block
									label="Expected"
									value={current.expected}
								/>
							</div>
							{current.stderr && (
								<Block
									label={current.verdict === "Runtime Error" ? "Runtime error" : "Standard error"}
									value={current.stderr}
									tone="danger"
								/>
							)}
						</div>
					)}
				</>
			)}
		</motion.div>
	);
}

export function ConsolePanel({ testCases, tab, onTabChange, pending, report, error, onRetry, collapsed, onToggleCollapsed }: ConsolePanelProps) {
	const [activeCase, setActiveCase] = useState(0);
	const resultMeta = report ? getVerdictMeta(report.verdict) : null;

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center gap-1 border-b px-2 py-1.5">
				{(
					[
						{ id: "testcase", label: "Testcase", icon: FlaskConical },
						{ id: "result", label: "Test result", icon: Terminal },
					] as const
				).map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => onTabChange(item.id)}
						className={cn(
							"relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors",
							tab === item.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
						)}
					>
						{tab === item.id && (
							<motion.span
								layoutId="console-tab"
								className="absolute inset-0 rounded-md bg-accent"
								transition={{ type: "spring", stiffness: 420, damping: 34 }}
							/>
						)}
						<item.icon className={cn("relative size-3.5", item.id === "result" && resultMeta?.text)} />
						<span className="relative">{item.label}</span>
						{item.id === "result" && pending && <Loader2 className="relative size-3 animate-spin text-primary" />}
					</button>
				))}
				{onToggleCollapsed && (
					<Button
						variant="ghost"
						size="icon-xs"
						className="ml-auto"
						onClick={onToggleCollapsed}
						aria-label={collapsed ? "Expand console" : "Collapse console"}
					>
						{collapsed ? <ChevronUp /> : <ChevronDown />}
					</Button>
				)}
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto p-4">
				{tab === "testcase" ? (
					testCases.length === 0 ? (
						<p className="text-sm text-muted-foreground">This problem has no testcases yet.</p>
					) : (
						<div className="flex flex-col gap-4">
							<CaseTabs
								count={testCases.length}
								active={activeCase}
								onSelect={setActiveCase}
							/>
							<Block
								label="Input"
								value={testCases[activeCase]?.input ?? ""}
							/>
							<Block
								label="Expected output"
								value={testCases[activeCase]?.output ?? ""}
							/>
						</div>
					)
				) : (
					<AnimatePresence mode="wait">
						{pending ? (
							<JudgingState
								key="judging"
								mode={pending}
							/>
						) : error ? (
							<motion.div
								key="error"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="flex flex-col items-start gap-3"
							>
								<div className="flex items-center gap-2 text-sm font-medium text-destructive">
									<AlertTriangle className="size-4" /> Something went wrong
								</div>
								<p className="text-sm text-muted-foreground">{error}</p>
								<Button
									size="sm"
									variant="outline"
									onClick={onRetry}
								>
									<RotateCw /> Try again
								</Button>
							</motion.div>
						) : report ? (
							<ResultView
								key={`${report.mode}-${report.submission?.id ?? report.cases.map((c) => c.stdout).join("|")}`}
								report={report}
							/>
						) : (
							<motion.div
								key="empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="flex h-full flex-col items-center justify-center gap-3 py-6 text-center"
							>
								<div className="grid size-10 place-items-center rounded-xl border bg-muted/50 text-muted-foreground">
									{report === null ? <Terminal className="size-4" /> : <X className="size-4" />}
								</div>
								<p className="text-sm text-muted-foreground">Run your code to see the results here.</p>
								<div className="flex items-center gap-4 text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<Kbd className="border">Ctrl</Kbd>
										<Kbd className="border">&apos;</Kbd> run
									</span>
									<span className="flex items-center gap-1">
										<Kbd className="border">Ctrl</Kbd>
										<Kbd className="border">Enter</Kbd> submit
									</span>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</div>
			{report?.verdict === "Accepted" && report.mode === "submit" && tab === "result" && !pending && (
				<div className="flex items-center gap-2 border-t bg-success/10 px-4 py-2 text-xs font-medium text-success">
					<Check className="size-3.5" /> Submission saved to your history
				</div>
			)}
		</div>
	);
}
