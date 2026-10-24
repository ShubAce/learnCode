"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ListPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPlaylist } from "../actions";

const formSchema = z.object({
	name: z.string().trim().min(1, "Give your playlist a name").max(50, "Keep the name under 50 characters"),
	description: z.string().trim().max(300, "Keep the description under 300 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CreatePlaylistDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated?: (playlist: { id: string; name: string }) => void;
};

export function CreatePlaylistDialog({ open, onOpenChange, onCreated }: CreatePlaylistDialogProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: { name: "", description: "" } });

	const onSubmit = async (values: FormValues) => {
		const result = await createPlaylist(values);
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		toast.success(`Created “${result.data.name}”`);
		reset();
		onOpenChange(false);
		onCreated?.(result.data);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="mb-2 grid size-11 place-items-center rounded-xl border bg-primary/10 text-primary">
						<ListPlus className="size-5" />
					</div>
					<DialogTitle>New playlist</DialogTitle>
					<DialogDescription>Group problems you want to revisit, drill a topic or plan your week.</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<div className="flex flex-col gap-2">
						<Label htmlFor="playlist-name">Name</Label>
						<Input
							id="playlist-name"
							placeholder="e.g. Graph drills"
							autoFocus
							{...register("name")}
						/>
						{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="playlist-description">
							Description <span className="font-normal text-muted-foreground">(optional)</span>
						</Label>
						<Textarea
							id="playlist-description"
							placeholder="What is this list for?"
							rows={3}
							{...register("description")}
						/>
						{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
					</div>
					<DialogFooter className="mt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting && <Loader2 className="animate-spin" />}
							Create playlist
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
