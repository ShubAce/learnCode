"use client";

import { Clock3, Cpu, FileCode2, History } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { LanguageChip } from "@/components/shared/language-chip";
import { Markdown } from "@/components/shared/markdown";
import { VerdictBadge } from "@/components/shared/verdict-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isLanguageId, LANGUAGES, type LanguageId } from "@/config/languages";
import { formatDate, formatMemory, formatRuntime, timeAgo } from "@/lib/format";
import type { SubmissionSummary } from "../../types";

type SubmissionListProps = {
	submissions: SubmissionSummary[];
	onLoadCode: (language: LanguageId, code: string) => void;
};

export function SubmissionList({ submissions, onLoadCode }: SubmissionListProps) {
	const [selected, setSelected] = useState<SubmissionSummary | null>(null);

	if (submissions.length === 0) {
		return (
			<EmptyState
				icon={History}
				title="No submissions yet"
				description="Submit a solution and every attempt — accepted or not — will show up here."
			/>
		);
	}

	const language = selected && isLanguageId(selected.language) ? selected.language : null;

	return (
		<>
			<ul className="flex flex-col gap-2">
				{submissions.map((submission) => (
					<li key={submission.id}>
						<button
							type="button"
							onClick={() => setSelected(submission)}
							className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border bg-background/50 px-4 py-3 text-left transition-colors hover:border-primary/30 hover:bg-accent/40"
						>
							<div className="flex min-w-0 flex-col gap-1">
								<VerdictBadge status={submission.status} />
								<span className="text-xs text-muted-foreground">{timeAgo(submission.createdAt)}</span>
							</div>
							<div className="ml-auto flex items-center gap-3 font-mono text-xs text-muted-foreground">
								<LanguageChip language={submission.language} />
								<span className="hidden items-center gap-1 sm:inline-flex">
									<Clock3 className="size-3.5" /> {formatRuntime(submission.runtimeMs)}
								</span>
								<span className="hidden items-center gap-1 sm:inline-flex">
									<Cpu className="size-3.5" /> {formatMemory(submission.memoryKb)}
								</span>
							</div>
						</button>
					</li>
				))}
			</ul>

			<Dialog
				open={Boolean(selected)}
				onOpenChange={(open) => !open && setSelected(null)}
			>
				<DialogContent className="sm:max-w-2xl">
					{selected && (
						<>
							<DialogHeader>
								<DialogTitle className="flex items-center gap-3">
									<VerdictBadge status={selected.status} />
									<LanguageChip language={selected.language} />
								</DialogTitle>
								<DialogDescription>Submitted {formatDate(selected.createdAt, "MMM d, yyyy 'at' h:mm a")}</DialogDescription>
							</DialogHeader>
							<div className="max-h-[55vh] overflow-y-auto">
								<Markdown content={`\`\`\`${language ? LANGUAGES[language].monaco : ""}\n${selected.code || "// Source code unavailable"}\n\`\`\``} />
							</div>
							{language && selected.code && (
								<DialogFooter>
									<Button
										onClick={() => {
											onLoadCode(language, selected.code);
											setSelected(null);
										}}
									>
										<FileCode2 /> Load into editor
									</Button>
								</DialogFooter>
							)}
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
