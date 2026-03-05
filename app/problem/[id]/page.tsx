"use client";
import { useTheme } from "next-themes";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Play, Send, Code, FileText, Lightbulb, Trophy, ArrowLeft, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";

import { getJudge0LanguageId } from "@/lib/judge0";
import { toast } from "sonner";
import Link from "next/link";
import { executeProblem, getProblemById } from "@/modules/problems/actions";
import { db } from "@/lib/db";
import type { Problem } from "@/src/generated/browser";
import { SubmissionDetails } from "@/modules/problems/components/submission-details";
import { TestCaseTable } from "@/modules/problems/components/test-case-table";

const getDifficultyColor = (difficulty: string) => {
	switch (difficulty) {
		case "EASY":
			return "bg-green-100 text-green-800 border-green-200";
		case "MEDIUM":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "HARD":
			return "bg-red-100 text-red-800 border-red-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
};

const ProblemIdPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const [problem, setProblem] = useState<Problem | null>(null);
	const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
	const [code, setCode] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [submissionHistory, setSubmissionHistory] = useState([]);
	const [executionResponse, setExecutionResponse] = useState<any>(null);
	const { theme } = useTheme();

	useEffect(() => {
		const fetchProblem = async () => {
			try {
				const resolveParams = await params;
				const problemData = await getProblemById(resolveParams.id);
				if (problemData.success && problemData.data) {
					setProblem(problemData.data);
					const codeSnippets = problemData.data.codeSnippets as Record<string, string> | null;
					setCode(codeSnippets?.[selectedLanguage] || "");
				}
			} catch (error) {
				console.error("Error fetching problem:", error);
			}
		};
		fetchProblem();
	}, [params]);

	useEffect(() => {
		if (problem) {
			const codeSnippets = problem.codeSnippets as Record<string, string> | null;
			if (codeSnippets?.[selectedLanguage]) {
				setCode(codeSnippets[selectedLanguage]);
			}
		}
	}, [selectedLanguage, problem]);

	const handleRun = async () => {
		try {
			setIsRunning(true);
			const language_id = getJudge0LanguageId(selectedLanguage);
			const testCases = problem?.testCases as Array<{ input: string; output: string }> | null;
			const stdin = testCases?.map((tc: { input: string; output: string }) => tc.input) || [];
			const expected_outputs = testCases?.map((tc: { input: string; output: string }) => tc.output) || [];
			const res = await executeProblem(problem?.id || "", code, language_id, stdin, expected_outputs);

			setExecutionResponse(res);
			if (res.success) {
				toast.success("Code executed successfully");
			} else {
				toast.error(res.error || "Execution failed");
			}
		} catch (error) {
			console.error("Error executing code:", error);
			toast.error(error instanceof Error ? error.message : "An error occurred while executing the code.");
		} finally {
			setIsRunning(false);
		}
	};
	const handleSubmit = async () => {};

	if (!problem) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2
					className="animate-spin"
					size={48}
				/>
			</div>
		);
	}
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto p-6">
				{/* Header */}
				<div className="mb-6 flex items-start justify-between">
					<div>
						<div className="flex items-center gap-4 mb-4">
							<Link href="/">
								<Button
									variant="outline"
									size="icon"
								>
									<ArrowLeft className="size-4" />
								</Button>
							</Link>
							<h1 className="text-3xl font-bold">{problem?.title}</h1>
							<Badge className={cn("font-medium", getDifficultyColor(problem?.difficulty))}>{problem?.difficulty}</Badge>
						</div>
						<div className="flex flex-wrap gap-2">
							{problem?.tags.map((tag) => (
								<Badge
									key={tag}
									variant="outline"
									className="text-sm"
								>
									{tag}
								</Badge>
							))}
						</div>
					</div>
					<ModeToggle />
				</div>
				<div className="grid lg:grid-cols-2 gap-6">
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Problem Description
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									<p className="text-foreground leading-relaxed">{problem?.description}</p>

									{/* Examples */}
									<div>
										<h3 className="font-semibold text-lg mb-3">Example:</h3>
										{(() => {
											const examples = problem?.examples as Record<
												string,
												{ input: string; output: string; explanation?: string }
											> | null;
											const currentExample = examples?.[selectedLanguage];
											return (
												currentExample && (
													<div className="bg-muted p-4 rounded-lg space-y-2">
														<div>
															<span className="font-medium text-amber-400">Input: </span>
															<code className="text-sm dark:bg-zinc-900 bg-zinc-200 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
																{currentExample.input}
															</code>
														</div>
														<div>
															<span className="font-medium text-amber-400">Output: </span>
															<code className="text-sm dark:bg-zinc-900 bg-zinc-200 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
																{currentExample.output}
															</code>
														</div>
														<div>
															<span className="font-medium">Explanation: </span>
															<span className="text-sm">{currentExample?.explanation}</span>
														</div>
													</div>
												)
											);
										})()}
									</div>

									{/* Constraints */}
									<div>
										<h3 className="font-semibold text-lg mb-3">Constraints:</h3>
										<div className="bg-muted p-4 rounded-lg">
											<pre className="text-sm text-muted-foreground whitespace-pre-wrap">{problem?.constraints}</pre>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
						{/* Tabs for Submissions, Editorial, Hints */}
						<Card>
							<CardContent className="p-3">
								<Tabs
									defaultValue="submissions"
									className="w-full"
								>
									<TabsList className="grid w-full grid-cols-3">
										<TabsTrigger
											value="submissions"
											className="flex items-center gap-2"
										>
											<Trophy className="h-4 w-4" />
											Submissions
										</TabsTrigger>
										<TabsTrigger
											value="editorial"
											className="flex items-center gap-2"
										>
											<FileText className="h-4 w-4" />
											Editorial
										</TabsTrigger>
										<TabsTrigger
											value="hints"
											className="flex items-center gap-2"
										>
											<Lightbulb className="h-4 w-4" />
											Hints
										</TabsTrigger>
									</TabsList>
									<TabsContent
										value="submissions"
										className="p-6"
									>
										<div className="text-center py-8 text-muted-foreground">
											<p>Submissions will be there</p>
										</div>
									</TabsContent>
									<TabsContent
										value="editorial"
										className="p-6"
									>
										<div className="text-center py-8 text-muted-foreground">
											{problem.editorial ? problem.editorial : "Editorial not available yet."}
										</div>
									</TabsContent>
									<TabsContent
										value="hints"
										className="p-6"
									>
										<div className="text-center py-8 text-muted-foreground">
											{problem.hints ? problem.hints : "No hints available for this problem."}
										</div>
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</div>
					<div className="space-y-6 ">
						{/* Code Editor */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<Code className="h-5 w-5" />
										Code Editor
									</CardTitle>
									<Select
										value={selectedLanguage}
										onValueChange={setSelectedLanguage}
									>
										<SelectTrigger className="w-32">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
											<SelectItem value="PYTHON">Python</SelectItem>
											<SelectItem value="JAVA">Java</SelectItem>
											<SelectItem value="CPP">C++</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardHeader>
							<CardContent>
								<div className="border rounded-lg overflow-hidden">
									<Editor
										height="400px"
										language={selectedLanguage.toLowerCase() === "javascript" ? "javascript" : selectedLanguage.toLowerCase()}
										value={code}
										onChange={(value) => setCode(value || "")}
										theme={theme === "dark" ? "vs-dark" : "light"}
										options={{
											minimap: { enabled: false },
											fontSize: 16,
											lineNumbers: "on",
											roundedSelection: false,
											scrollBeyondLastLine: false,
											automaticLayout: true,
											tabSize: 2,
											wordWrap: "on",
										}}
									/>
								</div>
								<div className="flex gap-3 mt-4">
									<Button
										onClick={handleRun}
										disabled={isRunning}
										variant="outline"
										className="flex items-center gap-2"
									>
										<Play className="h-4 w-4" />
										{isRunning ? "Running..." : "Run"}
									</Button>
									<Button
										onClick={handleSubmit}
										disabled={isSubmitting}
										className="flex items-center gap-2"
									>
										<Send className="h-4 w-4" />
										{isSubmitting ? "Submitting..." : "Submit"}
									</Button>
								</div>
							</CardContent>
						</Card>
						{/* Test Cases */}
						<Card>
							<CardHeader>
								<CardTitle>Test Cases</CardTitle>
								<CardDescription>Run your code against these test cases</CardDescription>
							</CardHeader>
							<CardContent>
								<ScrollArea className="h-48">
									<div className="space-y-4">
										{(() => {
											const testCases = problem.testCases as Array<{ input: string; output: string }> | null;
											return testCases?.map((testCase, index: number) => (
												<div
													key={index}
													className="border rounded-lg p-3"
												>
													<div className="text-sm font-medium mb-2">Test Case {index + 1}</div>
													<div className="space-y-1 text-sm">
														<div>
															<span className="text-muted-foreground">Input: </span>
															<code className="bg-muted px-2 py-1 rounded text-xs">{testCase.input}</code>
														</div>
														<div>
															<span className="text-muted-foreground">Expected: </span>
															<code className="bg-muted px-2 py-1 rounded text-xs">{testCase.output}</code>
														</div>
													</div>
												</div>
											));
										})()}
									</div>
								</ScrollArea>
							</CardContent>
						</Card>
						{/* Test Results and Submission Details */}
						{executionResponse && executionResponse.submission && (
							<div className="space-y-4 mt-4">
								<SubmissionDetails submission={executionResponse.submission} />
								<TestCaseTable testCases={executionResponse.submission.testCases} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProblemIdPage;
