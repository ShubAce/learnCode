export const TECH_STACK = [
	{ name: "Next.js 16", role: "App Router, server actions & streaming", url: "https://nextjs.org" },
	{ name: "React 19", role: "Server and client components", url: "https://react.dev" },
	{ name: "TypeScript", role: "End-to-end type safety", url: "https://www.typescriptlang.org" },
	{ name: "Tailwind CSS 4", role: "Design tokens & utility styling", url: "https://tailwindcss.com" },
	{ name: "Prisma + PostgreSQL", role: "Type-safe data layer", url: "https://www.prisma.io" },
	{ name: "Clerk", role: "Authentication & user management", url: "https://clerk.com" },
	{ name: "Gemini via AI SDK", role: "Streaming AI tutor", url: "https://ai-sdk.dev" },
	{ name: "Monaco Editor", role: "The editor that powers VS Code", url: "https://microsoft.github.io/monaco-editor" },
	{ name: "Motion", role: "Fluid, accessible animation", url: "https://motion.dev" },
] as const;

/** Display copy for the pluggable code execution backends (see lib/execution). */
export const EXECUTION_PROVIDERS = [
	{ id: "wandbox", name: "Wandbox", note: "Free & key-less — the default" },
	{ id: "judge0", name: "Judge0", note: "RapidAPI or self-hosted" },
	{ id: "piston", name: "Piston", note: "Self-hosted with Docker" },
] as const;
