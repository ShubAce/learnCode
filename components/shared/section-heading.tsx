import { cn } from "@/lib/utils";

type SectionHeadingProps = {
	eyebrow?: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	align?: "left" | "center";
	className?: string;
};

/** Eyebrow + headline + supporting copy, used to open every marketing section. */
export function SectionHeading({ eyebrow, title, description, align = "center", className }: SectionHeadingProps) {
	return (
		<div className={cn("flex max-w-2xl flex-col gap-4", align === "center" && "mx-auto items-center text-center", className)}>
			{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
			<h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">{title}</h2>
			{description && <p className="text-base text-pretty text-muted-foreground sm:text-lg">{description}</p>}
		</div>
	);
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase backdrop-blur",
				className,
			)}
		>
			<span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px] shadow-primary" />
			{children}
		</span>
	);
}

/** Highlighted word in a headline — italic serif with the brand gradient. */
export function Accent({ children, className }: { children: React.ReactNode; className?: string }) {
	return <span className={cn("font-display text-gradient pr-1 italic", className)}>{children}</span>;
}
