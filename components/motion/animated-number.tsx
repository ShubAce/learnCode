"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef } from "react";

type AnimatedNumberProps = {
	value: number;
	duration?: number;
	decimals?: number;
	suffix?: string;
	className?: string;
};

const formatter = (decimals: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });

/**
 * Counts up to `value` the first time it scrolls into view.
 * The final value is server-rendered, so it stays correct without JavaScript.
 */
export function AnimatedNumber({ value, duration = 1.6, decimals = 0, suffix = "", className }: AnimatedNumberProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true, margin: "-40px" });
	const reduceMotion = useReducedMotion();
	const format = formatter(decimals);

	useLayoutEffect(() => {
		const node = ref.current;
		if (!node || reduceMotion) return;
		if (!inView) {
			node.textContent = `${format.format(0)}${suffix}`;
			return;
		}
		const controls = animate(0, value, {
			duration,
			ease: [0.16, 1, 0.3, 1],
			onUpdate: (latest) => {
				node.textContent = `${format.format(latest)}${suffix}`;
			},
		});
		return () => controls.stop();
	}, [inView, value, duration, suffix, reduceMotion, format]);

	return (
		<span
			ref={ref}
			className={className}
		>
			{format.format(value)}
			{suffix}
		</span>
	);
}
