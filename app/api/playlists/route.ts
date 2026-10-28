import { NextResponse } from "next/server";
import { getDbUser } from "@/modules/auth/server";
import { createPlaylist, listPlaylists, PlaylistError, playlistSchema } from "@/modules/playlists/server";

export async function GET() {
	const user = await getDbUser();
	if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

	const playlists = await listPlaylists(user.id);
	return NextResponse.json({ success: true, data: playlists });
}

export async function POST(request: Request) {
	const user = await getDbUser();
	if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

	const parsed = playlistSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid playlist" }, { status: 400 });
	}

	try {
		const playlist = await createPlaylist(user.id, parsed.data);
		return NextResponse.json({ success: true, data: playlist }, { status: 201 });
	} catch (error) {
		if (error instanceof PlaylistError) return NextResponse.json({ success: false, error: error.message }, { status: 409 });
		console.error("[api/playlists]", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
