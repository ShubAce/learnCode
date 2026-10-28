import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { unstable_rethrow } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import { Prisma } from "@/src/generated/client";
import { UserRole } from "@/src/generated/enums";

/**
 * Creates or refreshes the signed-in user's row from their Clerk profile.
 * Called lazily, so users are onboarded wherever they first land.
 */
export const syncDbUser = cache(async () => {
	const user = await currentUser();
	if (!user) return null;

	// User.email is unique, so accounts without an email get a stable per-user placeholder
	const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? `${user.id}@users.noreply.learncode`;
	const profile = { firstName: user.firstName, lastName: user.lastName, imageUrl: user.imageUrl };

	try {
		return await db.user.upsert({
			where: { clerkID: user.id },
			update: { ...profile, email },
			create: { clerkID: user.id, email, ...profile },
		});
	} catch (error) {
		// Same (verified) email under a new Clerk identity — e.g. a re-created account or new Clerk
		// instance. Re-link the existing row so the user keeps their history.
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			return db.user.update({ where: { email }, data: { clerkID: user.id, ...profile } });
		}
		throw error;
	}
});

/** The signed-in user's database row (or null for guests). Deduplicated per request. */
export const getDbUser = cache(async () => {
	const { userId } = await auth();
	if (!userId) return null;

	const existing = await db.user.findUnique({ where: { clerkID: userId } });
	return existing ?? syncDbUser();
});

/** Used by the site layout, where a database failure must not take every page down. */
export async function isAdmin() {
	try {
		const user = await getDbUser();
		return user?.role === UserRole.ADMIN;
	} catch (error) {
		// Let Next.js control-flow errors (dynamic rendering bail-outs, redirects) propagate
		unstable_rethrow(error);
		console.error("[auth] could not resolve the current user's role:", error);
		return false;
	}
}

/** Throws unless the current user is an admin. Use at the top of privileged actions. */
export async function requireAdmin() {
	const user = await getDbUser();
	if (user?.role !== UserRole.ADMIN) throw new Error("Only admins can perform this action.");
	return user;
}
