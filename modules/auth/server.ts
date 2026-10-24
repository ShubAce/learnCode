import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { db } from "@/lib/db";
import { UserRole } from "@/src/generated/enums";

/**
 * Creates or refreshes the signed-in user's row from their Clerk profile.
 * Called lazily, so users are onboarded wherever they first land.
 */
export const syncDbUser = cache(async () => {
	const user = await currentUser();
	if (!user) return null;

	const profile = {
		email: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "",
		firstName: user.firstName,
		lastName: user.lastName,
		imageUrl: user.imageUrl,
	};

	return db.user.upsert({
		where: { clerkID: user.id },
		update: profile,
		create: { clerkID: user.id, ...profile },
	});
});

/** The signed-in user's database row (or null for guests). Deduplicated per request. */
export const getDbUser = cache(async () => {
	const { userId } = await auth();
	if (!userId) return null;

	const existing = await db.user.findUnique({ where: { clerkID: userId } });
	return existing ?? syncDbUser();
});

export async function isAdmin() {
	const user = await getDbUser();
	return user?.role === UserRole.ADMIN;
}

/** Throws unless the current user is an admin. Use at the top of privileged actions. */
export async function requireAdmin() {
	const user = await getDbUser();
	if (user?.role !== UserRole.ADMIN) throw new Error("Only admins can perform this action.");
	return user;
}
