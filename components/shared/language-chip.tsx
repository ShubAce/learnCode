import { isLanguageId, LANGUAGES } from "@/config/languages";
import { cn } from "@/lib/utils";

/** Small colour-coded language tag, e.g. on submissions. */
export function LanguageChip({ language, className }: { language: string; className?: string }) {
	const config = isLanguageId(language) ? LANGUAGES[language] : null;

	return (
		<span className={cn("inline-flex items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-[11px] font-medium", className)}>
			<span
				className="size-2 rounded-full"
				style={{ backgroundColor: config?.color ?? "currentColor" }}
			/>
			{config?.label ?? language}
		</span>
	);
}
