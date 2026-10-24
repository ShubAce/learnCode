import { z } from "zod";
import { DIFFICULTIES } from "@/config/difficulty";
import { LANGUAGE_IDS, mapLanguages } from "@/config/languages";

const exampleSchema = z.object({
	input: z.string().trim().min(1, "Input is required"),
	output: z.string().trim().min(1, "Output is required"),
	explanation: z.string().optional(),
});

/** Shared by the authoring form (client) and the create/update actions (server). */
export const problemFormSchema = z.object({
	title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Keep the title under 120 characters"),
	description: z.string().trim().min(10, "Description must be at least 10 characters"),
	difficulty: z.enum(DIFFICULTIES, { error: "Pick a difficulty" }),
	tags: z.array(z.string().trim().min(1)).min(1, "Add at least one tag").max(10, "Use at most 10 tags"),
	constraints: z.string().trim().min(1, "Constraints are required"),
	hints: z.string().optional(),
	editorial: z.string().optional(),
	testCases: z
		.array(
			z.object({
				input: z.string().min(1, "Input is required"),
				output: z.string().min(1, "Expected output is required"),
			}),
		)
		.min(1, "Add at least one test case"),
	examples: z.object(mapLanguages(() => exampleSchema)),
	codeSnippets: z.object(mapLanguages((language) => z.string().min(1, `${language.label} starter code is required`))),
	referenceSolutions: z.object(mapLanguages((language) => z.string().min(1, `${language.label} reference solution is required`))),
});

export type ProblemFormValues = z.infer<typeof problemFormSchema>;

/** Input for running or submitting code from the workspace. */
export const codeExecutionSchema = z.object({
	problemId: z.string().min(1).max(64),
	language: z.enum(LANGUAGE_IDS),
	code: z
		.string()
		.max(64_000, "Your code is too long (64 KB max).")
		.refine((code) => code.trim().length > 0, "Write some code before running it."),
});

export type CodeExecutionInput = z.infer<typeof codeExecutionSchema>;
