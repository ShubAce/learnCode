import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/brand/github-icon";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
	return (
		<footer className="relative mt-24 overflow-hidden border-t bg-surface/60">
			<div className="mx-auto grid w-full max-w-6xl gap-12 px-4 pt-16 pb-10 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
				<div className="flex flex-col gap-4">
					<Logo />
					<p className="max-w-xs text-sm text-muted-foreground">{siteConfig.tagline}</p>
					<Link
						href={siteConfig.links.github}
						target="_blank"
						rel="noreferrer"
						className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						<GitHubIcon className="size-3.5" />
						Star on GitHub
					</Link>
				</div>

				{siteConfig.footerNav.map((section) => (
					<div key={section.title}>
						<h3 className="mb-4 font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">{section.title}</h3>
						<ul className="flex flex-col gap-2.5">
							{section.items.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										{...(item.external && { target: "_blank", rel: "noreferrer" })}
										className="group inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-primary"
									>
										{item.title}
										{item.external && (
											<ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
										)}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 border-t px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
				<p>
					© {new Date().getFullYear()} {siteConfig.name}. Crafted by{" "}
					<Link
						href={siteConfig.author.url}
						target="_blank"
						rel="noreferrer"
						className="font-medium text-foreground/80 hover:text-primary"
					>
						{siteConfig.author.name}
					</Link>
					.
				</p>
				<p className="font-mono">Built with Next.js · Prisma · Clerk</p>
			</div>

			<div
				aria-hidden
				className="pointer-events-none mx-auto -mb-[0.2em] max-w-6xl px-4 text-center font-display text-[clamp(4rem,17vw,13rem)] leading-none tracking-tight text-transparent select-none [-webkit-text-stroke:1px_var(--border)] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]"
			>
				{siteConfig.name}
			</div>
		</footer>
	);
}
