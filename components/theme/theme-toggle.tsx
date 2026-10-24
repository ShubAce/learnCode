"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Theme switch with a circular reveal powered by the View Transitions API.
 * Icons swap purely with `dark:` classes, so there is no hydration flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();

	const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
		const next = resolvedTheme === "dark" ? "light" : "dark";
		const apply = () => {
			document.documentElement.classList.toggle("dark", next === "dark");
			setTheme(next);
		};

		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!document.startViewTransition || reduceMotion) {
			apply();
			return;
		}

		const { clientX: x, clientY: y } = event;
		const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
		const transition = document.startViewTransition(() => flushSync(apply));
		transition.ready
			.then(() => {
				document.documentElement.animate(
					{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
					{ duration: 600, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
				);
			})
			.catch(() => {});
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggle}
			aria-label="Toggle colour theme"
			className={cn("relative rounded-full", className)}
		>
			<Sun className="size-[18px] rotate-0 scale-100 transition-transform duration-500 dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute size-[18px] rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100" />
		</Button>
	);
}
