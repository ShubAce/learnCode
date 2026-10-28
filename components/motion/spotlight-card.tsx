"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** A card with a soft spotlight that follows the pointer. */
export function SpotlightCard({ className, children, ...props }: React.ComponentProps<"div">) {
	const ref = useRef<HTMLDivElement>(null);

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		const node = ref.current;
		if (!node) return;
		const rect = node.getBoundingClientRect();
		node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
		node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
	};

	return (
		<div
			ref={ref}
			onPointerMove={handlePointerMove}
			className={cn(
				"group/spot relative overflow-hidden rounded-2xl border bg-card/80 shadow-sm backdrop-blur-sm transition-[border-color,box-shadow] duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
				className,
			)}
			{...props}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
				style={{
					background:
						"radial-gradient(440px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklch, var(--primary) 13%, transparent), transparent 62%)",
				}}
			/>
			<div className="relative z-10 h-full">{children}</div>
		</div>
	);
}
