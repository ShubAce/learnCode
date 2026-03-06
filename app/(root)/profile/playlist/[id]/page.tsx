import { getPlaylistDetails } from "@/modules/profile/actions";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
};

const PlaylistDetailPage = async ({ params }: Props) => {
	const { id } = await params;
	const playlist = await getPlaylistDetails(id);

	if (!playlist || "error" in playlist) {
		notFound();
	}

	const formatDate = (dateString: Date | string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "EASY":
				return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-400";
			case "MEDIUM":
				return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400";
			case "HARD":
				return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950 dark:text-red-400";
			default:
				return "";
		}
	};

	return (
		<div className="h-full py-32">
			<div className="container mx-auto px-4 max-w-7xl">
				<div className="mb-6">
					<Link href="/profile">
						<Button
							variant="ghost"
							className="gap-2"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Profile
						</Button>
					</Link>
				</div>

				<Card className="mb-8">
					<CardHeader>
						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4">
								<FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
							</div>
							<div className="flex-1">
								<CardTitle className="text-3xl mb-2">{playlist.name}</CardTitle>
								{playlist.description && <p className="text-muted-foreground text-lg">{playlist.description}</p>}
								<div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<Calendar className="w-4 h-4" />
										<span>Created {formatDate(playlist.createdAt)}</span>
									</div>
									<Badge variant="secondary">{playlist.problems.length} Problems</Badge>
								</div>
							</div>
						</div>
					</CardHeader>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Problems in this Playlist</CardTitle>
					</CardHeader>
					<CardContent>
						{playlist.problems.length === 0 ? (
							<div className="text-center py-12">
								<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
									<FileText className="w-8 h-8 text-muted-foreground" />
								</div>
								<h3 className="text-lg font-medium mb-2">No Problems Added Yet</h3>
								<p className="text-muted-foreground">Add problems to this playlist from the problems page!</p>
							</div>
						) : (
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{playlist.problems.map((item) => (
									<Link
										key={item.id}
										href={`/problem/${item.problem.id}`}
									>
										<Card className="hover:shadow-md transition-all duration-200 h-full cursor-pointer group">
											<CardContent className="p-6">
												<div className="space-y-3">
													<h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
														{item.problem.title}
													</h3>
													<p className="text-sm text-muted-foreground line-clamp-2">{item.problem.description}</p>
													<div className="flex items-center gap-2 flex-wrap">
														<Badge className={`${getDifficultyColor(item.problem.difficulty)} border-0`}>
															{item.problem.difficulty}
														</Badge>
														{item.problem.tags.map((tag, idx) => (
															<Badge
																key={idx}
																variant="outline"
																className="text-xs"
															>
																{tag}
															</Badge>
														))}
													</div>
													<div className="text-xs text-muted-foreground">
														<Calendar className="w-3 h-3 inline mr-1" />
														Added {formatDate(item.createdAt)}
													</div>
												</div>
											</CardContent>
										</Card>
									</Link>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default PlaylistDetailPage;
