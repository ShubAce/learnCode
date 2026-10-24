import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		// Clerk-hosted avatars
		remotePatterns: [
			{ protocol: "https", hostname: "img.clerk.com" },
			{ protocol: "https", hostname: "images.clerk.dev" },
		],
	},
};

export default nextConfig;
