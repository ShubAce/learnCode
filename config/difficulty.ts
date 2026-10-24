export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

type DifficultyMeta = {
	label: string;
	level: string;
	blurb: string;
	/** Tailwind classes built on the --easy / --medium / --hard design tokens */
	classes: {
		text: string;
		soft: string;
		border: string;
		solid: string;
		glow: string;
	};
};

export const DIFFICULTY_META: Record<Difficulty, DifficultyMeta> = {
	EASY: {
		label: "Easy",
		level: "Warm up",
		blurb: "Core syntax, arrays and strings. Build fluency and confidence.",
		classes: {
			text: "text-easy",
			soft: "bg-easy/10",
			border: "border-easy/25",
			solid: "bg-easy",
			glow: "from-easy/25",
		},
	},
	MEDIUM: {
		label: "Medium",
		level: "Level up",
		blurb: "Classic data structures and patterns that show up in real interviews.",
		classes: {
			text: "text-medium",
			soft: "bg-medium/10",
			border: "border-medium/25",
			solid: "bg-medium",
			glow: "from-medium/25",
		},
	},
	HARD: {
		label: "Hard",
		level: "Go deep",
		blurb: "Advanced algorithms and optimisation for when you want a real fight.",
		classes: {
			text: "text-hard",
			soft: "bg-hard/10",
			border: "border-hard/25",
			solid: "bg-hard",
			glow: "from-hard/25",
		},
	},
};

export function isDifficulty(value: unknown): value is Difficulty {
	return typeof value === "string" && (DIFFICULTIES as readonly string[]).includes(value);
}
