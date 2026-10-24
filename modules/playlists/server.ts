import "server-only";

import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@/src/generated/client";

export const playlistSchema = z.object({
	name: z.string().trim().min(1, "Give your playlist a name").max(50, "Keep the name under 50 characters"),
	description: z.string().trim().max(300, "Keep the description under 300 characters").optional(),
});

export type PlaylistInput = z.infer<typeof playlistSchema>;

export class PlaylistError extends Error {}

export async function listPlaylists(userId: string) {
	return db.playlist.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
		include: {
			_count: { select: { problems: true } },
			problems: { select: { problemId: true } },
		},
	});
}

export async function createPlaylist(userId: string, input: PlaylistInput) {
	const data = playlistSchema.parse(input);
	try {
		return await db.playlist.create({ data: { ...data, description: data.description || null, userId } });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			throw new PlaylistError("You already have a playlist with that name.");
		}
		throw error;
	}
}

async function assertOwnership(userId: string, playlistId: string) {
	const playlist = await db.playlist.findFirst({ where: { id: playlistId, userId }, select: { id: true } });
	if (!playlist) throw new PlaylistError("Playlist not found.");
}

export async function addProblemToPlaylist(userId: string, playlistId: string, problemId: string) {
	await assertOwnership(userId, playlistId);
	try {
		return await db.problemInPlaylist.create({ data: { playlistId, problemId } });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			throw new PlaylistError("This problem is already in that playlist.");
		}
		throw error;
	}
}

export async function removeProblemFromPlaylist(userId: string, playlistId: string, problemId: string) {
	await assertOwnership(userId, playlistId);
	await db.problemInPlaylist.deleteMany({ where: { playlistId, problemId } });
}

export async function deletePlaylist(userId: string, playlistId: string) {
	await assertOwnership(userId, playlistId);
	await db.playlist.delete({ where: { id: playlistId } });
}

/** A playlist with its problems and the owner's solved status — only visible to its owner. */
export async function getPlaylistDetail(userId: string, playlistId: string) {
	const playlist = await db.playlist.findFirst({
		where: { id: playlistId, userId },
		include: {
			problems: {
				orderBy: { createdAt: "desc" },
				include: { problem: { select: { id: true, title: true, difficulty: true, tags: true } } },
			},
		},
	});
	if (!playlist) return null;

	const solved = await db.problemSolved.findMany({
		where: { userId, problemId: { in: playlist.problems.map((item) => item.problemId) } },
		select: { problemId: true },
	});
	const solvedIds = new Set(solved.map((row) => row.problemId));

	return {
		...playlist,
		problems: playlist.problems.map((item) => ({ ...item, solved: solvedIds.has(item.problemId) })),
	};
}
