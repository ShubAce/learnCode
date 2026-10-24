import { getDbUser } from "@/modules/auth/server";
import { CallToAction } from "@/modules/home/components/call-to-action";
import { DifficultyTracks } from "@/modules/home/components/difficulty-tracks";
import { Features } from "@/modules/home/components/features";
import { Hero } from "@/modules/home/components/hero";
import { HowItWorks } from "@/modules/home/components/how-it-works";
import { TopicsMarquee } from "@/modules/home/components/topics-marquee";
import { getPlatformStats, getSolvedByDifficulty } from "@/modules/home/data";

export default async function HomePage() {
	const [stats, user] = await Promise.all([getPlatformStats(), getDbUser()]);
	const solved = user ? await getSolvedByDifficulty(user.id) : null;

	return (
		<>
			<Hero
				stats={stats}
				isSignedIn={Boolean(user)}
			/>
			<TopicsMarquee />
			<Features />
			<DifficultyTracks
				stats={stats}
				solved={solved}
			/>
			<HowItWorks />
			<CallToAction isSignedIn={Boolean(user)} />
		</>
	);
}
