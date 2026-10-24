"use client";

import { useClerk } from "@clerk/nextjs";
import { ArrowDownUp, Bookmark, Check, ChevronLeft, ChevronRight, Circle, CircleDot, ListPlus, Search, Shuffle, Tags, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { SegmentedControl } from "@/components/shared/segmented-control";
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
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DIFFICULTIES, DIFFICULTY_META, type Difficulty } from "@/config/difficulty";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CreatePlaylistDialog } from "@/modules/playlists/components/create-playlist-dialog";
import { SaveToPlaylistDialog } from "@/modules/playlists/components/save-to-playlist-dialog";
import type { ProblemListItem, ProblemStatus } from "../types";
import { ProblemAdminMenu } from "./problem-admin-menu";

const PAGE_SIZE = 10;

type SortKey = "number" | "title" | "difficulty" | "acceptance";

const SORT_LABELS: Record<SortKey, string> = {
	number: "Default order",
	title: "Title (A–Z)",
	difficulty: "Difficulty",
	acceptance: "Acceptance rate",
};

const STATUS_FILTERS: { value: "all" | ProblemStatus; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "todo", label: "To do" },
	{ value: "attempted", label: "Attempted" },
	{ value: "solved", label: "Solved" },
];

const DIFFICULTY_ORDER: Record<Difficulty, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

function StatusIcon({ status }: { status: ProblemStatus }) {
	if (status === "solved") {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<span className="grid size-5 place-items-center rounded-full bg-success/15 text-success">
						<Check className="size-3.5" />
					</span>
				</TooltipTrigger>
				<TooltipContent>Solved</TooltipContent>
			</Tooltip>
		);
	}
	if (status === "attempted") {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<CircleDot className="size-5 text-warning" />
				</TooltipTrigger>
				<TooltipContent>Attempted</TooltipContent>
			</Tooltip>
		);
	}
	return <Circle className="size-5 text-muted-foreground/30" />;
}

type ProblemExplorerProps = {
	problems: ProblemListItem[];
	isSignedIn: boolean;
	isAdmin: boolean;
	initialDifficulty: Difficulty | "ALL";
};

export function ProblemExplorer({ problems, isSignedIn, isAdmin, initialDifficulty }: ProblemExplorerProps) {
	const router = useRouter();
	const { openSignIn } = useClerk();
	const searchRef = useRef<HTMLInputElement>(null);

	const [query, setQuery] = useState("");
	const [difficulty, setDifficulty] = useState<Difficulty | "ALL">(initialDifficulty);
	const [status, setStatus] = useState<"all" | ProblemStatus>("all");
	const [tags, setTags] = useState<string[]>([]);
	const [sort, setSort] = useState<SortKey>("number");
	const [page, setPage] = useState(1);
	const [saveTarget, setSaveTarget] = useState<{ id: string; title: string } | null>(null);
	const [createOpen, setCreateOpen] = useState(false);

	// Press "/" anywhere to jump to search
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			if (event.key === "/" && !target?.closest("input, textarea, [contenteditable=true]")) {
				event.preventDefault();
				searchRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const allTags = useMemo(() => [...new Set(problems.flatMap((problem) => problem.tags))].sort((a, b) => a.localeCompare(b)), [problems]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		const matches = problems.filter(
			(problem) =>
				(!q || problem.title.toLowerCase().includes(q) || String(problem.number) === q || problem.tags.some((tag) => tag.toLowerCase().includes(q))) &&
				(difficulty === "ALL" || problem.difficulty === difficulty) &&
				(status === "all" || problem.status === status) &&
				(tags.length === 0 || tags.some((tag) => problem.tags.includes(tag))),
		);

		return matches.sort((a, b) => {
			if (sort === "title") return a.title.localeCompare(b.title);
			if (sort === "difficulty") return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] || a.number - b.number;
			if (sort === "acceptance") return (b.acceptanceRate ?? -1) - (a.acceptanceRate ?? -1);
			return a.number - b.number;
		});
	}, [problems, query, difficulty, status, tags, sort]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	const hasFilters = query !== "" || difficulty !== "ALL" || status !== "all" || tags.length > 0;

	// Any filter change starts again from the first page
	const withReset =
		<T,>(setter: (value: T) => void) =>
		(value: T) => {
			setter(value);
			setPage(1);
		};

	const clearFilters = () => {
		setQuery("");
		setDifficulty("ALL");
		setStatus("all");
		setTags([]);
		setPage(1);
	};

	const pickRandom = () => {
		const pool = filtered.filter((problem) => problem.status !== "solved");
		const candidates = pool.length > 0 ? pool : filtered;
		if (candidates.length === 0) return;
		const choice = candidates[Math.floor(Math.random() * candidates.length)];
		router.push(`/problem/${choice.id}`);
	};

	const requireAuth = (action: () => void) => (isSignedIn ? action() : openSignIn());

	return (
		<div className="flex flex-col gap-4">
			{/* Toolbar */}
			<div className="flex flex-col gap-3 rounded-2xl border bg-card/70 p-3 shadow-sm backdrop-blur lg:flex-row lg:items-center">
				<div className="relative flex-1">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						ref={searchRef}
						value={query}
						onChange={(event) => withReset(setQuery)(event.target.value)}
						placeholder="Search by title, number or tag"
						className="h-10 rounded-xl bg-background/60 pr-10 pl-9"
						aria-label="Search problems"
					/>
					{query ? (
						<button
							type="button"
							onClick={() => withReset(setQuery)("")}
							className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
							aria-label="Clear search"
						>
							<X className="size-3.5" />
						</button>
					) : (
						<Kbd className="absolute top-1/2 right-3 -translate-y-1/2 border">/</Kbd>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<SegmentedControl
						layoutId="difficulty-filter"
						value={difficulty}
						onChange={withReset(setDifficulty)}
						options={[
							{ value: "ALL", label: "All" },
							...DIFFICULTIES.map((d) => ({
								value: d,
								label: (
									<>
										<span className={cn("size-1.5 rounded-full", DIFFICULTY_META[d].classes.solid)} />
										{DIFFICULTY_META[d].label}
									</>
								),
							})),
						]}
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className={cn("h-10 rounded-xl", tags.length > 0 && "border-primary/50 text-primary")}
							>
								<Tags /> Tags
								{tags.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{tags.length}</span>}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="max-h-72 w-56"
						>
							<DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{allTags.length === 0 && <p className="px-2 py-1.5 text-sm text-muted-foreground">No tags yet</p>}
							{allTags.map((tag) => (
								<DropdownMenuCheckboxItem
									key={tag}
									checked={tags.includes(tag)}
									onSelect={(event) => event.preventDefault()}
									onCheckedChange={(checked) => withReset(setTags)(checked ? [...tags, tag] : tags.filter((t) => t !== tag))}
								>
									{tag}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{isSignedIn && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className={cn("h-10 rounded-xl", status !== "all" && "border-primary/50 text-primary")}
								>
									<CircleDot /> {STATUS_FILTERS.find((s) => s.value === status)?.label}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Status</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuRadioGroup
									value={status}
									onValueChange={(value) => withReset(setStatus)(value as "all" | ProblemStatus)}
								>
									{STATUS_FILTERS.map((option) => (
										<DropdownMenuRadioItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="size-10 rounded-xl"
								aria-label="Sort problems"
							>
								<ArrowDownUp />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Sort by</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuRadioGroup
								value={sort}
								onValueChange={(value) => setSort(value as SortKey)}
							>
								{(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
									<DropdownMenuRadioItem
										key={key}
										value={key}
									>
										{SORT_LABELS[key]}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="size-10 rounded-xl"
								onClick={pickRandom}
								disabled={filtered.length === 0}
								aria-label="Open a random problem"
							>
								<Shuffle />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Pick one for me</TooltipContent>
					</Tooltip>

					<Button
						className="h-10 rounded-xl"
						onClick={() => requireAuth(() => setCreateOpen(true))}
					>
						<ListPlus /> <span className="hidden sm:inline">New playlist</span>
					</Button>
				</div>
			</div>

			{/* Active filter summary */}
			<div className="flex min-h-6 items-center justify-between px-1 text-sm text-muted-foreground">
				<span>
					{filtered.length === problems.length ? `${problems.length} problems` : `${filtered.length} of ${problems.length} problems`}
				</span>
				{hasFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
					>
						<X className="size-3" /> Clear filters
					</button>
				)}
			</div>

			{/* List */}
			<div className="overflow-hidden rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
				<div className="hidden grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,15rem)_6rem_6.5rem_4.5rem] items-center gap-4 border-b bg-muted/40 px-5 py-3 font-mono text-[11px] tracking-wider text-muted-foreground uppercase md:grid">
					<span>Status</span>
					<span>Title</span>
					<span>Tags</span>
					<span>Accept.</span>
					<span>Difficulty</span>
					<span className="sr-only">Actions</span>
				</div>

				{visible.length === 0 ? (
					<EmptyState
						icon={Search}
						title={problems.length === 0 ? "No problems published yet" : "Nothing matches those filters"}
						description={problems.length === 0 ? "Check back soon — new challenges are on the way." : "Try a different search term or loosen a filter."}
						action={
							hasFilters ? (
								<Button
									variant="outline"
									onClick={clearFilters}
								>
									Clear filters
								</Button>
							) : undefined
						}
					/>
				) : (
					<ul className="divide-y">
						<AnimatePresence
							initial={false}
							mode="popLayout"
						>
							{visible.map((problem, index) => (
								<motion.li
									key={problem.id}
									layout
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0, transition: { delay: index * 0.025 } }}
									exit={{ opacity: 0, transition: { duration: 0.15 } }}
									className="group relative grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-accent/40 md:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,15rem)_6rem_6.5rem_4.5rem] md:gap-4 md:px-5"
								>
									<StatusIcon status={problem.status} />

									<div className="flex min-w-0 flex-col gap-1.5">
										<Link
											href={`/problem/${problem.id}`}
											className="truncate font-medium transition-colors after:absolute after:inset-0 group-hover:text-primary"
										>
											<span className="mr-1.5 font-mono text-sm text-muted-foreground">{problem.number}.</span>
											{problem.title}
										</Link>
										<div className="flex flex-wrap items-center gap-1.5 md:hidden">
											<DifficultyBadge difficulty={problem.difficulty} />
											{problem.tags.slice(0, 2).map((tag) => (
												<span
													key={tag}
													className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
												>
													{tag}
												</span>
											))}
										</div>
									</div>

									<div className="hidden flex-wrap gap-1.5 md:flex">
										{problem.tags.slice(0, 3).map((tag) => (
											<span
												key={tag}
												className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
											>
												{tag}
											</span>
										))}
										{problem.tags.length > 3 && <span className="px-1 text-xs text-muted-foreground">+{problem.tags.length - 3}</span>}
									</div>

									<span className="hidden font-mono text-sm text-muted-foreground md:block">{formatPercent(problem.acceptanceRate)}</span>

									<div className="hidden md:block">
										<DifficultyBadge difficulty={problem.difficulty} />
									</div>

									<div className="relative z-10 flex items-center justify-end gap-0.5">
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="icon-sm"
													aria-label={`Save ${problem.title} to a playlist`}
													onClick={() => requireAuth(() => setSaveTarget({ id: problem.id, title: problem.title }))}
												>
													<Bookmark />
												</Button>
											</TooltipTrigger>
											<TooltipContent>Save to playlist</TooltipContent>
										</Tooltip>
										{isAdmin && <ProblemAdminMenu problem={problem} />}
									</div>
								</motion.li>
							))}
						</AnimatePresence>
					</ul>
				)}
			</div>

			{/* Pagination */}
			{pageCount > 1 && (
				<nav
					className="flex items-center justify-between gap-4 px-1"
					aria-label="Pagination"
				>
					<p className="text-sm text-muted-foreground">
						{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
					</p>
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon-sm"
							disabled={currentPage === 1}
							onClick={() => setPage(currentPage - 1)}
							aria-label="Previous page"
						>
							<ChevronLeft />
						</Button>
						{Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
							<Button
								key={n}
								variant={n === currentPage ? "default" : "ghost"}
								size="icon-sm"
								onClick={() => setPage(n)}
								aria-current={n === currentPage ? "page" : undefined}
							>
								{n}
							</Button>
						))}
						<Button
							variant="outline"
							size="icon-sm"
							disabled={currentPage === pageCount}
							onClick={() => setPage(currentPage + 1)}
							aria-label="Next page"
						>
							<ChevronRight />
						</Button>
					</div>
				</nav>
			)}

			<SaveToPlaylistDialog
				problem={saveTarget}
				onOpenChange={(open) => !open && setSaveTarget(null)}
			/>
			<CreatePlaylistDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
			/>
		</div>
	);
}
