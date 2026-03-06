import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";

function AddToPlaylistModel({
	isOpen,
	onClose,
	onSubmit,
	problemId,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: any) => void;
	problemId: string;
}) {
	const [playlists, setPlaylists] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const loadPlaylists = async () => {
			try {
				const response = await fetch("/api/playlists");
				const data = await response.json();
				if (data.success) {
					setPlaylists(data.data);
				} else {
					throw new Error(data.error || "Failed to load playlists");
				}
			} catch (error) {
				console.error("Error loading playlists:", error);
			}
		};
		if (isOpen) {
			loadPlaylists();
		}
	}, [isOpen]);

	const handleAddToPlaylist = async (playlistId: string) => {
		try {
			setIsLoading(true);
			await onSubmit({ playlistId, problemId });
			onClose();
		} catch (error) {
			console.error("Error adding problem to playlist:", error);
			toast.error("Failed to add problem to playlist. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add to Playlist</DialogTitle>
					<DialogDescription>Choose a playlist to add this problem to</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-75 w-full pr-4">
					{playlists.length > 0 ? (
						<div className="space-y-2">
							{playlists.map((playlist) => (
								<div
									key={playlist.id}
									className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent"
								>
									<div>
										<h3 className="font-medium">{playlist.name}</h3>
										{playlist.description && <p className="text-sm text-muted-foreground">{playlist.description}</p>}
									</div>
									<Button
										size="sm"
										onClick={() => handleAddToPlaylist(playlist.id)}
										disabled={isLoading}
									>
										<Plus className="h-4 w-4" />
										Add
									</Button>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-4 text-muted-foreground">
							<p>No playlists found. Create one first!</p>
							<Button
								className="mt-2"
								variant="outline"
								onClick={() => {
									onClose();
									// You can emit an event or use a callback here to open create playlist modal
								}}
							>
								Create Playlist
							</Button>
						</div>
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}

export default AddToPlaylistModel;
