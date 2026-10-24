import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { syncDbUser } from "@/modules/auth/server";
import { ActivityHeatmap } from "@/modules/profile/components/activity-heatmap";
import { DifficultyBreakdown } from "@/modules/profile/components/difficulty-breakdown";
import { LanguageBreakdown } from "@/modules/profile/components/language-breakdown";
import { PlaylistGrid } from "@/modules/profile/components/playlist-grid";
import { ProfileHero } from "@/modules/profile/components/profile-hero";
import { RecentSubmissions } from "@/modules/profile/components/recent-submissions";
import { SolvedProblems } from "@/modules/profile/components/solved-problems";
import { StatTiles } from "@/modules/profile/components/stat-tiles";
import { getProfileData } from "@/modules/profile/data";

export const metadata: Metadata = {
	title: "Your profile",
	description: "Track your solved problems, submissions, streaks and playlists.",
};

export default async function ProfilePage() {
	// Refresh name and avatar from Clerk on every visit to the profile
	const user = await syncDbUser();
	if (!user) redirect("/sign-in");

	const profile = await getProfileData(user.id);

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-28 pb-8 sm:px-6">
			<Reveal>
				<ProfileHero user={profile.user} />
			</Reveal>
			<StatTiles stats={profile.stats} />

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
				<div className="flex flex-col gap-6">
					<Reveal>
						<DifficultyBreakdown
							solved={profile.solvedByDifficulty}
							totals={profile.totalsByDifficulty}
						/>
					</Reveal>
					<Reveal delay={0.05}>
						<LanguageBreakdown languages={profile.languages} />
					</Reveal>
				</div>
				<div className="flex min-w-0 flex-col gap-6">
					<Reveal>
						<ActivityHeatmap
							days={profile.heatmap}
							activeDays={profile.stats.activeDays}
						/>
					</Reveal>
					<Reveal delay={0.05}>
						<RecentSubmissions submissions={profile.recentSubmissions} />
					</Reveal>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Reveal>
					<SolvedProblems solved={profile.solvedProblems} />
				</Reveal>
				<Reveal delay={0.05}>
					<PlaylistGrid playlists={profile.playlists} />
				</Reveal>
			</div>
		</div>
	);
}
