"use client";

import { RotateCw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
			<div className="relative">
				<div className="absolute inset-0 rounded-2xl bg-destructive/25 blur-xl" />
				<div className="relative grid size-16 place-items-center rounded-2xl border bg-card text-destructive shadow-sm">
					<TriangleAlert className="size-7" />
				</div>
			</div>
			<div className="flex max-w-md flex-col gap-2">
				<h1 className="text-2xl font-semibold tracking-tight">Runtime Error</h1>
				<p className="text-muted-foreground">Something went wrong while loading this page. It&apos;s not you — try again in a moment.</p>
				{error.digest && <p className="font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>}
			</div>
			<div className="flex gap-3">
				<Button onClick={reset}>
					<RotateCw /> Try again
				</Button>
				<Button
					asChild
					variant="outline"
				>
					<Link href="/">Go home</Link>
				</Button>
			</div>
		</main>
	);
}
