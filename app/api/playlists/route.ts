import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
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

		const playlists = await db.playlist.findMany({
			where: {
				userId: dbUser.id,
			},
			include: {
				problems: {
					include: {
						problem: {
							select: {
								id: true,
								title: true,
								difficulty: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return NextResponse.json({ success: true, data: playlists }, { status: 200 });
	} catch (error) {
		console.error("Error fetching playlists:", error);
		return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
	}
}

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
		const { name, description } = await request.json();
		if (!name) {
			return NextResponse.json({ error: "Name is required", success: false }, { status: 400 });
		}

		const playlistData = await db.playlist.create({
			data: {
				name,
				description,
				userId: dbUser.id,
			},
		});

		return NextResponse.json({ success: true, data: playlistData }, { status: 201 });
	} catch (error) {
		console.error("Error creating playlist:", error);
		return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
	}
}
