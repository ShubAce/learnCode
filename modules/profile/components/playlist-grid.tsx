"use client";

import { ArrowUpRight, ListMusic, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { pluralize } from "@/lib/utils";
import { CreatePlaylistDialog } from "@/modules/playlists/components/create-playlist-dialog";
import type { ProfileData } from "../data";
import { Card } from "./card";

export function PlaylistGrid({ playlists }: { playlists: ProfileData["playlists"] }) {
	const router = useRouter();
	const [createOpen, setCreateOpen] = useState(false);

	return (
		<Card
			title="Playlists"
			description={playlists.length > 0 ? `${pluralize(playlists.length, "list")} to keep you focused` : undefined}
			action={
				<Button
					size="sm"
					variant="outline"
					onClick={() => setCreateOpen(true)}
				>
					<Plus /> New
				</Button>
			}
		>
			{playlists.length === 0 ? (
				<EmptyState
					icon={ListMusic}
					title="No playlists yet"
					description="Bundle problems by topic, company or mood, then work through them at your own pace."
				/>
			) : (
				<ul className="grid gap-3 sm:grid-cols-2">
					{playlists.map((playlist) => (
						<li key={playlist.id}>
							<Link
								href={`/profile/playlist/${playlist.id}`}
								className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border bg-background/50 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
							>
								<div className="flex items-start gap-3">
									<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary/25 to-brand-2/20 text-primary">
										<ListMusic className="size-5" />
									</span>
									<span className="flex min-w-0 flex-col">
										<span className="truncate font-medium group-hover:text-primary">{playlist.name}</span>
										<span className="text-xs text-muted-foreground">{pluralize(playlist.problemCount, "problem")}</span>
									</span>
									<ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</div>
								{playlist.description && <p className="line-clamp-2 text-sm text-muted-foreground">{playlist.description}</p>}
								<span className="mt-auto text-[11px] text-muted-foreground">Created {formatDate(playlist.createdAt)}</span>
							</Link>
						</li>
					))}
				</ul>
			)}
			<CreatePlaylistDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onCreated={() => router.refresh()}
			/>
		</Card>
	);
}
