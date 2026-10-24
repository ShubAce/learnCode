import { ArrowLeft, CalendarDays, Check, Circle, ListMusic, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { pluralize } from "@/lib/utils";
import { getDbUser } from "@/modules/auth/server";
import { DeletePlaylistButton, RemoveFromPlaylistButton } from "@/modules/playlists/components/playlist-controls";
import { getPlaylistDetail } from "@/modules/playlists/server";

export const metadata: Metadata = { title: "Playlist" };

type PlaylistPageProps = { params: Promise<{ id: string }> };

export default async function PlaylistPage({ params }: PlaylistPageProps) {
	const { id } = await params;
	const user = await getDbUser();
	if (!user) redirect("/sign-in");

	const playlist = await getPlaylistDetail(user.id, id);
	if (!playlist) notFound();

	const total = playlist.problems.length;
	const solved = playlist.problems.filter((item) => item.solved).length;
	const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-28 pb-8 sm:px-6">
			<Button
				asChild
				variant="ghost"
				size="sm"
				className="w-fit"
			>
				<Link href="/profile">
					<ArrowLeft /> Back to profile
				</Link>
			</Button>

			<Reveal>
				<header className="relative overflow-hidden rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur sm:p-8">
					<div
						aria-hidden
						className="absolute -top-20 -left-20 size-64 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-2xl"
					/>
					<div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
						<span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-primary/30 to-brand-2/25 text-primary shadow-inner">
							<ListMusic className="size-7" />
						</span>
						<div className="flex flex-1 flex-col gap-2">
							<h1 className="text-3xl font-semibold tracking-tight">{playlist.name}</h1>
							{playlist.description && <p className="max-w-2xl text-muted-foreground">{playlist.description}</p>}
							<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
								<span className="inline-flex items-center gap-1.5">
									<CalendarDays className="size-4" /> Created {formatDate(playlist.createdAt)}
								</span>
								<span>{pluralize(total, "problem")}</span>
							</div>
						</div>
						<DeletePlaylistButton playlist={playlist} />
					</div>
					{total > 0 && (
						<div className="relative mt-6 flex flex-col gap-2">
							<div className="flex justify-between text-sm">
								<span className="font-medium">Progress</span>
								<span className="font-mono text-muted-foreground">
									{solved}/{total} · {percent}%
								</span>
							</div>
							<div className="h-2 overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-linear-to-r from-primary to-brand-2"
									style={{ width: `${percent}%` }}
								/>
							</div>
						</div>
					)}
				</header>
			</Reveal>

			<Reveal delay={0.05}>
				<section className="overflow-hidden rounded-2xl border bg-card/80 shadow-sm backdrop-blur">
					{total === 0 ? (
						<EmptyState
							icon={Search}
							title="This playlist is empty"
							description="Use the bookmark button on the problem list to add problems here."
							action={
								<Button
									asChild
									size="sm"
								>
									<Link href="/problems">Browse problems</Link>
								</Button>
							}
						/>
					) : (
						<ul className="divide-y">
							{playlist.problems.map((item) => (
								<li
									key={item.id}
									className="group relative flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent/40"
								>
									{item.solved ? (
										<span className="grid size-5 place-items-center rounded-full bg-success/15 text-success">
											<Check className="size-3.5" />
										</span>
									) : (
										<Circle className="size-5 text-muted-foreground/30" />
									)}
									<div className="flex min-w-0 flex-1 flex-col gap-1">
										<Link
											href={`/problem/${item.problem.id}`}
											className="truncate font-medium after:absolute after:inset-0 group-hover:text-primary"
										>
											{item.problem.title}
										</Link>
										<span className="text-xs text-muted-foreground">
											Added {formatDate(item.createdAt)}
											{item.problem.tags.length > 0 && ` · ${item.problem.tags.slice(0, 3).join(", ")}`}
										</span>
									</div>
									<DifficultyBadge difficulty={item.problem.difficulty} />
									<RemoveFromPlaylistButton
										playlistId={playlist.id}
										problem={item.problem}
									/>
								</li>
							))}
						</ul>
					)}
				</section>
			</Reveal>
		</div>
	);
}
