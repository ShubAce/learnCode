import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
		}

		const dbUser = await db.user.findUnique({
			where: {
				clerkID: user.id,
			},
		});
		if (!dbUser) {
			return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
		}

		const { problemId, playlistId } = await request.json();
		if (!problemId || !playlistId) {
			return NextResponse.json({ error: "Problem ID and Playlist ID are required", success: false }, { status: 400 });
		}

		const playlist = await db.playlist.findFirst({
			where: {
				id: playlistId,
				userId: dbUser.id,
			},
		});
		if (!playlist) {
			return NextResponse.json({ error: "Playlist not found", success: false }, { status: 404 });
		}

		// Check if problem already exists in playlist
		const existingProblem = await db.problemInPlaylist.findUnique({
			where: {
				playlistId_problemId: {
					playlistId,
					problemId,
				},
			},
		});

		if (existingProblem) {
			return NextResponse.json({ error: "Problem already exists in this playlist", success: false }, { status: 409 });
		}

		const problemInPlaylist = await db.problemInPlaylist.create({
			data: {
				problemId,
				playlistId,
			},
		});

		return NextResponse.json({ success: true, data: problemInPlaylist }, { status: 200 });
	} catch (error) {
		console.error("Error adding problem to playlist:", error);
		return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
	}
}
