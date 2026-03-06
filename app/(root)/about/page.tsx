import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Target, Rocket, Heart, Users, Trophy, Zap, Globe, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
	const mission = [
		{
			icon: <Target className="w-6 h-6" />,
			title: "Our Mission",
			description:
				"To empower developers worldwide by providing a platform that makes learning algorithms and data structures accessible, engaging, and effective.",
		},
		{
			icon: <Rocket className="w-6 h-6" />,
			title: "Our Vision",
			description:
				"To become the world's leading platform for technical interview preparation and competitive programming, helping millions achieve their career goals.",
		},
		{
			icon: <Heart className="w-6 h-6" />,
			title: "Our Values",
			description:
				"We believe in continuous learning, community support, and making quality education accessible to everyone, regardless of their background.",
		},
	];

	const features = [
		{
			icon: <Code2 className="w-5 h-5" />,
			title: "1,600+ Coding Problems",
			description: "Curated collection of problems from easy to advanced levels",
		},
		{
			icon: <Globe className="w-5 h-5" />,
			title: "Multiple Languages",
			description: "Support for JavaScript, Python, Java, C++ and more",
		},
		{
			icon: <Zap className="w-5 h-5" />,
			title: "Real-time Execution",
			description: "Test your code instantly with immediate feedback",
		},
		{
			icon: <Users className="w-5 h-5" />,
			title: "Global Community",
			description: "Learn from and compete with developers worldwide",
		},
		{
			icon: <BookOpen className="w-5 h-5" />,
			title: "Editorial Solutions",
			description: "Detailed explanations and optimal solutions for every problem",
		},
		{
			icon: <Trophy className="w-5 h-5" />,
			title: "Track Progress",
			description: "Monitor your growth with detailed analytics and achievements",
		},
	];

	const stats = [
		{ icon: <Users className="w-8 h-8" />, number: "10,000+", label: "Active Developers" },
		{ icon: <Code2 className="w-8 h-8" />, number: "1,600+", label: "Coding Problems" },
		{ icon: <Trophy className="w-8 h-8" />, number: "50K+", label: "Problems Solved" },
		{ icon: <Award className="w-8 h-8" />, number: "98%", label: "Success Rate" },
	];

	const team = [
		{
			role: "Platform Development",
			description: "Built with modern technologies including Next.js, TypeScript, and Prisma for a fast, reliable experience.",
		},
		{
			role: "Problem Curation",
			description: "Carefully selected problems covering all major algorithms and data structures topics.",
		},
		{
			role: "Community Support",
			description: "Dedicated to helping developers learn, grow, and succeed in their programming journey.",
		},
	];

	return (
		<div className="min-h-screen transition-colors mt-20">
			{/* Hero Section */}
			<section className="px-4 py-16">
				<div className="max-w-6xl mx-auto text-center">
					<Badge
						variant="secondary"
						className="mb-8 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900"
					>
						About Us
					</Badge>

					<h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6">
						Empowering Developers to{" "}
						<span className="relative inline-block">
							<span className="px-6 py-3 bg-amber-500 dark:bg-amber-400 text-white dark:text-gray-900 rounded-2xl transform inline-block shadow-lg -rotate-2">
								Excel
							</span>
						</span>
					</h1>

					<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
						LearnCode is a comprehensive platform designed to help developers master algorithms, ace technical interviews, and build
						strong problem-solving skills.
					</p>
				</div>
			</section>

			{/* Mission, Vision, Values */}
			<section className="px-4 py-16">
				<div className="max-w-6xl mx-auto">
					<div className="grid md:grid-cols-3 gap-8">
						{mission.map((item, index) => (
							<Card
								key={index}
								className="border-2 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
							>
								<CardHeader>
									<div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white mb-4">
										{item.icon}
									</div>
									<CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="px-4 py-16 bg-gradient-to-br from-amber-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">Platform Statistics</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Join thousands of developers who are improving their skills every day
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{stats.map((stat, index) => (
							<Card
								key={index}
								className="text-center border-2 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
							>
								<CardContent className="pt-8 pb-6">
									<div className="flex justify-center mb-4 text-amber-600 dark:text-amber-400">{stat.icon}</div>
									<div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{stat.number}</div>
									<div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="px-4 py-16">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-12">
						<Badge
							variant="secondary"
							className="mb-4 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
						>
							Features
						</Badge>
						<h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">What Makes Us Different</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							A comprehensive platform built for serious learners and competitive programmers
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature, index) => (
							<Card
								key={index}
								className="border hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
							>
								<CardHeader>
									<div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center text-white mb-3">
										{feature.icon}
									</div>
									<CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Team/Technology Section */}
			<section className="px-4 py-16 bg-gradient-to-br from-indigo-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">How We Build LearnCode</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Our commitment to providing the best learning experience through technology and community
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{team.map((item, index) => (
							<Card
								key={index}
								className="border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
							>
								<CardHeader>
									<CardTitle className="text-xl font-bold text-amber-600 dark:text-amber-400">{item.role}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="px-4 py-20">
				<div className="max-w-4xl mx-auto text-center">
					<Card className="border-2 border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl">
						<CardContent className="pt-12 pb-12">
							<h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6">Ready to Start Your Journey?</h2>
							<p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
								Join thousands of developers improving their skills every day. Start solving problems and achieve your programming
								goals.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/problems">
									<Button
										size="lg"
										className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
									>
										<Code2 className="w-5 h-5 mr-2" />
										Browse Problems
									</Button>
								</Link>
								<Link href="/profile">
									<Button
										size="lg"
										variant="outline"
										className="border-2 border-gray-300 dark:border-gray-600 font-bold px-8 py-6 text-lg rounded-xl hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300"
									>
										<Trophy className="w-5 h-5 mr-2" />
										View Profile
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
