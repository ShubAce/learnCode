import { SubmissionHistory } from "@/modules/problems/components/submission-history";
import { getCurrentUserData } from "@/modules/profile/actions";
import PlaylistsSection from "@/modules/profile/components/playlist-section";
import ProfileStats from "@/modules/profile/components/profile-stats";
import SolvedProblems from "@/modules/profile/components/solved-problems";
import UserInfoCard from "@/modules/profile/components/user-info-card";
import React from "react";

const ProfilePage = async () => {
	const profileData = await getCurrentUserData();

	if (!profileData || "error" in profileData) {
		return (
			<div className="h-full py-32">
				<div className="container mx-auto px-4 max-w-7xl">
					<div className="text-center">
						<h1 className="text-2xl font-bold">Failed to load profile</h1>
						<p className="text-muted-foreground">Please try again later.</p>
					</div>
				</div>
			</div>
		);
	}

	// Check if it's a guest user
	const isGuest = profileData.clerkID === "guest";

	return (
		<div className="h-full py-32">
			<div className="container mx-auto px-4 max-w-7xl">
				{isGuest && (
					<div className="mb-8 p-4 bg-muted rounded-lg border border-border">
						<p className="text-center text-sm text-muted-foreground">
							You are viewing as a guest.
							<a
								href="/sign-in"
								className="text-primary hover:underline ml-1"
							>
								Sign in
							</a>{" "}
							to access your profile and track your progress.
						</p>
					</div>
				)}
				<UserInfoCard userData={profileData} />
				<ProfileStats
					submissions={profileData.submissions}
					solvedCount={profileData.solvedProblems.length}
					playlistCount={profileData.playlists.length}
				/>
				<SubmissionHistory submissions={profileData.submissions} />

				<div className="grid gap-8 mt-10">
					<SolvedProblems solvedProblems={profileData.solvedProblems} />
					<PlaylistsSection playlists={profileData.playlists} />
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
