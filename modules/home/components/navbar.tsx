"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu, X } from "lucide-react";

const Navbar = ({ userRole }: { userRole: string }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isAdmin = userRole === "ADMIN";

	return (
		<nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
			<div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:bg-white/15 dark:hover:bg-black/15">
				<div className="px-4 sm:px-6 py-4 flex justify-between items-center">
					{/* Logo */}
					<Link
						href={"/"}
						className="flex items-center gap-2"
					>
						<Image
							src={"/logo.svg"}
							alt="LearnCode"
							width={36}
							height={36}
							className="sm:w-[42px] sm:h-[42px]"
						/>
						<span className="font-bold text-xl sm:text-2xl tracking-widest text-amber-300">LearnCode</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex flex-row items-center justify-center gap-x-4">
						<Link
							href="/problems"
							className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400 transition-colors"
						>
							Problems
						</Link>
						<Link
							href="/about"
							className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400 transition-colors"
						>
							About
						</Link>
						<Link
							href="/profile"
							className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400 transition-colors"
						>
							Profile
						</Link>
					</div>

					{/* Desktop User Controls */}
					<div className="hidden md:flex items-center gap-4">
						<ModeToggle />
						<SignedIn>
							{isAdmin && (
								<Link href="/create-problem">
									<Button
										variant="outline"
										size="default"
									>
										Create Problem
									</Button>
								</Link>
							)}
							<UserButton />
						</SignedIn>

						<SignedOut>
							<div className="flex items-center gap-2">
								<SignInButton>
									<Button
										variant="ghost"
										size="sm"
										className="text-sm font-medium hover:bg-white/20 dark:hover:bg-white/10"
									>
										Sign In
									</Button>
								</SignInButton>
								<SignUpButton>
									<Button
										size="sm"
										className="text-sm font-medium bg-amber-400 hover:bg-amber-500 text-white"
									>
										Sign Up
									</Button>
								</SignUpButton>
							</div>
						</SignedOut>
					</div>

					{/* Mobile Controls */}
					<div className="flex md:hidden items-center gap-2">
						<ModeToggle />
						<SignedIn>
							<UserButton />
						</SignedIn>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="hover:bg-white/20 dark:hover:bg-white/10"
						>
							{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden border-t border-white/10 animate-in slide-in-from-top">
						<div className="px-4 py-4 space-y-3">
							<Link
								href="/problems"
								className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 py-2 transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								Problems
							</Link>
							<Link
								href="/about"
								className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 py-2 transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								About
							</Link>
							<Link
								href="/profile"
								className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 py-2 transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								Profile
							</Link>

							<SignedIn>
								{isAdmin && (
									<Link
										href="/create-problem"
										onClick={() => setIsMenuOpen(false)}
									>
										<Button
											variant="outline"
											size="default"
											className="w-full"
										>
											Create Problem
										</Button>
									</Link>
								)}
							</SignedIn>

							<SignedOut>
								<div className="flex flex-col gap-2 pt-2">
									<SignInButton>
										<Button
											variant="ghost"
											size="sm"
											className="w-full text-sm font-medium hover:bg-white/20 dark:hover:bg-white/10"
										>
											Sign In
										</Button>
									</SignInButton>
									<SignUpButton>
										<Button
											size="sm"
											className="w-full text-sm font-medium bg-amber-400 hover:bg-amber-500 text-white"
										>
											Sign Up
										</Button>
									</SignUpButton>
								</div>
							</SignedOut>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
