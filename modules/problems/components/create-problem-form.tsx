"use client";

import { Editor } from "@monaco-editor/react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Code2, FileText, Lightbulb, BookOpen, CheckCircle2, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
	dpProblems,
	stringProblems,
	arrayProblems,
	graphProblems,
	treeProblems,
	linkedListProblems,
	binarySearchProblems,
	stackProblems,
	backtrackingProblems,
	greedyProblems,
	slidingWindowProblems,
	twoPointersProblems,
	bitManipulationProblems,
	heapProblems,
	sortingProblems,
} from "../data/sampleProblems";

const problemSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
	tags: z.array(z.object({ value: z.string().min(1, "Tag is required") })).min(1, "At least one tag is required"),
	constraints: z.string().min(1, "Constraints are required"),
	hints: z.string().optional(),
	editorial: z.string().optional(),
	testCases: z
		.array(
			z.object({
				input: z.string().min(1, "Input is required"),
				output: z.string().min(1, "Output is required"),
			}),
		)
		.min(1, "At least one test case is required"),
	examples: z.object({
		JAVASCRIPT: z.object({
			input: z.string().min(1, "Input is required"),
			output: z.string().min(1, "Output is required"),
			explanation: z.string().optional(),
		}),
		PYTHON: z.object({
			input: z.string().min(1, "Input is required"),
			output: z.string().min(1, "Output is required"),
			explanation: z.string().optional(),
		}),
		JAVA: z.object({
			input: z.string().min(1, "Input is required"),
			output: z.string().min(1, "Output is required"),
			explanation: z.string().optional(),
		}),
		CPP: z.object({
			input: z.string().min(1, "Input is required"),
			output: z.string().min(1, "Output is required"),
			explanation: z.string().optional(),
		}),
	}),
	codeSnippets: z.object({
		JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
		PYTHON: z.string().min(1, "Python code snippet is required"),
		JAVA: z.string().min(1, "Java code snippet is required"),
		CPP: z.string().min(1, "C++ code snippet is required"),
	}),
	referenceSolutions: z.object({
		JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
		PYTHON: z.string().min(1, "Python solution is required"),
		JAVA: z.string().min(1, "Java solution is required"),
		CPP: z.string().min(1, "C++ solution is required"),
	}),
});

interface CodeEditorProps {
	value: string;
	onChange: (value: string | undefined) => void;
	language?: string;
}

const CodeEditor = ({ value, onChange, language = "javascript" }: CodeEditorProps) => {
	// Map language names to Monaco Editor language IDs
	const languageMap: Record<string, string> = {
		javascript: "javascript",
		python: "python",
		java: "java",
		cpp: "cpp",
	};

	return (
		<div className="border rounded-md bg-slate-950 text-slate-50">
			<div className="px-4 py-2 bg-slate-800 border-b text-sm font-mono">{language}</div>
			<div className="h-75 w-full">
				<Editor
					height="300px"
					defaultLanguage={languageMap[language]}
					theme="vs-dark"
					value={value}
					onChange={onChange}
					options={{
						minimap: { enabled: false },
						fontSize: 18,
						lineNumbers: "on",
						readOnly: false,
						wordWrap: "on",
						formatOnPaste: true,
						formatOnType: true,
						automaticLayout: true,
					}}
				/>
			</div>
		</div>
	);
};

const CreateProblemForm = () => {
	const router = useRouter();
	const [sampleType, setSampleType] = useState("DP");
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(problemSchema),
		defaultValues: {
			testCases: [{ input: "", output: "" }],
			tags: [{ value: "" }],
			examples: {
				JAVASCRIPT: { input: "", output: "", explanation: "" },
				PYTHON: { input: "", output: "", explanation: "" },
				JAVA: { input: "", output: "", explanation: "" },
				CPP: { input: "", output: "", explanation: "" },
			},
			codeSnippets: {
				JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
				PYTHON: "def solution():\n    # Write your code here\n    pass",
				JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
				CPP: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}",
			},
			referenceSolutions: {
				JAVASCRIPT: "// Add your reference solution here",
				PYTHON: "# Add your reference solution here",
				JAVA: "// Add your reference solution here",
				CPP: "// Add your reference solution here",
			},
		},
	});

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = form;

	const {
		fields: testCaseFields,
		append: appendTestCase,
		remove: removeTestCase,
		replace: replaceTestCases,
	} = useFieldArray({
		control,
		name: "testCases",
	});

	const {
		fields: tagFields,
		append: appendTag,
		remove: removeTag,
		replace: replaceTags,
	} = useFieldArray({
		control,
		name: "tags",
	});

	const onSubmit = async (values: z.infer<typeof problemSchema>) => {
		try {
			setIsLoading(true);
			console.log("Form values:", values);
			const response = await fetch("/api/create-problem", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...values, tags: values.tags.map((t) => t.value) }),
			});
			const data = await response.json();
			console.log("API response:", data);
			if (response.ok) {
				toast.success(data.message || "Problem created successfully");
				router.push("/");
			} else {
				toast.error(data.error || "Failed to create problem");
				if (data.testCase) {
					console.error("Test case failure:", data.testCase);
				}
			}
		} catch (error) {
			console.error("Error creating problem:", error);
			toast.error(error instanceof Error ? error.message : "Failed to create problem");
		} finally {
			setIsLoading(false);
		}
	};

	const problemTypes = [
		{ value: "DP", label: "Dynamic Programming", samples: dpProblems },
		{ value: "String", label: "String Manipulation", samples: stringProblems },
		{ value: "Array", label: "Array / Hash Table", samples: arrayProblems },
		{ value: "Graph", label: "Graph / BFS / DFS", samples: graphProblems },
		{ value: "Tree", label: "Binary Tree", samples: treeProblems },
		{ value: "LinkedList", label: "Linked List", samples: linkedListProblems },
		{ value: "BinarySearch", label: "Binary Search", samples: binarySearchProblems },
		{ value: "Stack", label: "Stack / Queue", samples: stackProblems },
		{ value: "Backtracking", label: "Backtracking", samples: backtrackingProblems },
		{ value: "Greedy", label: "Greedy Algorithm", samples: greedyProblems },
		{ value: "SlidingWindow", label: "Sliding Window", samples: slidingWindowProblems },
		{ value: "TwoPointers", label: "Two Pointers", samples: twoPointersProblems },
		{ value: "BitManipulation", label: "Bit Manipulation", samples: bitManipulationProblems },
		{ value: "Heap", label: "Heap / Priority Queue", samples: heapProblems },
		{ value: "Sorting", label: "Sorting", samples: sortingProblems },
	] as const;

	const sampleMap: Record<string, any> = {
		DP: dpProblems[0],
		String: stringProblems[0],
		Array: arrayProblems[0],
		Graph: graphProblems[0],
		Tree: treeProblems[0],
		LinkedList: linkedListProblems[0],
		BinarySearch: binarySearchProblems[0],
		Stack: stackProblems[0],
		Backtracking: backtrackingProblems[0],
		Greedy: greedyProblems[0],
		SlidingWindow: slidingWindowProblems[0],
		TwoPointers: twoPointersProblems[0],
		BitManipulation: bitManipulationProblems[0],
		Heap: heapProblems[0],
		Sorting: sortingProblems[0],
	};

	const loadSampleData = () => {
		const sampleData = sampleMap[sampleType] ?? dpProblems[0];
		replaceTags(sampleData.tags.map((tag: string) => ({ value: tag })));
		replaceTestCases(sampleData.testCases.map((tc: { input: string; output: string }) => tc));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		reset(sampleData as any);
	};

	return (
		<div className="container mx-auto py-8 px-4 max-w-7xl">
			<Card className="shadow-xl">
				<CardHeader className="pb-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<CardTitle className="text-3xl flex items-center gap-3">
							<FileText className="w-8 h-8 text-amber-600" />
							Create Problem
						</CardTitle>

						<div className="flex flex-col md:flex-row gap-3">
							<Select
								value={sampleType}
								onValueChange={setSampleType}
							>
								<SelectTrigger className="w-62.5">
									<SelectValue placeholder="Select problem type..." />
								</SelectTrigger>
								<SelectContent>
									{problemTypes.map((pt) => (
										<SelectItem
											key={pt.value}
											value={pt.value}
										>
											{pt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={loadSampleData}
								className="gap-2"
							>
								<Download className="w-4 h-4" />
								Load Sample
							</Button>
						</div>
					</div>
					<Separator />
				</CardHeader>

				<CardContent className="p-6">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-8"
					>
						{/* Basic Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="md:col-span-2">
								<Label
									htmlFor="title"
									className="text-lg font-semibold"
								>
									Title
								</Label>
								<Input
									id="title"
									{...register("title")}
									placeholder="Enter problem title"
									className="mt-2 text-lg"
								/>
								{errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
							</div>

							<div className="md:col-span-2">
								<Label
									htmlFor="description"
									className="text-lg font-semibold"
								>
									Description
								</Label>
								<Textarea
									id="description"
									{...register("description")}
									placeholder="Enter problem description"
									className="mt-2 min-h-32 text-base resize-y"
								/>
								{errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
							</div>

							<div>
								<Label
									htmlFor="difficulty"
									className="text-lg font-semibold"
								>
									Difficulty
								</Label>
								<Controller
									name="difficulty"
									control={control}
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Select difficulty" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="EASY">
													<Badge
														variant="secondary"
														className="bg-green-100 text-green-800"
													>
														Easy
													</Badge>
												</SelectItem>
												<SelectItem value="MEDIUM">
													<Badge
														variant="secondary"
														className="bg-amber-100 text-amber-800"
													>
														Medium
													</Badge>
												</SelectItem>
												<SelectItem value="HARD">
													<Badge
														variant="secondary"
														className="bg-red-100 text-red-800"
													>
														Hard
													</Badge>
												</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
								{errors.difficulty && <p className="text-sm text-red-500 mt-1">{errors.difficulty.message}</p>}
							</div>
						</div>

						{/* Tags */}
						<Card className="bg-amber-50 dark:bg-amber-950/20">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<CardTitle className="text-xl flex items-center gap-2">
										<BookOpen className="w-5 h-5 text-amber-600" />
										Tags
									</CardTitle>
									<Button
										type="button"
										size="sm"
										onClick={() => appendTag({ value: "" })}
										className="gap-2"
									>
										<Plus className="w-4 h-4" /> Add Tag
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{tagFields.map((field, index) => (
										<div
											key={field.id}
											className="flex gap-2 items-center"
										>
											<Input
												{...register(`tags.${index}.value`)}
												placeholder="Enter tag"
												className="flex-1"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeTag(index)}
												disabled={tagFields.length === 1}
												className="p-2"
											>
												<Trash2 className="w-4 h-4 text-red-500" />
											</Button>
										</div>
									))}
								</div>
								{errors.tags && <p className="text-sm text-red-500 mt-2">{errors.tags.message}</p>}
							</CardContent>
						</Card>

						{/* Test Cases */}
						<Card className="bg-green-50 dark:bg-green-950/20">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<CardTitle className="text-xl flex items-center gap-2">
										<CheckCircle2 className="w-5 h-5 text-green-600" />
										Test Cases
									</CardTitle>
									<Button
										type="button"
										size="sm"
										onClick={() => appendTestCase({ input: "", output: "" })}
										className="gap-2"
									>
										<Plus className="w-4 h-4" /> Add Test Case
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								{testCaseFields.map((field, index) => (
									<Card
										key={field.id}
										className="bg-background"
									>
										<CardHeader className="pb-4">
											<div className="flex justify-between items-center">
												<CardTitle className="text-lg">Test Case #{index + 1}</CardTitle>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeTestCase(index)}
													disabled={testCaseFields.length === 1}
													className="text-red-500 gap-2"
												>
													<Trash2 className="w-4 h-4" /> Remove
												</Button>
											</div>
										</CardHeader>
										<CardContent>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div>
													<Label className="font-medium">Input</Label>
													<Textarea
														{...register(`testCases.${index}.input`)}
														placeholder="Enter test case input"
														className="mt-2 min-h-24 resize-y font-mono"
													/>
													{errors.testCases?.[index]?.input && (
														<p className="text-sm text-red-500 mt-1">{errors.testCases[index].input.message}</p>
													)}
												</div>
												<div>
													<Label className="font-medium">Expected Output</Label>
													<Textarea
														{...register(`testCases.${index}.output`)}
														placeholder="Enter expected output"
														className="mt-2 min-h-24 resize-y font-mono"
													/>
													{errors.testCases?.[index]?.output && (
														<p className="text-sm text-red-500 mt-1">{errors.testCases[index].output.message}</p>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								))}
								{errors.testCases && !Array.isArray(errors.testCases) && (
									<p className="text-sm text-red-500">{errors.testCases.message}</p>
								)}
							</CardContent>
						</Card>

						{/* Code Editor Sections */}
						{(["JAVASCRIPT", "PYTHON", "JAVA", "CPP"] as const).map((language) => (
							<Card
								key={language}
								className="bg-slate-50 dark:bg-slate-950/20"
							>
								<CardHeader>
									<CardTitle className="text-xl flex items-center gap-2">
										<Code2 className="w-5 h-5 text-slate-600" />
										{language}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Starter Code */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Starter Code Template</CardTitle>
										</CardHeader>
										<CardContent>
											<Controller
												name={`codeSnippets.${language}`}
												control={control}
												render={({ field }) => (
													<CodeEditor
														value={field.value}
														onChange={field.onChange}
														language={language.toLowerCase()}
													/>
												)}
											/>
											{errors.codeSnippets?.[language] && (
												<p className="text-sm text-red-500 mt-2">{errors.codeSnippets[language].message}</p>
											)}
										</CardContent>
									</Card>

									{/* Reference Solution */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg flex items-center gap-2">
												<CheckCircle2 className="w-5 h-5 text-green-600" />
												Reference Solution
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Controller
												name={`referenceSolutions.${language}`}
												control={control}
												render={({ field }) => (
													<CodeEditor
														value={field.value}
														onChange={field.onChange}
														language={language.toLowerCase()}
													/>
												)}
											/>
											{errors.referenceSolutions?.[language] && (
												<p className="text-sm text-red-500 mt-2">{errors.referenceSolutions[language].message}</p>
											)}
										</CardContent>
									</Card>

									{/* Examples */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Example</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div>
													<Label className="font-medium">Input</Label>
													<Textarea
														{...register(`examples.${language}.input`)}
														placeholder="Example input"
														className="mt-2 min-h-20 resize-y font-mono"
													/>
													{errors.examples?.[language]?.input && (
														<p className="text-sm text-red-500 mt-1">{errors.examples[language].input.message}</p>
													)}
												</div>
												<div>
													<Label className="font-medium">Output</Label>
													<Textarea
														{...register(`examples.${language}.output`)}
														placeholder="Example output"
														className="mt-2 min-h-20 resize-y font-mono"
													/>
													{errors.examples?.[language]?.output && (
														<p className="text-sm text-red-500 mt-1">{errors.examples[language].output.message}</p>
													)}
												</div>
												<div className="md:col-span-2">
													<Label className="font-medium">Explanation</Label>
													<Textarea
														{...register(`examples.${language}.explanation`)}
														placeholder="Explain the example"
														className="mt-2 min-h-24 resize-y"
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								</CardContent>
							</Card>
						))}

						{/* Additional Information */}
						<Card className="bg-amber-50 dark:bg-amber-950/20">
							<CardHeader>
								<CardTitle className="text-xl flex items-center gap-2">
									<Lightbulb className="w-5 h-5 text-amber-600" />
									Additional Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div>
									<Label className="font-medium">Constraints</Label>
									<Textarea
										{...register("constraints")}
										placeholder="Enter problem constraints"
										className="mt-2 min-h-24 resize-y font-mono"
									/>
									{errors.constraints && <p className="text-sm text-red-500 mt-1">{errors.constraints.message}</p>}
								</div>
								<div>
									<Label className="font-medium">Hints (Optional)</Label>
									<Textarea
										{...register("hints")}
										placeholder="Enter hints for solving the problem"
										className="mt-2 min-h-24 resize-y"
									/>
								</div>
								<div>
									<Label className="font-medium">Editorial (Optional)</Label>
									<Textarea
										{...register("editorial")}
										placeholder="Enter problem editorial/solution explanation"
										className="mt-2 min-h-32 resize-y"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Submit Button */}
						<div className="flex justify-end mt-6">
							<Button
								type="submit"
								size="lg"
								disabled={isLoading}
								className="gap-2"
							>
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Creating...
									</>
								) : (
									<>
										<Plus className="w-5 h-5" />
										Create Problem
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreateProblemForm;
