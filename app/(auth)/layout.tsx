import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/config/site";
import { AuthShowcase } from "@/modules/auth/components/auth-showcase";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
			<aside className="relative hidden flex-col overflow-hidden border-r bg-surface p-10 lg:flex">
				<div
					aria-hidden
					className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,black,transparent)]"
				/>
				<div
					aria-hidden
					className="absolute -top-40 -left-40 size-[36rem] animate-aurora rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-3xl"
				/>
				<div className="relative">
					<Logo />
				</div>
				<div className="relative flex flex-1 px-4">
					<AuthShowcase />
				</div>
				<p className="relative text-xs text-muted-foreground">
					© {new Date().getFullYear()} {siteConfig.name} · {siteConfig.tagline}
				</p>
			</aside>

			<main className="relative flex flex-col items-center justify-center px-4 py-20">
				<div
					aria-hidden
					className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)] lg:hidden"
				/>
				<div className="absolute top-4 left-4 lg:hidden">
					<Logo />
				</div>
				<div className="absolute top-4 right-4">
					<ThemeToggle />
				</div>
				{children}
			</main>
		</div>
	);
}
