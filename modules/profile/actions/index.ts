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
