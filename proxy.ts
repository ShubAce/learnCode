import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Pages that need an account. Everything else is public, so guests can browse the landing page,
// the problem set and individual problems, and unknown URLs reach the 404 page.
// API routes and server actions check auth themselves and return friendly errors.
const isProtectedRoute = createRouteMatcher(["/profile(.*)", "/create-problem(.*)", "/edit-problem(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	if (isProtectedRoute(req)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
