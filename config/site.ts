export type NavItem = {
	title: string;
	href: string;
	external?: boolean;
};

export type NavSection = {
	title: string;
	items: NavItem[];
};

const links = {
	github: "https://github.com/ShubAce/learnCode",
	author: "https://github.com/ShubAce",
};

const mainNav: NavItem[] = [
	{ title: "Problems", href: "/problems" },
	{ title: "Profile", href: "/profile" },
	{ title: "About", href: "/about" },
];

const footerNav: NavSection[] = [
	{
		title: "Platform",
		items: [
			{ title: "Problem set", href: "/problems" },
			{ title: "Your profile", href: "/profile" },
			{ title: "About", href: "/about" },
		],
	},
	{
		title: "Account",
		items: [
			{ title: "Sign in", href: "/sign-in" },
			{ title: "Create account", href: "/sign-up" },
		],
	},
	{
		title: "Project",
		items: [
			{ title: "Source code", href: links.github, external: true },
			{ title: "Report an issue", href: `${links.github}/issues`, external: true },
		],
	},
];

export const siteConfig = {
	name: "LearnCode",
	tagline: "Master problem solving, one line at a time.",
	description:
		"Practice curated algorithm problems in JavaScript, Python, Java and C++, get instant verdicts from a real judge, track your progress and learn with an AI tutor that reads your code.",
	url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
	keywords: ["coding practice", "algorithms", "data structures", "interview preparation", "leetcode clone", "competitive programming"],
	author: { name: "ShubAce", url: links.author },
	links,
	mainNav,
	footerNav,
};

export type SiteConfig = typeof siteConfig;
