"use server";

import { db } from "@/lib/db";
import { submitBatch, poolBatchResults } from "@/lib/judge0";
import { UserRole } from "@/src/generated/browser";
import { currentUser } from "@clerk/nextjs/server";
import { ca } from "date-fns/locale";
import { revalidatePath } from "next/cache";

export const getAllProblems = async () => {
	try {
		const user = await currentUser();

		// Only query user data if user is logged in
		let data = null;
		if (user) {
			data = await db.user.findUnique({
				where: {
					clerkID: user.id,
				},
				select: {
					id: true,
				},
			});
		}

		const problems = await db.problem.findMany({
			include: {
				solvedBy: data?.id
					? {
							where: {
								userId: data.id,
							},
						}
					: false,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Ensure solvedBy is always an array for guest users
		const problemsWithSolvedBy = problems.map((problem) => ({
			...problem,
			solvedBy: problem.solvedBy || [],
		}));

		return {
			success: true,
			data: problemsWithSolvedBy,
		};
	} catch (error) {
		console.error("Error fetching problems:", error);
		return {
			success: false,
			error: "An error occurred while fetching problems.",
		};
	}
};

export const getProblemById = async (id: string) => {
	try {
		const problem = await db.problem.findUnique({
			where: {
				id: id,
			},
		});
		return {
			success: true,
			data: problem,
		};
	} catch (error) {
		console.error("Error fetching problem by ID:", error);
		return {
			success: false,
			error: "An error occurred while fetching the problem.",
		};
	}
};

export const deleteProblem = async (problemId: string) => {
	try {
		const user = await currentUser();
		if (!user) {
			throw new Error("Unauthorized");
		}

		const dbUser = await db.user.findUnique({
			where: {
				clerkID: user.id,
			},
			select: {
				role: true,
			},
		});
		if (dbUser?.role !== UserRole.ADMIN) {
			throw new Error("Only ADMIN can delete problems");
		}

		await db.problem.delete({
			where: {
				id: problemId,
			},
		});

		revalidatePath("/problems");
		return {
			success: true,
			message: "Problem deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting problem:", error);
		return {
			success: false,
			error: "An error occurred while deleting the problem.",
		};
	}
};

export const updateProblem = async (problemId: string, problemData: any) => {
	try {
		const user = await currentUser();
		if (!user) {
			return {
				success: false,
				error: "Unauthorized",
			};
		}

		const dbUser = await db.user.findUnique({
			where: {
				clerkID: user.id,
			},
			select: {
				role: true,
			},
		});

		if (dbUser?.role !== UserRole.ADMIN) {
			return {
				success: false,
				error: "Only ADMIN can update problems",
			};
		}

		const updatedProblem = await db.problem.update({
			where: {
				id: problemId,
			},
			data: {
				title: problemData.title,
				description: problemData.description,
				difficulty: problemData.difficulty,
				tags: problemData.tags,
				examples: problemData.examples,
				constraints: problemData.constraints,
				hints: problemData.hints,
				editorial: problemData.editorial,
				testCases: problemData.testCases,
				codeSnippets: problemData.codeSnippets,
				referenceSolutions: problemData.referenceSolutions,
			},
		});

		revalidatePath(`/problem/${problemId}`);
		revalidatePath("/");
		return {
			success: true,
			message: "Problem updated successfully",
			data: updatedProblem,
		};
	} catch (error) {
		console.error("Error updating problem:", error);
		return {
			success: false,
			error: "An error occurred while updating the problem.",
		};
	}
};

const getLanguageName = (languageId: number): string => {
	const languageMap: Record<number, string> = {
		71: "PYTHON",
		63: "JAVASCRIPT",
		62: "JAVA",
		54: "CPP",
	};
	return languageMap[languageId] || "UNKNOWN";
};

// Normalises a Judge0 stdout/expected string for comparison:
// trim surrounding whitespace and normalise internal newlines.
const normalizeOutput = (s: string | null | undefined): string => {
	if (!s) return "";
	return s
		.replace(/\r\n/g, "\n") // Windows → Unix line endings
		.split("\n")
		.map((line) => line.trimEnd()) // strip trailing spaces per line
		.join("\n")
		.trim();
};

// Run problem without saving to database - just returns test results
export const runProblem = async (id: string, source_code: string, language_id: number, stdin: string[], expected_outputs: string[]) => {
	try {
		const user = await currentUser();
		if (!user) {
			return {
				success: false,
				error: "Unauthorized",
			};
		}

		if (!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length) {
			return {
				success: false,
				error: "Invalid input: stdin and expected_outputs must be non-empty arrays of the same length.",
			};
		}

		const submissions = stdin.map((input: string) => {
			return {
				source_code,
				language_id,
				stdin: input,
			};
		});

		console.log("Running code (no submission):", { language_id, testCaseCount: submissions.length });

		const submitResponse = await submitBatch(submissions);
		const tokens = submitResponse.map((res: any) => res.token).filter(Boolean) as string[];

		if (tokens.length === 0) {
			return {
				success: false,
				error: "Judge0 did not return any submission tokens. Check your API key and URL.",
			};
		}

		const results = await poolBatchResults(tokens);

		let allPassed = true;

		const detailedResults = results.map((result: any, index: number) => {
			const stdout = normalizeOutput(result.stdout) || null;
			const expected_output = normalizeOutput(expected_outputs[index]);
			const passed = stdout !== null && stdout === expected_output;
			if (!passed) {
				allPassed = false;
			}

			return {
				testCase: (index + 1).toString(),
				passed,
				stdout,
				expected: expected_output,
				stderr: result.stderr?.trim() || null,
				compile_output: result.compile_output?.trim() || null,
				status: result.status?.description || "Unknown",
				memory: result.memory ? `${result.memory} KB` : undefined,
				time: result.time ? `${result.time} sec` : undefined,
			};
		});

		return {
			success: true,
			allPassed,
			testResults: detailedResults,
		};
	} catch (error: any) {
		console.error("runProblem error:", error);
		return {
			success: false,
			error: error?.message || "An unexpected error occurred while running the code.",
		};
	}
};

// Submit problem - only saves to database if all test cases pass
export const submitProblem = async (id: string, source_code: string, language_id: number, stdin: string[], expected_outputs: string[]) => {
	try {
		const user = await currentUser();

		// Require user to be logged in for submissions
		if (!user) {
			return {
				success: false,
				error: "You must be logged in to submit solutions.",
			};
		}

		const dbUser = await db.user.findUnique({
			where: {
				clerkID: user.id,
			},
		});

		if (!dbUser) {
			return {
				success: false,
				error: "User not found in database.",
			};
		}
		if (!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length) {
			return {
				success: false,
				error: "Invalid input: stdin and expected_outputs must be non-empty arrays of the same length.",
			};
		}
		const submissions = stdin.map((input: string) => {
			return {
				source_code,
				language_id,
				stdin: input,
			};
		});

		console.log("Submitting to Judge0:", { language_id, testCaseCount: submissions.length });

		const submitResponse = await submitBatch(submissions);
		const tokens = submitResponse.map((res: any) => res.token).filter(Boolean) as string[];

		if (tokens.length === 0) {
			return {
				success: false,
				error: "Judge0 did not return any submission tokens. Check your API key and URL.",
			};
		}

		const results = await poolBatchResults(tokens);

		let allPassed = true;

		const detailedResults = results.map((result: any, index: number) => {
			const stdout = normalizeOutput(result.stdout) || null;
			const expected_output = normalizeOutput(expected_outputs[index]);
			const passed = stdout !== null && stdout === expected_output;
			if (!passed) {
				allPassed = false;
			}

			console.log(`Test case ${index + 1}:`, {
				status: result.status?.description,
				stdout,
				expected_output,
				passed,
				stderr: result.stderr,
				compile_output: result.compile_output,
			});

			return {
				testCase: (index + 1).toString(),
				passed,
				stdout,
				expected: expected_output,
				stderr: result.stderr?.trim() || null,
				compile_output: result.compile_output?.trim() || null,
				status: result.status?.description || "Unknown",
				memory: result.memory ? `${result.memory} KB` : undefined,
				time: result.time ? `${result.time} sec` : undefined,
			};
		});

		// Only save submission if all test cases pass
		if (!allPassed) {
			return {
				success: false,
				allPassed: false,
				testResults: detailedResults,
				error: "Some test cases failed. Submission not saved.",
			};
		}

		const submission = await db.submission.create({
			data: {
				userId: dbUser.id,
				problemId: id,
				sourcecode: { code: source_code },
				language: getLanguageName(language_id),
				stdin: stdin.join("\n"),
				stdout: JSON.stringify(detailedResults.map((res: any) => res.stdout || null)),
				stderr: detailedResults.some((res: any) => res.stderr) ? JSON.stringify(detailedResults.map((res: any) => res.stderr || null)) : null,
				compileOutput: detailedResults.some((res: any) => res.compile_output)
					? JSON.stringify(detailedResults.map((res: any) => res.compile_output || null))
					: null,
				status: allPassed ? "Accepted" : "Wrong Answer",
				memory: detailedResults.some((r: any) => r.memory) ? JSON.stringify(detailedResults.map((r: any) => r.memory || null)) : null,
				time: detailedResults.some((r: any) => r.time) ? JSON.stringify(detailedResults.map((r: any) => r.time || null)) : null,
			},
		});

		if (allPassed) {
			await db.problemSolved.upsert({
				where: {
					userId_problemId: {
						userId: dbUser.id,
						problemId: id,
					},
				},
				update: {},
				create: {
					userId: dbUser.id,
					problemId: id,
				},
			});
		}

		const testCaseResults = detailedResults.map((res: any) => ({
			submissionId: submission.id,
			testCase: res.testCase,
			passed: res.passed,
			stdout: res.stdout,
			expected: res.expected,
			stderr: res.stderr,
			compileOutput: res.compile_output,
			status: res.status,
			memory: res.memory,
			time: res.time,
		}));

		await db.testCaseResult.createMany({
			data: testCaseResults,
		});

		const submissionWithTestCases = await db.submission.findUnique({
			where: {
				id: submission.id,
			},
			include: {
				testCases: true,
			},
		});

		return {
			success: true,
			submission: submissionWithTestCases,
		};
	} catch (error: any) {
		console.error("submitProblem error:", error);
		return {
			success: false,
			error: error?.message || "An unexpected error occurred while submitting the code.",
		};
	}
};

// Backward compatibility alias - defaults to submit behavior
export const executeProblem = submitProblem;

export const getAllSubmissionByCurrentUserForProblem = async (problemId: string) => {
	try {
		const user = await currentUser();

		// If no user is logged in, return empty submissions
		if (!user) {
			return {
				success: true,
				data: [],
			};
		}

		const dbUser = await db.user.findUnique({
			where: {
				clerkID: user.id,
			},
			select: {
				id: true,
			},
		});

		if (!dbUser) {
			return {
				success: true,
				data: [],
			};
		}

		const submissions = await db.submission.findMany({
			where: {
				problemId: problemId,
				userId: dbUser.id,
			},
		});
		return {
			success: true,
			data: submissions,
		};
	} catch (error) {
		console.error("Error fetching submissions:", error);
		return {
			success: false,
			error: "An error occurred while fetching submissions.",
		};
	}
};

export const getExistingProblemTitles = async () => {
	try {
		const problems = await db.problem.findMany({
			select: {
				title: true,
			},
		});
		return {
			success: true,
			data: problems.map((p) => p.title),
		};
	} catch (error) {
		console.error("Error fetching problem titles:", error);
		return {
			success: false,
			error: "An error occurred while fetching problem titles.",
			data: [],
		};
	}
};
