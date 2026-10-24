"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, CloudUpload, List, Loader2, LogIn, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ProblemNeighbor } from "../../types";

type WorkspaceHeaderProps = {
	prev: ProblemNeighbor;
	next: ProblemNeighbor;
	pending: "run" | "submit" | null;
	onRun: () => void;
	onSubmit: () => void;
	aiOpen: boolean;
	onToggleAi: () => void;
};

function NeighborLink({ neighbor, direction }: { neighbor: ProblemNeighbor; direction: "prev" | "next" }) {
	const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
	const label = direction === "prev" ? "Previous problem" : "Next problem";

	if (!neighbor) {
		return (
			<Button
				variant="ghost"
				size="icon-sm"
				disabled
				aria-label={label}
			>
				<Icon />
			</Button>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					asChild
					variant="ghost"
					size="icon-sm"
				>
					<Link
						href={`/problem/${neighbor.id}`}
						aria-label={label}
					>
						<Icon />
					</Link>
				</Button>
			</TooltipTrigger>
			<TooltipContent>{neighbor.title}</TooltipContent>
		</Tooltip>
	);
}

export function WorkspaceHeader({ prev, next, pending, onRun, onSubmit, aiOpen, onToggleAi }: WorkspaceHeaderProps) {
	return (
		<header className="grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 px-2 sm:px-3">
			<div className="flex min-w-0 items-center gap-1">
				<Logo
					compact
					className="mr-1 [&>span:first-child]:size-8"
				/>
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="hidden sm:inline-flex"
				>
					<Link href="/problems">
						<List /> Problem list
					</Link>
				</Button>
				<NeighborLink
					neighbor={prev}
					direction="prev"
				/>
				<NeighborLink
					neighbor={next}
					direction="next"
				/>
			</div>

			<div className="flex items-center gap-1.5">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="secondary"
							size="sm"
							onClick={onRun}
							disabled={pending !== null}
							className="min-w-20 border"
						>
							{pending === "run" ? <Loader2 className="animate-spin" /> : <Play className="fill-current" />}
							<span className="hidden sm:inline">{pending === "run" ? "Running" : "Run"}</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent className="flex items-center gap-1.5">
						Run <Kbd>Ctrl</Kbd>
						<Kbd>&apos;</Kbd>
					</TooltipContent>
				</Tooltip>
				<SignedIn>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="sm"
								onClick={onSubmit}
								disabled={pending !== null}
								className="min-w-24 font-semibold shadow-md shadow-primary/20"
							>
								{pending === "submit" ? <Loader2 className="animate-spin" /> : <CloudUpload />}
								<span className="hidden sm:inline">{pending === "submit" ? "Judging" : "Submit"}</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent className="flex items-center gap-1.5">
							Submit <Kbd>Ctrl</Kbd>
							<Kbd>Enter</Kbd>
						</TooltipContent>
					</Tooltip>
				</SignedIn>
				<SignedOut>
					<SignInButton mode="modal">
						<Button
							size="sm"
							className="font-semibold"
						>
							<LogIn /> <span className="hidden sm:inline">Sign in to submit</span>
						</Button>
					</SignInButton>
				</SignedOut>
			</div>

			<div className="flex items-center justify-end gap-1">
				<Button
					variant={aiOpen ? "default" : "outline"}
					size="sm"
					onClick={onToggleAi}
					className={cn("gap-1.5", !aiOpen && "bg-card")}
					aria-pressed={aiOpen}
				>
					<Sparkles />
					<span className="hidden md:inline">AI tutor</span>
				</Button>
				<ThemeToggle />
				<SignedIn>
					<UserButton appearance={{ elements: { avatarBox: "size-7" } }} />
				</SignedIn>
			</div>
		</header>
	);
}
