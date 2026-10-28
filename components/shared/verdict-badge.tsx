import { CheckCircle2, CircleAlert, Clock3, XCircle } from "lucide-react";
import { getVerdictMeta } from "@/config/verdicts";
import { cn } from "@/lib/utils";

const ICONS = { success: CheckCircle2, danger: XCircle, warning: CircleAlert };

export function VerdictBadge({ status, className, showIcon = true }: { status: string; className?: string; showIcon?: boolean }) {
	const meta = getVerdictMeta(status);
	const Icon = status === "Time Limit Exceeded" ? Clock3 : ICONS[meta.tone];

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
				meta.text,
				meta.soft,
				meta.border,
				className,
			)}
		>
			{showIcon && <Icon className="size-3.5" />}
			{status}
		</span>
	);
}
