"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { Check, Code2, RotateCcw, Settings2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useLayoutEffect, useRef, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LANGUAGE_IDS, LANGUAGES, type LanguageId } from "@/config/languages";
import { readStorage, writeStorage } from "@/lib/storage";
import { defineMonacoThemes, MONACO_THEMES } from "./monaco-themes";

type EditorSettings = { fontSize: number; wordWrap: boolean };

const FONT_SIZES = [12, 13, 14, 15, 16, 18];

type CodeEditorPaneProps = {
	language: LanguageId;
	code: string;
	isDirty: boolean;
	onLanguageChange: (language: LanguageId) => void;
	onCodeChange: (code: string) => void;
	onReset: () => void;
	onRun: () => void;
	onSubmit: () => void;
};

function EditorSkeleton() {
	return (
		<div className="flex h-full flex-col gap-2.5 p-5">
			{[72, 48, 60, 36, 54, 28].map((width, i) => (
				<Skeleton
					key={i}
					className="h-3.5"
					style={{ width: `${width}%` }}
				/>
			))}
		</div>
	);
}

export function CodeEditorPane({ language, code, isDirty, onLanguageChange, onCodeChange, onReset, onRun, onSubmit }: CodeEditorPaneProps) {
	const { resolvedTheme } = useTheme();
	const [settings, setSettings] = useState<EditorSettings>(() => readStorage("editor-settings", { fontSize: 14, wordWrap: false }));
	const [cursor, setCursor] = useState({ line: 1, column: 1 });
	const [confirmReset, setConfirmReset] = useState(false);

	// Monaco commands are registered once, so they call through refs to stay current
	const handlers = useRef({ onRun, onSubmit });
	useLayoutEffect(() => {
		handlers.current = { onRun, onSubmit };
	});

	const updateSettings = (patch: Partial<EditorSettings>) => {
		setSettings((current) => {
			const next = { ...current, ...patch };
			writeStorage("editor-settings", next);
			return next;
		});
	};

	const handleMount: OnMount = (editor, monaco) => {
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => handlers.current.onSubmit());
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Quote, () => handlers.current.onRun());
		editor.onDidChangeCursorPosition((event) => setCursor({ line: event.position.lineNumber, column: event.position.column }));
		// Web fonts may finish loading after Monaco measured glyphs
		document.fonts?.ready.then(() => monaco.editor.remeasureFonts());
	};

	const fontFamily =
		typeof window === "undefined"
			? "monospace"
			: `${getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "ui-monospace"}, ui-monospace, monospace`;

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center gap-1.5 border-b px-2 py-1.5">
				<span className="grid size-7 place-items-center text-primary">
					<Code2 className="size-4" />
				</span>
				<Select
					value={language}
					onValueChange={(value) => onLanguageChange(value as LanguageId)}
				>
					<SelectTrigger
						size="sm"
						className="h-7 w-auto gap-2 border-none bg-transparent px-2 text-[13px] font-medium shadow-none hover:bg-accent dark:bg-transparent dark:hover:bg-accent"
						aria-label="Programming language"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{LANGUAGE_IDS.map((id) => (
							<SelectItem
								key={id}
								value={id}
							>
								<span
									className="size-2 rounded-full"
									style={{ backgroundColor: LANGUAGES[id].color }}
								/>
								{LANGUAGES[id].label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="ml-auto flex items-center gap-0.5">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setConfirmReset(true)}
								disabled={!isDirty}
								aria-label="Reset to starter code"
							>
								<RotateCcw />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Reset to starter code</TooltipContent>
					</Tooltip>

					<DropdownMenu>
						<Tooltip>
							<TooltipTrigger asChild>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label="Editor settings"
									>
										<Settings2 />
									</Button>
								</DropdownMenuTrigger>
							</TooltipTrigger>
							<TooltipContent>Editor settings</TooltipContent>
						</Tooltip>
						<DropdownMenuContent
							align="end"
							className="w-48"
						>
							<DropdownMenuLabel>Font size</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={String(settings.fontSize)}
								onValueChange={(value) => updateSettings({ fontSize: Number(value) })}
							>
								{FONT_SIZES.map((size) => (
									<DropdownMenuRadioItem
										key={size}
										value={String(size)}
									>
										{size}px
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem
								checked={settings.wordWrap}
								onCheckedChange={(checked) => updateSettings({ wordWrap: Boolean(checked) })}
							>
								Word wrap
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="min-h-0 flex-1">
				<Editor
					height="100%"
					language={LANGUAGES[language].monaco}
					path={`solution.${LANGUAGES[language].extension}`}
					value={code}
					onChange={(value) => onCodeChange(value ?? "")}
					theme={resolvedTheme === "light" ? MONACO_THEMES.light : MONACO_THEMES.dark}
					beforeMount={defineMonacoThemes}
					onMount={handleMount}
					loading={<EditorSkeleton />}
					options={{
						fontSize: settings.fontSize,
						fontFamily,
						fontLigatures: true,
						wordWrap: settings.wordWrap ? "on" : "off",
						minimap: { enabled: false },
						scrollBeyondLastLine: false,
						automaticLayout: true,
						tabSize: 4,
						padding: { top: 14, bottom: 14 },
						smoothScrolling: true,
						cursorBlinking: "smooth",
						cursorSmoothCaretAnimation: "on",
						renderLineHighlight: "all",
						bracketPairColorization: { enabled: true },
						guides: { bracketPairs: "active", indentation: true },
						stickyScroll: { enabled: false },
						scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10, useShadows: false },
						overviewRulerLanes: 0,
						fixedOverflowWidgets: true,
					}}
				/>
			</div>

			<div className="flex items-center justify-between border-t px-3 py-1 font-mono text-[11px] text-muted-foreground">
				<span className="inline-flex items-center gap-1.5">
					{isDirty ? (
						<>
							<Check className="size-3 text-success" /> Draft saved locally
						</>
					) : (
						"Starter code"
					)}
				</span>
				<span>
					Ln {cursor.line}, Col {cursor.column} · {LANGUAGES[language].label}
				</span>
			</div>

			<AlertDialog
				open={confirmReset}
				onOpenChange={setConfirmReset}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Reset your code?</AlertDialogTitle>
						<AlertDialogDescription>
							Your {LANGUAGES[language].label} draft for this problem will be replaced with the starter template. This can&apos;t be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Keep my code</AlertDialogCancel>
						<AlertDialogAction onClick={onReset}>Reset</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
