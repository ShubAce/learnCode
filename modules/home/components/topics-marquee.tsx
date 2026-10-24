import { Hash } from "lucide-react";
import { Marquee } from "@/components/motion/marquee";
import { TOPICS } from "@/config/topics";

function TopicChip({ label }: { label: string }) {
	return (
		<span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm whitespace-nowrap text-foreground/80 shadow-sm backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground">
			<Hash className="size-3.5 text-primary" />
			{label}
		</span>
	);
}

export function TopicsMarquee() {
	const half = Math.ceil(TOPICS.length / 2);

	return (
		<section className="py-14">
			<p className="px-4 text-center font-mono text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
				Drill every pattern that shows up in real interviews
			</p>
			<div className="mt-8 flex flex-col gap-3">
				<Marquee duration="60s">
					{TOPICS.slice(0, half).map((topic) => (
						<TopicChip
							key={topic.id}
							label={topic.label}
						/>
					))}
				</Marquee>
				<Marquee
					reverse
					duration="65s"
				>
					{TOPICS.slice(half).map((topic) => (
						<TopicChip
							key={topic.id}
							label={topic.label}
						/>
					))}
				</Marquee>
			</div>
		</section>
	);
}
