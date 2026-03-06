"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { success } from "zod";

export const getCurrentUserData = async () => {
	try {
		const user = await currentUser();

		const data = await db.user.findUnique({
			where: {
				clerkID: user?.id,
			},
			include: {
				submissions: true,
				solvedProblems: {
					include: {
						problem: true,
					},
				},
				playlists: true,
			},
		});
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		return {
			success: false,
			error: "Failed to fetch user data",
		};
	}
};

export const getPlaylistDetails = async (playlistId: string) => {
	try {
		const user = await currentUser();
		if (!user) {
			return {
				success: false,
				error: "Unauthorized",
			};
		}

		const playlist = await db.playlist.findFirst({
			where: {
				id: playlistId,
			},
			include: {
				problems: {
					include: {
						problem: {
							select: {
								id: true,
								title: true,
								description: true,
								difficulty: true,
								tags: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				},
			},
		});

		if (!playlist) {
			return {
				success: false,
				error: "Playlist not found",
			};
		}

		return playlist;
	} catch (error) {
		console.error("Error fetching playlist details:", error);
		return {
			success: false,
			error: "Failed to fetch playlist details",
		};
	}
};
