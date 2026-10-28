import { cn } from "@/lib/utils";

type CardProps = {
	title: string;
	description?: React.ReactNode;
	action?: React.ReactNode;
	className?: string;
	children: React.ReactNode;
};

/** Consistent titled surface for profile sections. */
export function Card({ title, description, action, className, children }: CardProps) {
	return (
		<section className={cn("flex flex-col gap-5 rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6", className)}>
			<header className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-0.5">
					<h2 className="font-semibold tracking-tight">{title}</h2>
					{description && <p className="text-sm text-muted-foreground">{description}</p>}
				</div>
				{action}
			</header>
			{children}
		</section>
	);
}
