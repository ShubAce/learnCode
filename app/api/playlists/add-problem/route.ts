import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbUser } from "@/modules/auth/server";
import { addProblemToPlaylist, PlaylistError } from "@/modules/playlists/server";

const bodySchema = z.object({ playlistId: z.string().min(1), problemId: z.string().min(1) });

export async function POST(request: Request) {
	const user = await getDbUser();
	if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

	const parsed = bodySchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ success: false, error: "Problem ID and Playlist ID are required" }, { status: 400 });
	}

	try {
		const entry = await addProblemToPlaylist(user.id, parsed.data.playlistId, parsed.data.problemId);
		return NextResponse.json({ success: true, data: entry });
	} catch (error) {
		if (error instanceof PlaylistError) return NextResponse.json({ success: false, error: error.message }, { status: 409 });
		console.error("[api/playlists/add-problem]", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
