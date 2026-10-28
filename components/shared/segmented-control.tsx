"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: React.ReactNode };

type SegmentedControlProps<T extends string> = {
	value: T;
	onChange: (value: T) => void;
	options: Option<T>[];
	/** Unique per control on a page so the sliding indicator animates correctly */
	layoutId: string;
	className?: string;
	size?: "sm" | "default";
};

/** Pill-style radio group with a spring-animated active indicator. */
export function SegmentedControl<T extends string>({ value, onChange, options, layoutId, className, size = "default" }: SegmentedControlProps<T>) {
	return (
		<div
			role="radiogroup"
			className={cn("inline-flex items-center gap-0.5 rounded-xl border bg-muted/60 p-1", className)}
		>
			{options.map((option) => {
				const active = option.value === value;
				return (
					<button
						key={option.value}
						type="button"
						role="radio"
						aria-checked={active}
						onClick={() => onChange(option.value)}
						className={cn(
							"relative rounded-lg font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
							size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
							active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
						)}
					>
						{active && (
							<motion.span
								layoutId={layoutId}
								className="absolute inset-0 rounded-lg border bg-card shadow-sm"
								transition={{ type: "spring", stiffness: 420, damping: 34 }}
							/>
						)}
						<span className="relative inline-flex items-center gap-1.5">{option.label}</span>
					</button>
				);
			})}
		</div>
	);
}
