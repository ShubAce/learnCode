"use client";

import { useChat } from "@ai-sdk/react";
import { SignInButton } from "@clerk/nextjs";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, BookOpen, Bug, Gauge, Lightbulb, LogIn, RotateCcw, RotateCw, Sparkles, Square, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { Markdown } from "@/components/shared/markdown";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Difficulty } from "@/config/difficulty";
import type { LanguageId } from "@/config/languages";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
	{ icon: Lightbulb, label: "Give me a hint", prompt: "Give me a hint for this problem without spoiling the full solution." },
	{ icon: BookOpen, label: "Explain the problem", prompt: "Explain this problem in simple terms with a small example." },
	{ icon: Bug, label: "Review my code", prompt: "Review my current code. Point out bugs, edge cases I'm missing and possible improvements." },
	{ icon: Gauge, label: "Optimal approach", prompt: "What is the optimal approach for this problem, and what are its time and space complexities?" },
];

const textOf = (message: UIMessage) =>
	message.parts
		.filter((part): part is { type: "text"; text: string } => part.type === "text")
		.map((part) => part.text)
		.join("");

/** API errors arrive as the raw response body; surface the friendly message inside it. */
function readableError(error: Error) {
	try {
		const parsed = JSON.parse(error.message) as { error?: string };
		if (parsed.error) return parsed.error;
	} catch {
		// Not JSON
	}
	return error.message || "Something went wrong. Please try again.";
}

type AiAssistantProps = {
	open: boolean;
	onClose: () => void;
	problem: { id: string; title: string; difficulty: Difficulty };
	language: LanguageId;
	/** Returns the editor's latest code at send time */
	getCode: () => string;
	isSignedIn: boolean;
};

export function AiAssistant({ open, onClose, problem, language, getCode, isSignedIn }: AiAssistantProps) {
	const [transport] = useState(() => new DefaultChatTransport({ api: "/api/ai-chat" }));
	const { messages, sendMessage, status, error, stop, regenerate, setMessages, clearError } = useChat({ id: `tutor-${problem.id}`, transport });
	const [input, setInput] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const busy = status === "submitted" || status === "streaming";

	const requestBody = () => ({ body: { problemId: problem.id, language, code: getCode() } });

	useEffect(() => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
	}, [messages, status]);

	useEffect(() => {
		if (!open) return;
		const timer = setTimeout(() => inputRef.current?.focus(), 250);
		const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
		window.addEventListener("keydown", onKeyDown);
		return () => {
			clearTimeout(timer);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open, onClose]);

	const send = (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || busy) return;
		clearError();
		sendMessage({ text: trimmed }, requestBody());
		setInput("");
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault();
			send(input);
		}
	};

	return (
		<AnimatePresence>
			{open && (
				<motion.aside
					initial={{ x: 40, opacity: 0, scale: 0.98 }}
					animate={{ x: 0, opacity: 1, scale: 1 }}
					exit={{ x: 40, opacity: 0, scale: 0.98 }}
					transition={{ type: "spring", stiffness: 380, damping: 34 }}
					className="fixed top-14 right-2 bottom-2 z-40 flex w-[min(440px,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl border bg-card/95 shadow-2xl shadow-black/20 backdrop-blur-xl"
					aria-label="AI tutor"
				>
					{/* Header */}
					<div className="flex items-center gap-3 border-b px-4 py-3">
						<div className="relative grid size-9 place-items-center rounded-xl bg-linear-to-br from-primary to-brand-2 text-primary-foreground shadow-md shadow-primary/30">
							<Sparkles className="size-4" />
						</div>
						<div className="flex min-w-0 flex-col">
							<span className="text-sm font-semibold">AI tutor</span>
							<span className="truncate text-xs text-muted-foreground">Knows this problem · sees your code</span>
						</div>
						<div className="ml-auto flex items-center gap-0.5">
							{messages.length > 0 && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => {
												stop();
												setMessages([]);
												clearError();
											}}
											aria-label="New conversation"
										>
											<RotateCcw />
										</Button>
									</TooltipTrigger>
									<TooltipContent>New conversation</TooltipContent>
								</Tooltip>
							)}
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={onClose}
								aria-label="Close AI tutor"
							>
								<X />
							</Button>
						</div>
					</div>

					<div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
						<span className="truncate">
							Helping with <span className="font-medium text-foreground">{problem.title}</span>
						</span>
						<DifficultyBadge
							difficulty={problem.difficulty}
							className="ml-auto shrink-0 py-0 text-[10px]"
						/>
					</div>

					{/* Messages */}
					<div
						ref={scrollRef}
						className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
					>
						{messages.length === 0 ? (
							<div className="flex h-full flex-col justify-center gap-5">
								<div className="flex flex-col items-center gap-2 text-center">
									<motion.div
										className="grid size-14 place-items-center rounded-2xl border bg-primary/10 text-primary"
										animate={{ rotate: [0, -6, 6, 0] }}
										transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2 }}
									>
										<Sparkles className="size-6" />
									</motion.div>
									<p className="mt-1 font-semibold">How can I help?</p>
									<p className="max-w-xs text-sm text-pretty text-muted-foreground">
										I&apos;ll nudge you towards the answer instead of handing it over — unless you ask.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-2">
									{QUICK_ACTIONS.map((action, index) => (
										<motion.button
											key={action.label}
											type="button"
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.05 * index }}
											onClick={() => send(action.prompt)}
											disabled={!isSignedIn || busy}
											className="flex flex-col items-start gap-2 rounded-xl border bg-background/60 p-3 text-left text-[13px] font-medium transition-colors hover:border-primary/40 hover:bg-accent/50 disabled:opacity-50"
										>
											<action.icon className="size-4 text-primary" />
											{action.label}
										</motion.button>
									))}
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-5">
								{messages.map((message) =>
									message.role === "user" ? (
										<motion.div
											key={message.id}
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm whitespace-pre-wrap text-primary-foreground"
										>
											{textOf(message)}
										</motion.div>
									) : (
										<motion.div
											key={message.id}
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											className="flex gap-2.5"
										>
											<span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
												<Sparkles className="size-3.5" />
											</span>
											<Markdown
												content={textOf(message)}
												className="min-w-0 flex-1 text-[13.5px]"
											/>
										</motion.div>
									),
								)}

								{status === "submitted" && (
									<div className="flex items-center gap-2.5">
										<span className="grid size-6 place-items-center rounded-lg bg-primary/15 text-primary">
											<Sparkles className="size-3.5" />
										</span>
										<div className="flex gap-1">
											{[0, 1, 2].map((dot) => (
												<motion.span
													key={dot}
													className="size-1.5 rounded-full bg-muted-foreground"
													animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
													transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
												/>
											))}
										</div>
									</div>
								)}

								{error && (
									<div className="flex flex-col items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm">
										<span className="text-destructive">{readableError(error)}</span>
										<Button
											size="xs"
											variant="outline"
											onClick={() => regenerate(requestBody())}
										>
											<RotateCw /> Retry
										</Button>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Composer */}
					<div className="border-t p-3">
						{isSignedIn ? (
							<form
								onSubmit={(event) => {
									event.preventDefault();
									send(input);
								}}
								className="flex items-end gap-2 rounded-xl border bg-background/70 p-1.5 pl-3 transition-colors focus-within:border-primary/50"
							>
								<textarea
									ref={inputRef}
									value={input}
									onChange={(event) => setInput(event.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Ask about this problem…"
									rows={1}
									className="max-h-36 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm outline-none field-sizing-content placeholder:text-muted-foreground"
								/>
								{busy ? (
									<Button
										type="button"
										size="icon-sm"
										variant="outline"
										onClick={stop}
										aria-label="Stop generating"
									>
										<Square className="size-3 fill-current" />
									</Button>
								) : (
									<Button
										type="submit"
										size="icon-sm"
										disabled={!input.trim()}
										aria-label="Send message"
										className={cn("transition-transform", input.trim() && "scale-105")}
									>
										<ArrowUp />
									</Button>
								)}
							</form>
						) : (
							<SignInButton mode="modal">
								<Button className="w-full">
									<LogIn /> Sign in to chat with the AI tutor
								</Button>
							</SignInButton>
						)}
						<p className="mt-2 text-center text-[11px] text-muted-foreground">Enter to send · Shift + Enter for a new line</p>
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
