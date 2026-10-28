import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
	variable: "--font-instrument-serif",
	subsets: ["latin"],
	weight: "400",
	style: ["normal", "italic"],
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: `${siteConfig.name} — ${siteConfig.tagline}`,
		template: `%s · ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	authors: [siteConfig.author],
	creator: siteConfig.author.name,
	openGraph: {
		type: "website",
		url: siteConfig.url,
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
		{ media: "(prefers-color-scheme: dark)", color: "#0f0e0d" },
	],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<ClerkProvider
			appearance={{
				theme: shadcn,
				variables: { borderRadius: "0.75rem", fontFamily: "var(--font-geist-sans)" },
				elements: {
					cardBox: "shadow-2xl shadow-black/10 border rounded-2xl",
					formButtonPrimary: "font-semibold",
				},
			}}
		>
			<html
				lang="en"
				suppressHydrationWarning
			>
				<body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<TooltipProvider delayDuration={200}>
							{children}
							<Toaster
								position="top-center"
								closeButton
							/>
						</TooltipProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
