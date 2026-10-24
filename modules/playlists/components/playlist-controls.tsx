"use client";

import { Loader2, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { deletePlaylist, removeProblemFromPlaylist } from "../actions";

export function DeletePlaylistButton({ playlist }: { playlist: { id: string; name: string } }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [pending, startTransition] = useTransition();

	const handleDelete = () =>
		startTransition(async () => {
			const result = await deletePlaylist(playlist.id);
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			toast.success(`Deleted “${playlist.name}”`);
			router.push("/profile");
		});

	return (
		<AlertDialog
			open={open}
			onOpenChange={setOpen}
		>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="text-destructive hover:text-destructive"
				>
					<Trash2 /> Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete “{playlist.name}”?</AlertDialogTitle>
					<AlertDialogDescription>The playlist will be removed. The problems themselves and your submissions are not affected.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={pending}
					>
						{pending && <Loader2 className="animate-spin" />}
						Delete playlist
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function RemoveFromPlaylistButton({ playlistId, problem }: { playlistId: string; problem: { id: string; title: string } }) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	const handleRemove = () =>
		startTransition(async () => {
			const result = await removeProblemFromPlaylist(playlistId, problem.id);
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			toast.success(`Removed “${problem.title}”`);
			router.refresh();
		});

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={handleRemove}
					disabled={pending}
					aria-label={`Remove ${problem.title} from playlist`}
					className="relative z-10 text-muted-foreground hover:text-destructive"
				>
					{pending ? <Loader2 className="animate-spin" /> : <X />}
				</Button>
			</TooltipTrigger>
			<TooltipContent>Remove from playlist</TooltipContent>
		</Tooltip>
	);
}
