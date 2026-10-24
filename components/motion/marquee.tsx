import { cn } from "@/lib/utils";

type MarqueeProps = {
	children: React.ReactNode;
	className?: string;
	reverse?: boolean;
	/** CSS duration for one full loop */
	duration?: string;
};

/** Infinite horizontal ticker that pauses on hover and fades at the edges. */
export function Marquee({ children, className, reverse = false, duration = "45s" }: MarqueeProps) {
	return (
		<div
			className={cn(
				"group flex gap-(--marquee-gap) overflow-hidden [--marquee-gap:0.75rem] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
				className,
			)}
			style={{ "--marquee-duration": duration } as React.CSSProperties}
		>
			{[0, 1].map((copy) => (
				<div
					key={copy}
					aria-hidden={copy === 1}
					className={cn(
						"flex shrink-0 animate-marquee items-center gap-(--marquee-gap) group-hover:[animation-play-state:paused]",
						reverse && "[animation-direction:reverse]",
					)}
				>
					{children}
				</div>
			))}
		</div>
	);
}
