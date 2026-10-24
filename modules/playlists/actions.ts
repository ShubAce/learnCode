"use server";

import { revalidatePath } from "next/cache";
import { getDbUser } from "@/modules/auth/server";
import type { ActionResult } from "@/modules/problems/types";
import * as playlists from "./server";

export type PlaylistOption = {
	id: string;
	name: string;
	description: string | null;
	problemCount: number;
	containsProblem: boolean;
};

async function withUser<T>(fn: (userId: string) => Promise<T>, fallback: string): Promise<ActionResult<T>> {
	const user = await getDbUser();
	if (!user) return { ok: false, error: "Sign in to manage playlists." };
	try {
		return { ok: true, data: await fn(user.id) };
	} catch (error) {
		if (error instanceof playlists.PlaylistError) return { ok: false, error: error.message };
		if (error instanceof Error && error.name === "ZodError") return { ok: false, error: "Please check the playlist details." };
		console.error("[playlists]", error);
		return { ok: false, error: fallback };
	}
}

/** The user's playlists, flagging which already contain `problemId`. */
export async function getMyPlaylists(problemId?: string): Promise<ActionResult<PlaylistOption[]>> {
	return withUser(async (userId) => {
		const rows = await playlists.listPlaylists(userId);
		return rows.map((row) => ({
			id: row.id,
			name: row.name,
			description: row.description,
			problemCount: row._count.problems,
			containsProblem: problemId ? row.problems.some((item) => item.problemId === problemId) : false,
		}));
	}, "Could not load your playlists.");
}

export async function createPlaylist(input: playlists.PlaylistInput): Promise<ActionResult<{ id: string; name: string }>> {
	return withUser(async (userId) => {
		const playlist = await playlists.createPlaylist(userId, input);
		revalidatePath("/profile");
		return { id: playlist.id, name: playlist.name };
	}, "Could not create the playlist.");
}

export async function addProblemToPlaylist(playlistId: string, problemId: string): Promise<ActionResult> {
	return withUser(async (userId) => {
		await playlists.addProblemToPlaylist(userId, playlistId, problemId);
		revalidatePath(`/profile/playlist/${playlistId}`);
		revalidatePath("/profile");
	}, "Could not add the problem.");
}

export async function removeProblemFromPlaylist(playlistId: string, problemId: string): Promise<ActionResult> {
	return withUser(async (userId) => {
		await playlists.removeProblemFromPlaylist(userId, playlistId, problemId);
		revalidatePath(`/profile/playlist/${playlistId}`);
		revalidatePath("/profile");
	}, "Could not remove the problem.");
}

export async function deletePlaylist(playlistId: string): Promise<ActionResult> {
	return withUser(async (userId) => {
		await playlists.deletePlaylist(userId, playlistId);
		revalidatePath("/profile");
	}, "Could not delete the playlist.");
}
