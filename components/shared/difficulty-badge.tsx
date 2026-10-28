import { DIFFICULTY_META, type Difficulty } from "@/config/difficulty";
import { cn } from "@/lib/utils";

export function DifficultyBadge({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
	const meta = DIFFICULTY_META[difficulty];

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
				meta.classes.text,
				meta.classes.soft,
				meta.classes.border,
				className,
			)}
		>
			<span className={cn("size-1.5 rounded-full", meta.classes.solid)} />
			{meta.label}
		</span>
	);
}

/** Plain coloured label, for dense tables. */
export function DifficultyText({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
	const meta = DIFFICULTY_META[difficulty];
	return <span className={cn("text-sm font-medium", meta.classes.text, className)}>{meta.label}</span>;
}
