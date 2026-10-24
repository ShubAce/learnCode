"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Segment = { value: number; className: string };

type ProgressRingProps = {
	/** Ring segments, as fractions of `total`, drawn in order */
	segments: Segment[];
	total: number;
	size?: number;
	strokeWidth?: number;
	className?: string;
	children?: React.ReactNode;
};

/** Multi-segment donut that animates its strokes in. */
export function ProgressRing({ segments, total, size = 160, strokeWidth = 10, className, children }: ProgressRingProps) {
	const reduceMotion = useReducedMotion();
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const gap = segments.filter((s) => s.value > 0).length > 1 ? 6 : 0;
	let offset = 0;

	return (
		<div
			className={cn("relative grid place-items-center", className)}
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="-rotate-90"
				aria-hidden
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					className="stroke-muted"
				/>
				{total > 0 &&
					segments.map((segment, index) => {
						const length = Math.max(0, (segment.value / total) * circumference - gap);
						const dashOffset = -offset;
						offset += (segment.value / total) * circumference;
						if (segment.value <= 0) return null;
						return (
							<motion.circle
								key={index}
								cx={size / 2}
								cy={size / 2}
								r={radius}
								fill="none"
								strokeWidth={strokeWidth}
								strokeLinecap="round"
								className={segment.className}
								strokeDashoffset={dashOffset}
								initial={reduceMotion ? false : { strokeDasharray: `0 ${circumference}` }}
								whileInView={{ strokeDasharray: `${length} ${circumference}` }}
								viewport={{ once: true }}
								transition={{ duration: 1.2, delay: 0.15 * index, ease: [0.22, 1, 0.36, 1] }}
								style={reduceMotion ? { strokeDasharray: `${length} ${circumference}` } : undefined}
							/>
						);
					})}
			</svg>
			<div className="absolute inset-0 grid place-items-center text-center">{children}</div>
		</div>
	);
}
