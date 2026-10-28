import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Accent } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

export function CallToAction({ isSignedIn }: { isSignedIn: boolean }) {
	return (
		<section className="px-4 py-16 sm:px-6">
			<Reveal className="mx-auto max-w-6xl">
				<div className="beam-border rounded-[2rem]">
					<div className="relative overflow-hidden rounded-[2rem] bg-card px-6 py-16 text-center sm:px-12 sm:py-24">
						<div
							aria-hidden
							className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent)]"
						/>
						<div
							aria-hidden
							className="absolute -bottom-1/2 left-1/2 h-[120%] w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-2xl"
						/>
						<div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
							<h2 className="text-4xl font-semibold tracking-tighter text-balance sm:text-5xl md:text-6xl">
								Your next breakthrough is <Accent>one submission</Accent> away
							</h2>
							<p className="max-w-lg text-pretty text-muted-foreground sm:text-lg">
								Open a problem, write a few lines, hit run. Momentum starts the moment you do.
							</p>
							<div className="mt-2 flex flex-col gap-3 sm:flex-row">
								<Button
									asChild
									size="lg"
									className="group h-12 rounded-full px-7 text-[15px] font-semibold shadow-lg shadow-primary/25"
								>
									<Link href={isSignedIn ? "/problems" : "/sign-up"}>
										{isSignedIn ? "Pick a problem" : "Create your free account"}
										<ArrowRight className="transition-transform group-hover:translate-x-1" />
									</Link>
								</Button>
								<Button
									asChild
									size="lg"
									variant="outline"
									className="h-12 rounded-full bg-background/60 px-7 text-[15px]"
								>
									<Link href="/problems">Browse the problem set</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Reveal>
		</section>
	);
}
