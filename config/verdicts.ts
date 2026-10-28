export const VERDICTS = [
	"Accepted",
	"Wrong Answer",
	"Compilation Error",
	"Runtime Error",
	"Time Limit Exceeded",
	"Memory Limit Exceeded",
	"Internal Error",
] as const;

export type Verdict = (typeof VERDICTS)[number];

type VerdictMeta = {
	short: string;
	tone: "success" | "danger" | "warning";
	/** Tailwind classes built on design tokens */
	text: string;
	soft: string;
	border: string;
};

const TONES = {
	success: { text: "text-success", soft: "bg-success/10", border: "border-success/25" },
	danger: { text: "text-destructive", soft: "bg-destructive/10", border: "border-destructive/25" },
	warning: { text: "text-warning", soft: "bg-warning/10", border: "border-warning/25" },
} as const;

const make = (short: string, tone: VerdictMeta["tone"]): VerdictMeta => ({ short, tone, ...TONES[tone] });

export const VERDICT_META: Record<Verdict, VerdictMeta> = {
	Accepted: make("AC", "success"),
	"Wrong Answer": make("WA", "danger"),
	"Compilation Error": make("CE", "warning"),
	"Runtime Error": make("RE", "danger"),
	"Time Limit Exceeded": make("TLE", "warning"),
	"Memory Limit Exceeded": make("MLE", "warning"),
	"Internal Error": make("IE", "warning"),
};

/** Submissions stored before verdicts existed may carry arbitrary status strings. */
export function getVerdictMeta(status: string): VerdictMeta {
	return VERDICT_META[status as Verdict] ?? make(status.slice(0, 3).toUpperCase(), "warning");
}
