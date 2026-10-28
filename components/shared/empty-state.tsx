import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
	icon: LucideIcon;
	title: string;
	description?: React.ReactNode;
	action?: React.ReactNode;
	className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
	return (
		<div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}>
			<div className="relative mb-1">
				<div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
				<div className="relative grid size-14 place-items-center rounded-2xl border bg-card shadow-sm">
					<Icon className="size-6 text-primary" />
				</div>
			</div>
			<h3 className="text-base font-semibold">{title}</h3>
			{description && <p className="max-w-sm text-sm text-pretty text-muted-foreground">{description}</p>}
			{action && <div className="mt-2">{action}</div>}
		</div>
	);
}
