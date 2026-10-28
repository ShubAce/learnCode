"use client";

import { Check, ListMusic, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, pluralize } from "@/lib/utils";
import { addProblemToPlaylist, getMyPlaylists, removeProblemFromPlaylist, type PlaylistOption } from "../actions";
import { CreatePlaylistDialog } from "./create-playlist-dialog";

type SaveToPlaylistDialogProps = {
	problem: { id: string; title: string } | null;
	onOpenChange: (open: boolean) => void;
};

/** Toggle a problem in and out of the user's playlists, with inline playlist creation. */
export function SaveToPlaylistDialog({ problem, onOpenChange }: SaveToPlaylistDialogProps) {
	const [playlists, setPlaylists] = useState<PlaylistOption[] | null>(null);
	const [pendingId, setPendingId] = useState<string | null>(null);
	const [createOpen, setCreateOpen] = useState(false);

	const load = useCallback(async (problemId: string) => {
		const result = await getMyPlaylists(problemId);
		if (result.ok) setPlaylists(result.data);
		else toast.error(result.error);
	}, []);

	// Fetch whenever the dialog opens for a problem; ignore responses for a stale problem
	useEffect(() => {
		if (!problem) return;
		let cancelled = false;
		getMyPlaylists(problem.id).then((result) => {
			if (cancelled) return;
			if (result.ok) setPlaylists(result.data);
			else toast.error(result.error);
		});
		return () => {
			cancelled = true;
		};
	}, [problem]);

	const toggle = async (playlist: PlaylistOption) => {
		if (!problem) return;
		setPendingId(playlist.id);
		const result = playlist.containsProblem
			? await removeProblemFromPlaylist(playlist.id, problem.id)
			: await addProblemToPlaylist(playlist.id, problem.id);
		setPendingId(null);

		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		toast.success(playlist.containsProblem ? `Removed from “${playlist.name}”` : `Saved to “${playlist.name}”`);
		setPlaylists(
			(current) =>
				current?.map((item) =>
					item.id === playlist.id
						? { ...item, containsProblem: !item.containsProblem, problemCount: item.problemCount + (item.containsProblem ? -1 : 1) }
						: item,
				) ?? null,
		);
	};

	return (
		<>
			<Dialog
				open={Boolean(problem) && !createOpen}
				onOpenChange={(open) => {
					if (!open) setPlaylists(null);
					onOpenChange(open);
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Save to playlist</DialogTitle>
						<DialogDescription className="truncate">{problem?.title}</DialogDescription>
					</DialogHeader>

					<div className="-mx-2 flex max-h-80 flex-col gap-1 overflow-y-auto px-2">
						{playlists === null ? (
							Array.from({ length: 3 }, (_, i) => (
								<Skeleton
									key={i}
									className="h-14 rounded-xl"
								/>
							))
						) : playlists.length === 0 ? (
							<EmptyState
								icon={ListMusic}
								title="No playlists yet"
								description="Create your first playlist and this problem will be one click away."
								className="py-6"
							/>
						) : (
							playlists.map((playlist) => (
								<button
									key={playlist.id}
									type="button"
									onClick={() => toggle(playlist)}
									disabled={pendingId !== null}
									className={cn(
										"flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors hover:bg-accent/60 disabled:opacity-60",
										playlist.containsProblem && "border-primary/40 bg-primary/5",
									)}
								>
									<span
										className={cn(
											"grid size-8 shrink-0 place-items-center rounded-lg border transition-colors",
											playlist.containsProblem ? "border-primary bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
										)}
									>
										{pendingId === playlist.id ? (
											<Loader2 className="size-4 animate-spin" />
										) : playlist.containsProblem ? (
											<Check className="size-4" />
										) : (
											<ListMusic className="size-4" />
										)}
									</span>
									<span className="flex min-w-0 flex-col">
										<span className="truncate text-sm font-medium">{playlist.name}</span>
										<span className="text-xs text-muted-foreground">{pluralize(playlist.problemCount, "problem")}</span>
									</span>
								</button>
							))
						)}
					</div>

					<Button
						variant="outline"
						className="w-full border-dashed"
						onClick={() => setCreateOpen(true)}
					>
						<Plus /> New playlist
					</Button>
				</DialogContent>
			</Dialog>

			<CreatePlaylistDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onCreated={async (created) => {
					if (!problem) return;
					const result = await addProblemToPlaylist(created.id, problem.id);
					if (result.ok) toast.success(`Saved to “${created.name}”`);
					await load(problem.id);
				}}
			/>
		</>
	);
}
