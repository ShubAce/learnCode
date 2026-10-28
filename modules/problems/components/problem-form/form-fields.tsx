"use client";

import Editor from "@monaco-editor/react";
import { Plus, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LANGUAGES, type LanguageId } from "@/config/languages";
import { cn } from "@/lib/utils";
import { defineMonacoThemes, MONACO_THEMES } from "../workspace/monaco-themes";

export function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-xs font-medium text-destructive">{message}</p>;
}

export function FormSection({
	id,
	title,
	description,
	action,
	children,
}: {
	id: string;
	title: string;
	description?: string;
	action?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<section
			id={id}
			className="scroll-mt-28 rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-7"
		>
			<header className="mb-6 flex flex-wrap items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					<h2 className="text-lg font-semibold tracking-tight">{title}</h2>
					{description && <p className="text-sm text-muted-foreground">{description}</p>}
				</div>
				{action}
			</header>
			<div className="flex flex-col gap-5">{children}</div>
		</section>
	);
}

type TagInputProps = {
	value: string[];
	onChange: (tags: string[]) => void;
	suggestions?: readonly string[];
	invalid?: boolean;
};

/** Chip-style tag editor: Enter or comma adds, Backspace removes the last tag. */
export function TagInput({ value, onChange, suggestions = [], invalid }: TagInputProps) {
	const [draft, setDraft] = useState("");

	const add = (raw: string) => {
		const tag = raw.trim().replace(/,$/, "");
		setDraft("");
		if (!tag || value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) return;
		onChange([...value, tag]);
	};

	const remaining = suggestions.filter((s) => !value.some((tag) => tag.toLowerCase() === s.toLowerCase())).slice(0, 8);

	return (
		<div className="flex flex-col gap-2.5">
			<div
				className={cn(
					"flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border bg-background/60 px-2 py-1.5 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40",
					invalid && "border-destructive",
				)}
			>
				{value.map((tag) => (
					<span
						key={tag}
						className="inline-flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/10 py-0.5 pr-1 pl-2.5 text-sm font-medium text-foreground"
					>
						{tag}
						<button
							type="button"
							onClick={() => onChange(value.filter((t) => t !== tag))}
							className="rounded p-0.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
							aria-label={`Remove ${tag}`}
						>
							<X className="size-3" />
						</button>
					</span>
				))}
				<input
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter" || event.key === ",") {
							event.preventDefault();
							add(draft);
						} else if (event.key === "Backspace" && !draft && value.length > 0) {
							onChange(value.slice(0, -1));
						}
					}}
					onBlur={() => add(draft)}
					placeholder={value.length === 0 ? "Type a tag and press Enter" : "Add another…"}
					className="min-w-36 flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
					aria-label="Add tag"
				/>
			</div>
			{remaining.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					{remaining.map((suggestion) => (
						<button
							key={suggestion}
							type="button"
							onClick={() => add(suggestion)}
							className="inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
						>
							<Plus className="size-3" /> {suggestion}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

type CodeFieldProps = {
	value: string;
	onChange: (value: string) => void;
	language: LanguageId;
	path: string;
	height?: number;
	invalid?: boolean;
};

export function CodeField({ value, onChange, language, path, height = 280, invalid }: CodeFieldProps) {
	const { resolvedTheme } = useTheme();

	return (
		<div className={cn("overflow-hidden rounded-xl border", invalid && "border-destructive")}>
			<Editor
				height={height}
				path={path}
				language={LANGUAGES[language].monaco}
				value={value}
				onChange={(next) => onChange(next ?? "")}
				theme={resolvedTheme === "light" ? MONACO_THEMES.light : MONACO_THEMES.dark}
				beforeMount={defineMonacoThemes}
				loading={<Skeleton className="size-full rounded-none" />}
				options={{
					minimap: { enabled: false },
					fontSize: 13,
					scrollBeyondLastLine: false,
					automaticLayout: true,
					tabSize: 4,
					padding: { top: 12, bottom: 12 },
					renderLineHighlight: "none",
					overviewRulerLanes: 0,
					scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8, useShadows: false, alwaysConsumeMouseWheel: false },
					fixedOverflowWidgets: true,
				}}
			/>
		</div>
	);
}
