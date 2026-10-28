"use client";

import { Bookmark, Check, ListChecks } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { VerdictBadge } from "@/components/shared/verdict-badge";
import { Kbd } from "@/components/ui/kbd";
import { LANGUAGE_IDS, LANGUAGES } from "@/config/languages";
import { VERDICTS } from "@/config/verdicts";
import { cn } from "@/lib/utils";

/** Cycles through the judge's verdicts, highlighting one row at a time. */
export function VerdictVisual() {
	const reduceMotion = useReducedMotion();
	const verdicts = VERDICTS.slice(0, 5);
	const [active, setActive] = useState(0);

	useEffect(() => {
		if (reduceMotion) return;
		const id = setInterval(() => setActive((i) => (i + 1) % verdicts.length), 1400);
		return () => clearInterval(id);
	}, [reduceMotion, verdicts.length]);

	return (
		<div className="flex flex-col gap-2">
			{verdicts.map((verdict, index) => (
				<motion.div
					key={verdict}
					animate={{ opacity: index === active ? 1 : 0.45, x: index === active ? 6 : 0 }}
					transition={{ duration: 0.4 }}
					className={cn(
						"flex items-center justify-between rounded-xl border bg-background/60 px-3 py-2 font-mono text-xs",
						index === active && "border-primary/30 shadow-sm",
					)}
				>
					<span className="text-muted-foreground">test_case_{index + 1}</span>
					<VerdictBadge status={verdict} />
				</motion.div>
			))}
		</div>
	);
}

export function AiVisual() {
	return (
		<div className="flex flex-col gap-2.5 text-[12.5px]">
			<div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-primary-foreground">Why does my solution time out?</div>
			<div className="flex max-w-[92%] flex-col gap-2 rounded-2xl rounded-bl-sm border bg-background/70 px-3.5 py-2.5 text-muted-foreground">
				<p>
					Your nested loop is <span className="font-mono text-foreground">O(n²)</span>. Store what you&apos;ve seen in a hash map to look up the
					complement in <span className="font-mono text-foreground">O(1)</span>:
				</p>
				<pre className="rounded-lg border bg-(--code-bg) px-2.5 py-2 font-mono text-[11.5px] leading-relaxed">
					<span className="text-(--code-keyword)">if</span> (seen.<span className="text-(--code-function)">has</span>(target - x))
					{"\n"}
					{"  "}
					<span className="text-(--code-keyword)">return</span> [seen.<span className="text-(--code-function)">get</span>(target - x), i];
				</pre>
			</div>
			<div className="flex w-fit items-center gap-1 rounded-full border bg-background/70 px-3 py-2">
				{[0, 1, 2].map((dot) => (
					<motion.span
						key={dot}
						className="size-1.5 rounded-full bg-muted-foreground"
						animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
						transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15 }}
					/>
				))}
			</div>
		</div>
	);
}

export function LanguagesVisual() {
	return (
		<div className="grid grid-cols-2 gap-2">
			{LANGUAGE_IDS.map((id, index) => (
				<motion.div
					key={id}
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ delay: index * 0.08 }}
					whileHover={{ y: -3 }}
					className="flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2.5"
				>
					<span
						className="size-2.5 rounded-full"
						style={{ backgroundColor: LANGUAGES[id].color, boxShadow: `0 0 12px ${LANGUAGES[id].color}` }}
					/>
					<span className="text-sm font-medium">{LANGUAGES[id].label}</span>
					<span className="ml-auto font-mono text-[10px] text-muted-foreground">.{LANGUAGES[id].extension}</span>
				</motion.div>
			))}
		</div>
	);
}

// Deterministic pseudo-random pattern so server and client render the same heatmap
const HEAT = Array.from({ length: 7 * 14 }, (_, i) => {
	const n = Math.sin(i * 12.9898) * 43758.5453;
	const r = n - Math.floor(n);
	return r > 0.82 ? 4 : r > 0.62 ? 3 : r > 0.42 ? 2 : r > 0.25 ? 1 : 0;
});
const HEAT_CLASS = ["bg-muted", "bg-primary/25", "bg-primary/45", "bg-primary/70", "bg-primary"];

export function ProgressVisual() {
	return (
		<div className="grid grid-flow-col grid-rows-7 gap-0.75">
			{HEAT.map((level, i) => (
				<motion.span
					key={i}
					initial={{ opacity: 0, scale: 0.4 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ delay: (i % 14) * 0.03 + Math.floor(i / 14) * 0.01 }}
					className={cn("aspect-square rounded-[3px]", HEAT_CLASS[level])}
				/>
			))}
		</div>
	);
}

const PLAYLISTS = [
	{ name: "Interview essentials", count: 24 },
	{ name: "Graph drills", count: 12 },
	{ name: "Weekend warm-ups", count: 8 },
];

export function PlaylistsVisual() {
	return (
		<div className="flex flex-col gap-2">
			{PLAYLISTS.map((playlist, index) => (
				<motion.div
					key={playlist.name}
					initial={{ opacity: 0, x: -16 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ delay: index * 0.12, type: "spring", stiffness: 220, damping: 22 }}
					whileHover={{ x: 4 }}
					className="flex items-center gap-3 rounded-xl border bg-background/60 px-3 py-2.5"
				>
					<span className="grid size-7 place-items-center rounded-lg bg-primary/15 text-primary">
						{index === 0 ? <ListChecks className="size-4" /> : <Bookmark className="size-4" />}
					</span>
					<span className="text-sm font-medium">{playlist.name}</span>
					<span className="ml-auto font-mono text-[11px] text-muted-foreground">{playlist.count} problems</span>
				</motion.div>
			))}
		</div>
	);
}

const SHORTCUTS = [
	{ keys: ["Ctrl", "'"], label: "Run code" },
	{ keys: ["Ctrl", "Enter"], label: "Submit" },
	{ keys: ["Esc"], label: "Close panels" },
];

export function WorkspaceVisual() {
	return (
		<div className="flex flex-col gap-2">
			{SHORTCUTS.map((shortcut) => (
				<div
					key={shortcut.label}
					className="flex items-center justify-between rounded-xl border bg-background/60 px-3 py-2 text-sm"
				>
					<span className="text-muted-foreground">{shortcut.label}</span>
					<span className="flex gap-1">
						{shortcut.keys.map((key) => (
							<Kbd
								key={key}
								className="border bg-card"
							>
								{key}
							</Kbd>
						))}
					</span>
				</div>
			))}
			<div className="flex items-center gap-2 rounded-xl border border-success/25 bg-success/10 px-3 py-2 text-xs text-success">
				<Check className="size-3.5" /> Code auto-saved for every language
			</div>
		</div>
	);
}
