import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** The LearnCode mark, drawn with currentColor so it adapts to any theme. */
export function LogoMark({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden
			className={cn("size-6 text-primary", className)}
		>
			<g
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path
					strokeWidth={2}
					d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1M18 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"
				/>
				<g strokeWidth={1.2}>
					<ellipse
						cx="13"
						cy="7.92"
						rx="5.25"
						ry="1.75"
					/>
					<path d="M7.75 7.92v8.16c0 .97 2.35 1.75 5.25 1.75.6 0 1.18-.03 1.75-.1M18.25 7.92v1.75M18.25 12l-1.75 2.92h2.33l-1.75 2.91M7.75 12c0 .97 2.35 1.75 5.25 1.75.52 0 1.03-.03 1.51-.08" />
				</g>
			</g>
		</svg>
	);
}

export function Logo({ className, href = "/", compact = false }: { className?: string; href?: string; compact?: boolean }) {
	return (
		<Link
			href={href}
			aria-label={`${siteConfig.name} home`}
			className={cn("group inline-flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
		>
			<span className="relative grid size-9 place-items-center rounded-xl border bg-card shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
				<span className="absolute inset-0 rounded-xl bg-primary/15 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
				<LogoMark className="relative size-6" />
			</span>
			{!compact && (
				<span className="text-[1.05rem] font-semibold tracking-tight">
					Learn<span className="text-primary">Code</span>
				</span>
			)}
		</Link>
	);
}
