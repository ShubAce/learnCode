"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight, Menu, Plus, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function SiteHeader({ isAdmin }: { isAdmin: boolean }) {
	const pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [lastPathname, setLastPathname] = useState(pathname);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 12));

	// Close the mobile menu whenever the route changes
	if (lastPathname !== pathname) {
		setLastPathname(pathname);
		setMenuOpen(false);
	}

	return (
		<header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4">
			<motion.nav
				initial={{ y: -24, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				className={cn(
					"w-full max-w-6xl rounded-2xl border transition-[background-color,border-color,box-shadow,padding] duration-500",
					scrolled || menuOpen ? "glass border-border shadow-lg shadow-black/4 dark:shadow-black/30" : "border-transparent bg-transparent",
				)}
			>
				<div className={cn("flex items-center justify-between gap-4 px-3 transition-[padding] duration-500 sm:px-4", scrolled ? "py-2" : "py-3")}>
					<Logo />

					<ul className="hidden items-center gap-1 md:flex">
						{siteConfig.mainNav.map((item) => {
							const active = isActive(pathname, item.href);
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										className={cn(
											"relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
											active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
										)}
									>
										{active && (
											<motion.span
												layoutId="nav-active-pill"
												className="absolute inset-0 -z-10 rounded-full border bg-card shadow-sm"
												transition={{ type: "spring", stiffness: 380, damping: 32 }}
											/>
										)}
										{item.title}
									</Link>
								</li>
							);
						})}
					</ul>

					<div className="flex items-center gap-1.5">
						<ThemeToggle />
						<SignedIn>
							{isAdmin && (
								<Button
									asChild
									size="sm"
									variant="outline"
									className="hidden rounded-full sm:inline-flex"
								>
									<Link href="/create-problem">
										<Plus /> New problem
									</Link>
								</Button>
							)}
							<div className="ml-1 flex items-center">
								<UserButton appearance={{ elements: { avatarBox: "size-8 ring-2 ring-primary/40 ring-offset-2 ring-offset-background" } }} />
							</div>
						</SignedIn>
						<SignedOut>
							<Button
								asChild
								size="sm"
								variant="ghost"
								className="hidden rounded-full sm:inline-flex"
							>
								<Link href="/sign-in">Sign in</Link>
							</Button>
							<Button
								asChild
								size="sm"
								className="group hidden rounded-full sm:inline-flex"
							>
								<Link href="/sign-up">
									Get started
									<ArrowRight className="transition-transform group-hover:translate-x-0.5" />
								</Link>
							</Button>
						</SignedOut>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full md:hidden"
							onClick={() => setMenuOpen((open) => !open)}
							aria-label={menuOpen ? "Close menu" : "Open menu"}
							aria-expanded={menuOpen}
						>
							{menuOpen ? <X /> : <Menu />}
						</Button>
					</div>
				</div>

				<AnimatePresence initial={false}>
					{menuOpen && (
						<motion.div
							key="mobile-menu"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
							className="overflow-hidden md:hidden"
						>
							<div className="flex flex-col gap-1 border-t px-3 pt-3 pb-4">
								{siteConfig.mainNav.map((item, index) => (
									<motion.div
										key={item.href}
										initial={{ opacity: 0, x: -12 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.05 * index + 0.05 }}
									>
										<Link
											href={item.href}
											className={cn(
												"flex rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
												isActive(pathname, item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60",
											)}
										>
											{item.title}
										</Link>
									</motion.div>
								))}
								<SignedIn>
									{isAdmin && (
										<Button
											asChild
											variant="outline"
											className="mt-2 rounded-xl"
										>
											<Link href="/create-problem">
												<Plus /> New problem
											</Link>
										</Button>
									)}
								</SignedIn>
								<SignedOut>
									<div className="mt-2 grid grid-cols-2 gap-2">
										<Button
											asChild
											variant="outline"
											className="rounded-xl"
										>
											<Link href="/sign-in">Sign in</Link>
										</Button>
										<Button
											asChild
											className="rounded-xl"
										>
											<Link href="/sign-up">Get started</Link>
										</Button>
									</div>
								</SignedOut>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.nav>
		</header>
	);
}
