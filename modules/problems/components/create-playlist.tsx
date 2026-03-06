"use client";
import React from "react";
import * as z from "zod";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const playlistSchema = z.object({
	name: z.string().min(1, "Name is required").max(50, "Name is too long"),
	description: z.string().max(500, "Description is too long").optional(),
});
function CreatePlaylistModel({
	isOpen,
	onClose,
	onSubmit,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: z.infer<typeof playlistSchema>) => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(playlistSchema),
	});

	const handleFormSubmit = async (data: z.infer<typeof playlistSchema>) => {
		try {
			setIsLoading(true);
			await onSubmit(data);
			reset();
			onClose();
		} catch (error) {
			console.error("Error creating playlist:", error);
			toast.error("Failed to create playlist. Please try again.");
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
					<DialogTitle>Create New Playlist</DialogTitle>
					<DialogDescription>Create a new playlist to organize your favorite problems</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="space-y-4"
				>
					<div>
						<Label htmlFor="name">Playlist Name</Label>
						<Input
							id="name"
							{...register("name")}
							placeholder="Enter playlist name"
							className="mt-1"
						/>
						{errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
					</div>
					<div>
						<Label htmlFor="description">Description (Optional)</Label>
						<Textarea
							id="description"
							{...register("description")}
							placeholder="Enter playlist description"
							className="mt-1"
						/>
						{errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
					</div>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? "Creating..." : "Create Playlist"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default CreatePlaylistModel;
