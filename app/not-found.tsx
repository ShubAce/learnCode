import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Backdrop } from "@/components/layout/backdrop";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="relative flex min-h-dvh flex-col">
			<Backdrop />
			<header className="flex items-center justify-between px-4 py-4 sm:px-6">
				<Logo />
			</header>
			<main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-24 text-center">
				<p className="font-display text-[clamp(7rem,22vw,14rem)] leading-none text-gradient italic">404</p>
				<div className="w-full max-w-md overflow-hidden rounded-2xl border bg-card/80 text-left shadow-xl backdrop-blur">
					<div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-2.5">
						<span className="size-2.5 rounded-full bg-[#ff5f57]" />
						<span className="size-2.5 rounded-full bg-[#febc2e]" />
						<span className="size-2.5 rounded-full bg-[#28c840]" />
						<span className="ml-2 font-mono text-[11px] text-muted-foreground">verdict.log</span>
					</div>
					<div className="flex flex-col gap-1 p-4 font-mono text-[13px]">
						<p>
							<span className="text-muted-foreground">expected:</span> a page
						</p>
						<p>
							<span className="text-muted-foreground">received:</span> nothing at this address
						</p>
						<p className="mt-2 font-semibold text-destructive">✗ Wrong Answer</p>
					</div>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button
						asChild
						size="lg"
						className="rounded-full"
					>
						<Link href="/problems">
							<Search /> Browse problems
						</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="rounded-full bg-card/60"
					>
						<Link href="/">
							<ArrowLeft /> Back home
						</Link>
					</Button>
				</div>
			</main>
		</div>
	);
}
