import { Code2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { getLanguageLabel, isLanguageId, LANGUAGES } from "@/config/languages";
import { Card } from "./card";

export function LanguageBreakdown({ languages }: { languages: { language: string; count: number }[] }) {
	const total = languages.reduce((sum, item) => sum + item.count, 0);

	return (
		<Card
			title="Languages"
			description="Share of your submissions"
		>
			{languages.length === 0 ? (
				<EmptyState
					icon={Code2}
					title="No submissions yet"
					className="py-4"
				/>
			) : (
				<div className="flex flex-col gap-4">
					<div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
						{languages.map(({ language, count }) => (
							<div
								key={language}
								className="h-full first:rounded-l-full last:rounded-r-full"
								style={{ width: `${(count / total) * 100}%`, backgroundColor: isLanguageId(language) ? LANGUAGES[language].color : "var(--muted-foreground)" }}
							/>
						))}
					</div>
					<ul className="flex flex-col gap-2.5">
						{languages.map(({ language, count }) => (
							<li
								key={language}
								className="flex items-center gap-2.5 text-sm"
							>
								<span
									className="size-2.5 rounded-full"
									style={{ backgroundColor: isLanguageId(language) ? LANGUAGES[language].color : "var(--muted-foreground)" }}
								/>
								{getLanguageLabel(language)}
								<span className="ml-auto font-mono text-xs text-muted-foreground">
									{count} · {Math.round((count / total) * 100)}%
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</Card>
	);
}
