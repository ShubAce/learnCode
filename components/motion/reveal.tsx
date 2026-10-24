"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	y?: number;
	/** Animate every time the element enters the viewport instead of once */
	repeat?: boolean;
};

/** Fades, lifts and un-blurs its children as they scroll into view. */
export function Reveal({ children, className, delay = 0, y = 24, repeat = false }: RevealProps) {
	const reduceMotion = useReducedMotion();

	return (
		<motion.div
			className={className}
			initial={reduceMotion ? false : { opacity: 0, y, filter: "blur(8px)" }}
			whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
			viewport={{ once: !repeat, margin: "-80px" }}
			transition={{ duration: 0.75, delay, ease: EASE }}
		>
			{children}
		</motion.div>
	);
}

const groupVariants: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
	show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

/** Staggers the entrance of its <StaggerItem> children. */
export function StaggerGroup({ children, className, immediate = false }: { children: React.ReactNode; className?: string; immediate?: boolean }) {
	const reduceMotion = useReducedMotion();

	return (
		<motion.div
			className={className}
			variants={groupVariants}
			initial={reduceMotion ? false : "hidden"}
			{...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-60px" } })}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<motion.div
			className={cn(className)}
			variants={itemVariants}
		>
			{children}
		</motion.div>
	);
}
