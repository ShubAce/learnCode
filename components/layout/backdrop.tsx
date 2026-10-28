import { cn } from "@/lib/utils";

/** Ambient page background: engineering grid, drifting aurora glow and film grain. */
export function Backdrop({ className }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
		>
			<div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent_78%)]" />
			<div className="absolute -top-[38%] left-1/2 h-[75vh] w-[120vw] -translate-x-1/2 animate-aurora rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-3xl will-change-transform" />
			<div className="absolute -top-[12%] -right-[12%] h-[48vh] w-[48vw] animate-aurora rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--brand-2)_20%,transparent),transparent)] blur-3xl [animation-delay:-9s] will-change-transform" />
			<div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay dark:opacity-[0.07]" />
		</div>
	);
}
