"use client";

import { useChat as useChatV6 } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState, useMemo } from "react";

type AppendOptions = { body?: object };
interface SimpleMessage {
	id: string;
	role: string;
	content: string;
}

function useChat({ api }: { api: string }) {
	const [input, setInput] = useState("");
	const transport = useMemo(() => new DefaultChatTransport({ api }), [api]);
	const { messages: uiMessages, sendMessage, setMessages: setUiMessages, status } = useChatV6({ transport });
	const isLoading = status === "streaming" || status === "submitted";

	const messages: SimpleMessage[] = uiMessages.map((m) => ({
		id: m.id,
		role: m.role,
		content: m.parts
			.filter((p): p is { type: "text"; text: string } => p.type === "text")
			.map((p) => p.text)
			.join(""),
	}));

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInput(e.target.value);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>, options?: AppendOptions) => {
		e.preventDefault();
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;
		sendMessage({ text: trimmed }, { body: options?.body });
		setInput("");
	};

	const append = (message: { role: string; content: string }, options?: AppendOptions) => {
		sendMessage({ text: message.content }, { body: options?.body });
	};

	const setMessages = (_msgs: SimpleMessage[] | ((prev: SimpleMessage[]) => SimpleMessage[])) => {
		setUiMessages([]);
	};

	return { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages };
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, X, Send, Sparkles, User, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Problem } from "@/src/generated/browser";

interface AiChatProps {
	problem: Problem;
	currentCode: string;
	selectedLanguage: string;
}

const QUICK_ACTIONS = [
	{ label: "💡 Give me a hint", message: "Give me a hint for this problem without spoiling the full solution." },
	{ label: "📖 Explain the problem", message: "Explain this problem in simple terms with an example." },
	{ label: "🔍 Review my code", message: "Review my current code and suggest improvements or point out any issues." },
	{ label: "⏱️ Optimal approach", message: "What is the optimal time and space complexity approach for this problem?" },
];

function MessageContent({ content }: { content: string }) {
	// Split on fenced code blocks
	const parts = content.split(/(```[\s\S]*?```)/g);
	return (
		<div className="leading-relaxed">
			{parts.map((part, i) => {
				if (part.startsWith("```") && part.endsWith("```")) {
					const firstNewline = part.indexOf("\n");
					const lang = firstNewline !== -1 ? part.slice(3, firstNewline).trim() : "";
					const code = firstNewline !== -1 ? part.slice(firstNewline + 1, -3) : part.slice(3, -3);
					return (
						<pre
							key={i}
							className="bg-zinc-950 text-zinc-100 border border-zinc-800 p-3 rounded-lg text-xs overflow-x-auto my-2 font-mono"
						>
							{lang && <div className="text-zinc-400 text-[10px] mb-1 uppercase tracking-wider">{lang}</div>}
							{code}
						</pre>
					);
				}
				// Render inline **bold** simply
				const segments = part.split(/(\*\*[^*]+\*\*)/g);
				return (
					<span
						key={i}
						className="whitespace-pre-wrap"
					>
						{segments.map((seg, j) => {
							if (seg.startsWith("**") && seg.endsWith("**")) {
								return <strong key={j}>{seg.slice(2, -2)}</strong>;
							}
							return seg;
						})}
					</span>
				);
			})}
		</div>
	);
}

export function AiChat({ problem, currentCode, selectedLanguage }: AiChatProps) {
	const [isOpen, setIsOpen] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	// Keep a ref so the latest code is always sent, even if state hasn't re-rendered
	const currentCodeRef = useRef(currentCode);
	useEffect(() => {
		currentCodeRef.current = currentCode;
	}, [currentCode]);

	const problemContext = {
		title: problem.title,
		difficulty: problem.difficulty,
		description: problem.description,
		constraints: problem.constraints,
		tags: problem.tags,
		language: selectedLanguage,
	};

	const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
		api: "/api/ai-chat",
	});

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Focus input when panel opens
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => inputRef.current?.focus(), 300);
		}
	}, [isOpen]);

	const buildBody = () => ({
		problemContext,
		currentCode: currentCodeRef.current,
	});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		handleSubmit(e, { body: buildBody() });
	};

	const handleQuickAction = (message: string) => {
		append({ role: "user", content: message }, { body: buildBody() });
	};

	return (
		<>
			{/* Floating toggle button */}
			<button
				onClick={() => setIsOpen(true)}
				className={cn(
					"fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl",
					"bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200",
					isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100",
				)}
				aria-label="Open AI Assistant"
			>
				<Sparkles className="h-4 w-4" />
				<span className="font-medium text-sm">AI Assistant</span>
				{messages.length > 0 && (
					<span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
						{messages.filter((m: { role: string }) => m.role === "assistant").length}
					</span>
				)}
			</button>

			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Chat panel */}
			<div
				className={cn(
					"fixed right-0 top-0 h-screen w-105 z-50 flex flex-col border-l bg-background shadow-2xl",
					"transition-transform duration-300 ease-in-out",
					isOpen ? "translate-x-0" : "translate-x-full",
				)}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40 shrink-0">
					<div className="flex items-center gap-2.5">
						<div className="p-1.5 rounded-lg bg-primary/15">
							<Sparkles className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="font-semibold text-sm leading-none">AI Assistant</p>
							<p className="text-[11px] text-muted-foreground mt-0.5">Powered by Gemini • Knows your problem</p>
						</div>
					</div>
					<div className="flex items-center gap-1">
						{messages.length > 0 && (
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={() => setMessages([])}
								title="Clear chat"
							>
								<RotateCcw className="h-3.5 w-3.5" />
							</Button>
						)}
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							onClick={() => setIsOpen(false)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Problem badge */}
				<div className="px-4 py-2 border-b bg-muted/20 shrink-0">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Bot className="h-3.5 w-3.5 shrink-0" />
						<span className="truncate">
							Helping with: <span className="font-medium text-foreground">{problem.title}</span>
						</span>
						<span
							className={cn(
								"ml-auto shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold",
								problem.difficulty === "EASY" && "bg-green-100 text-green-700",
								problem.difficulty === "MEDIUM" && "bg-yellow-100 text-yellow-700",
								problem.difficulty === "HARD" && "bg-red-100 text-red-700",
							)}
						>
							{problem.difficulty}
						</span>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
					{messages.length === 0 ? (
						<div className="text-center py-6">
							<div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-3">
								<Bot className="h-8 w-8 text-primary" />
							</div>
							<p className="font-semibold text-sm mb-1">Ready to help!</p>
							<p className="text-xs text-muted-foreground mb-5 px-4">
								I have full context of this problem and your current code. Ask me anything.
							</p>
							<div className="flex flex-col gap-2">
								{QUICK_ACTIONS.map((action) => (
									<button
										key={action.label}
										onClick={() => handleQuickAction(action.message)}
										disabled={isLoading}
										className="text-xs px-4 py-2.5 rounded-xl border hover:bg-muted transition-colors text-left disabled:opacity-50"
									>
										{action.label}
									</button>
								))}
							</div>
						</div>
					) : (
						<div className="space-y-4 pb-2">
							{messages.map((message: { id: string; role: string; content: string }) => (
								<div
									key={message.id}
									className={cn("flex gap-2.5", message.role === "user" ? "flex-row-reverse" : "flex-row")}
								>
									<div
										className={cn(
											"shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5",
											message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border",
										)}
									>
										{message.role === "user" ? <User className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
									</div>
									<div
										className={cn(
											"max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
											message.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm",
										)}
									>
										<MessageContent content={message.content} />
									</div>
								</div>
							))}

							{isLoading && (
								<div className="flex gap-2.5">
									<div className="shrink-0 w-6 h-6 rounded-full bg-muted border flex items-center justify-center">
										<Sparkles className="h-3 w-3" />
									</div>
									<div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
										<Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
									</div>
								</div>
							)}
							<div ref={bottomRef} />
						</div>
					)}
				</div>

				{/* Quick chips (shown after first message) */}
				{messages.length > 0 && (
					<div className="px-4 pt-2 shrink-0 flex gap-1.5 flex-wrap border-t bg-muted/20">
						{QUICK_ACTIONS.slice(0, 3).map((action) => (
							<button
								key={action.label}
								onClick={() => handleQuickAction(action.message)}
								disabled={isLoading}
								className="text-[11px] px-2.5 py-1 my-1.5 rounded-full border hover:bg-muted transition-colors disabled:opacity-40"
							>
								{action.label}
							</button>
						))}
					</div>
				)}

				{/* Input */}
				<div className="p-4 border-t bg-background shrink-0">
					<form
						onSubmit={onSubmit}
						className="flex gap-2"
					>
						<Input
							ref={inputRef}
							value={input}
							onChange={handleInputChange}
							placeholder="Ask anything about this problem…"
							disabled={isLoading}
							className="flex-1 text-sm"
						/>
						<Button
							type="submit"
							size="icon"
							disabled={isLoading || !input.trim()}
						>
							<Send className="h-4 w-4" />
						</Button>
					</form>
					<p className="text-[10px] text-muted-foreground mt-2 text-center">AI sees your current code automatically on every message</p>
				</div>
			</div>
		</>
	);
}
