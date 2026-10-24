"use client";

import { Check, Copy } from "lucide-react";
import { memo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

function CopyButton({ value }: { value: string }) {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		await navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1600);
	};

	return (
		<button
			type="button"
			onClick={copy}
			className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
			aria-label="Copy code"
		>
			{copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
			{copied ? "Copied" : "Copy"}
		</button>
	);
}

/** Recursively extracts the raw text of highlighted code so it can be copied. */
function textOf(node: React.ReactNode): string {
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join("");
	if (node && typeof node === "object" && "props" in node) return textOf((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
	return "";
}

const components: Components = {
	pre({ children }) {
		const child = Array.isArray(children) ? children[0] : children;
		const className = (child as React.ReactElement<{ className?: string }>)?.props?.className ?? "";
		const language = /language-([\w+#-]+)/.exec(className)?.[1] ?? "text";
		const code = textOf(children).replace(/\n$/, "");

		return (
			<div className="not-prose group/code my-3 overflow-hidden rounded-xl border bg-(--code-bg)">
				<div className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5">
					<span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{language}</span>
					<CopyButton value={code} />
				</div>
				<pre className="overflow-x-auto p-3.5 font-mono text-[12.5px] leading-relaxed">{children}</pre>
			</div>
		);
	},
	a({ href, children }) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
			>
				{children}
			</a>
		);
	},
};

// Languages considered when a fenced block has no explicit language tag
const HIGHLIGHT_SUBSET = ["javascript", "typescript", "python", "java", "cpp", "c", "json", "bash"];

type MarkdownProps = {
	content: string;
	className?: string;
	/** Treat single newlines as line breaks (useful for plain-text problem statements) */
	breaks?: boolean;
};

export const Markdown = memo(function Markdown({ content, className, breaks = false }: MarkdownProps) {
	return (
		<div className={cn("markdown text-sm", className)}>
			<ReactMarkdown
				remarkPlugins={breaks ? [remarkGfm, remarkBreaks] : [remarkGfm]}
				rehypePlugins={[[rehypeHighlight, { detect: true, subset: HIGHLIGHT_SUBSET }]]}
				components={components}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
});
