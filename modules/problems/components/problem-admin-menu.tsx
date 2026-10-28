"use client";

import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteProblem } from "../actions";

/** Edit / delete controls shown to admins on each problem. */
export function ProblemAdminMenu({ problem }: { problem: { id: string; title: string } }) {
	const router = useRouter();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [pending, startTransition] = useTransition();

	const handleDelete = () =>
		startTransition(async () => {
			const result = await deleteProblem(problem.id);
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			toast.success(`Deleted “${problem.title}”`);
			setConfirmOpen(false);
			router.refresh();
		});

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label={`Manage ${problem.title}`}
					>
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-40"
				>
					<DropdownMenuItem asChild>
						<Link href={`/edit-problem/${problem.id}`}>
							<Pencil /> Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onSelect={() => setConfirmOpen(true)}
					>
						<Trash2 /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete “{problem.title}”?</AlertDialogTitle>
						<AlertDialogDescription>
							This permanently removes the problem along with every submission and playlist entry that references it.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={pending}
						>
							{pending && <Loader2 className="animate-spin" />}
							Delete problem
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
