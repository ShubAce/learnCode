"use client";

import { useClerk } from "@clerk/nextjs";
import { FileText, SquareTerminal, Code2 } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import { toast } from "sonner";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_LANGUAGE, isLanguageId, LANGUAGES, type LanguageId } from "@/config/languages";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { readStorage, writeStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { AiAssistant } from "@/modules/ai/components/ai-assistant";
import { runCode, submitCode } from "../../actions";
import type { ActionResult, ExecutionReport, SubmissionSummary, WorkspaceProblem } from "../../types";
import { CodeEditorPane } from "./code-editor-pane";
import { ConsolePanel, type ConsoleTab } from "./console-panel";
import { DescriptionPanel, type DescriptionTab } from "./description-panel";
import { WorkspaceHeader } from "./workspace-header";

type Mode = "run" | "submit";
type Drafts = Partial<Record<LanguageId, string>>;

const CONFETTI_COLORS = ["#f2b544", "#ff8a4c", "#34d399", "#fde68a", "#ffffff"];

function Pane({ children, className }: { children: React.ReactNode; className?: string }) {
	return <section className={cn("flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm", className)}>{children}</section>;
}

function ResizeHandle() {
	return (
		<Separator className="group relative flex w-2 shrink-0 items-center justify-center outline-none aria-[orientation=horizontal]:h-2 aria-[orientation=horizontal]:w-full">
			<span className="h-10 w-1 rounded-full bg-border transition-colors duration-200 group-hover:bg-primary/60 group-focus-visible:bg-primary group-data-[separator=active]:bg-primary group-aria-[orientation=horizontal]:h-1 group-aria-[orientation=horizontal]:w-10" />
		</Separator>
	);
}

function EditorPlaceholder() {
	return (
		<div className="flex h-full flex-col gap-3 p-5">
			<Skeleton className="h-6 w-32" />
			{[70, 45, 60, 30, 55].map((width, i) => (
				<Skeleton
					key={i}
					className="h-3.5"
					style={{ width: `${width}%` }}
				/>
			))}
		</div>
	);
}

type ProblemWorkspaceProps = {
	problem: WorkspaceProblem;
	initialSubmissions: SubmissionSummary[];
	initialSolved: boolean;
	isSignedIn: boolean;
};

export function ProblemWorkspace({ problem, initialSubmissions, initialSolved, isSignedIn }: ProblemWorkspaceProps) {
	const mounted = useMounted();
	const isDesktop = useMediaQuery("(min-width: 1024px)", true);
	const reduceMotion = useReducedMotion();
	const { openSignIn } = useClerk();
	const consolePanel = usePanelRef();

	// Editor state — the preferred language and per-language drafts persist in localStorage
	const [language, setLanguage] = useState<LanguageId>(() => {
		const preferred = readStorage<string>("language", DEFAULT_LANGUAGE);
		return isLanguageId(preferred) ? preferred : DEFAULT_LANGUAGE;
	});
	const [drafts, setDrafts] = useState<Drafts>(() => readStorage<Drafts>(`drafts:${problem.id}`, {}));
	const starter = problem.codeSnippets[language] ?? LANGUAGES[language].template;
	const code = drafts[language] ?? starter;
	const isDirty = drafts[language] !== undefined && drafts[language] !== starter;

	// Execution state
	const [pending, setPending] = useState<Mode | null>(null);
	const [lastMode, setLastMode] = useState<Mode>("run");
	const [report, setReport] = useState<ExecutionReport | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [submissions, setSubmissions] = useState(initialSubmissions);
	const [solved, setSolved] = useState(initialSolved);

	// Layout state
	const [descriptionTab, setDescriptionTab] = useState<DescriptionTab>("description");
	const [consoleTab, setConsoleTab] = useState<ConsoleTab>("testcase");
	const [consoleCollapsed, setConsoleCollapsed] = useState(false);
	const [mobileTab, setMobileTab] = useState<"problem" | "code" | "console">("problem");
	const [aiOpen, setAiOpen] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => writeStorage(`drafts:${problem.id}`, drafts), 400);
		return () => clearTimeout(timer);
	}, [drafts, problem.id]);

	const changeLanguage = (next: LanguageId) => {
		setLanguage(next);
		writeStorage("language", next);
	};

	const updateCode = (value: string) => setDrafts((current) => ({ ...current, [language]: value }));

	const resetCode = () =>
		setDrafts((current) => {
			const next = { ...current };
			delete next[language];
			return next;
		});

	const loadCode = (target: LanguageId, source: string) => {
		changeLanguage(target);
		setDrafts((current) => ({ ...current, [target]: source }));
		setMobileTab("code");
		toast.success(`Loaded your ${LANGUAGES[target].label} submission into the editor`);
	};

	const celebrate = useCallback(async () => {
		if (reduceMotion) return;
		const confetti = (await import("canvas-confetti")).default;
		confetti({ particleCount: 110, spread: 75, startVelocity: 42, origin: { y: 0.65 }, colors: CONFETTI_COLORS });
		setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: CONFETTI_COLORS }), 180);
		setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: CONFETTI_COLORS }), 320);
	}, [reduceMotion]);

	const execute = async (mode: Mode) => {
		if (!isSignedIn) {
			openSignIn();
			return;
		}
		if (pending) return;

		setPending(mode);
		setLastMode(mode);
		setError(null);
		setConsoleTab("result");
		setMobileTab("console");
		if (consolePanel.current?.isCollapsed()) consolePanel.current.expand();

		let result: ActionResult<ExecutionReport>;
		try {
			result = await (mode === "run" ? runCode : submitCode)({ problemId: problem.id, language, code });
		} catch {
			result = { ok: false, error: "Network error — check your connection and try again." };
		}
		setPending(null);

		if (!result.ok) {
			setError(result.error);
			toast.error(result.error);
			return;
		}

		const data = result.data;
		setReport(data);
		if (mode !== "submit") return;

		if (data.submission) setSubmissions((current) => [data.submission!, ...current]);
		const summary = `${data.passedCount}/${data.totalCount} testcases passed`;
		if (data.verdict === "Accepted") {
			setSolved(true);
			celebrate();
			toast.success(data.firstSolve ? "Accepted — problem solved! 🎉" : "Accepted!", { description: summary });
		} else {
			toast.error(data.verdict, { description: summary });
		}
	};

	// Shortcuts outside the editor (Monaco registers its own copies)
	const executeRef = useRef(execute);
	const codeRef = useRef(code);
	useLayoutEffect(() => {
		executeRef.current = execute;
		codeRef.current = code;
	});

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (!(event.ctrlKey || event.metaKey)) return;
			if ((event.target as HTMLElement | null)?.closest?.(".monaco-editor")) return;
			if (event.key === "'") {
				event.preventDefault();
				executeRef.current("run");
			} else if (event.key === "Enter") {
				event.preventDefault();
				executeRef.current("submit");
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const getCode = useCallback(() => codeRef.current, []);
	const closeAi = useCallback(() => setAiOpen(false), []);
	const openAi = () => setAiOpen(true);

	const description = (
		<DescriptionPanel
			problem={problem}
			tab={descriptionTab}
			onTabChange={setDescriptionTab}
			solved={solved}
			isSignedIn={isSignedIn}
			submissions={submissions}
			onLoadCode={loadCode}
			onAskAi={openAi}
		/>
	);

	const editor = mounted ? (
		<CodeEditorPane
			language={language}
			code={code}
			isDirty={isDirty}
			onLanguageChange={changeLanguage}
			onCodeChange={updateCode}
			onReset={resetCode}
			onRun={() => execute("run")}
			onSubmit={() => execute("submit")}
		/>
	) : (
		<EditorPlaceholder />
	);

	const consolePanelContent = (collapsible: boolean) => (
		<ConsolePanel
			testCases={problem.testCases}
			hiddenTestCount={problem.hiddenTestCount}
			tab={consoleTab}
			onTabChange={(tab) => {
				setConsoleTab(tab);
				if (consolePanel.current?.isCollapsed()) consolePanel.current.expand();
			}}
			pending={pending}
			report={report}
			error={error}
			onRetry={() => execute(lastMode)}
			collapsed={consoleCollapsed}
			onToggleCollapsed={
				collapsible ? () => (consolePanel.current?.isCollapsed() ? consolePanel.current.expand() : consolePanel.current?.collapse()) : undefined
			}
		/>
	);

	return (
		<div className="flex h-dvh flex-col overflow-hidden bg-background">
			<WorkspaceHeader
				prev={problem.prev}
				next={problem.next}
				pending={pending}
				onRun={() => execute("run")}
				onSubmit={() => execute("submit")}
				aiOpen={aiOpen}
				onToggleAi={() => setAiOpen((open) => !open)}
			/>

			{isDesktop ? (
				<div className="min-h-0 flex-1 px-2 pb-2">
					<Group
						orientation="horizontal"
						className="h-full"
					>
						<Panel
							id="problem"
							defaultSize="44%"
							minSize="25%"
						>
							<Pane>{description}</Pane>
						</Panel>
						<ResizeHandle />
						<Panel
							id="code"
							defaultSize="56%"
							minSize="30%"
						>
							<Group
								orientation="vertical"
								className="h-full"
							>
								<Panel
									id="editor"
									defaultSize="62%"
									minSize="20%"
								>
									<Pane>{editor}</Pane>
								</Panel>
								<ResizeHandle />
								<Panel
									id="console"
									panelRef={consolePanel}
									defaultSize="38%"
									minSize="18%"
									collapsible
									collapsedSize="42px"
									onResize={(size) => setConsoleCollapsed(size.inPixels <= 46)}
								>
									<Pane>{consolePanelContent(true)}</Pane>
								</Panel>
							</Group>
						</Panel>
					</Group>
				</div>
			) : (
				<div className="flex min-h-0 flex-1 flex-col gap-2 px-2 pb-2">
					<SegmentedControl
						layoutId="workspace-mobile-tab"
						value={mobileTab}
						onChange={setMobileTab}
						className="w-full [&>button]:flex-1"
						options={[
							{ value: "problem", label: <><FileText className="size-3.5" /> Problem</> },
							{ value: "code", label: <><Code2 className="size-3.5" /> Code</> },
							{ value: "console", label: <><SquareTerminal className="size-3.5" /> Result</> },
						]}
					/>
					<div className="min-h-0 flex-1">
						<Pane className={cn(mobileTab !== "problem" && "hidden")}>{description}</Pane>
						<Pane className={cn(mobileTab !== "code" && "hidden")}>{editor}</Pane>
						<Pane className={cn(mobileTab !== "console" && "hidden")}>{consolePanelContent(false)}</Pane>
					</div>
				</div>
			)}

			<AiAssistant
				open={aiOpen}
				onClose={closeAi}
				problem={problem}
				language={language}
				getCode={getCode}
				isSignedIn={isSignedIn}
			/>
		</div>
	);
}
