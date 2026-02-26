import { currentUserRole, getCurrentUser } from "@/modules/auth/actions";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/src/generated/enums";
import { NextResponse } from "next/server";
import { getJudge0LanguageId } from "@/lib/judge0";
import { submitBatch } from "@/lib/judge0";
import { poolBatchResults } from "@/lib/judge0";
import { db } from "@/lib/db";

export async function POST(request: Request) {
	try {
		const userRole = await currentUserRole();
		const user = await getCurrentUser();

		if (userRole !== UserRole.ADMIN) {
			return NextResponse.json(
				{
					error: "Unauthorized",
				},
				{
					status: 401,
				},
			);
		}
		const body = await request.json();

		const { title, description, difficulty, tags, examples, constraints, hints, editorial, testCases, codeSnippets, referenceSolutions } = body;

		if (!title || !description || !difficulty || !tags || !examples || !constraints || !testCases || !codeSnippets || !referenceSolutions) {
			return NextResponse.json(
				{
					error: "Missing required fields",
				},
				{
					status: 400,
				},
			);
		}

		if (!Array.isArray(testCases) || testCases.length === 0) {
			return NextResponse.json(
				{
					error: "At least one test case is required",
				},
				{
					status: 400,
				},
			);
		}

		if (!referenceSolutions || typeof referenceSolutions !== "object") {
			return NextResponse.json(
				{
					error: "Reference solutions must be an object with language keys",
				},
				{
					status: 400,
				},
			);
		}

		// Skip reference solution validation for now
		// Reference solutions will be validated when users actually submit code
		console.log("Skipping reference solution validation - will validate on submission");

		const newProblem = await db.problem.create({
			data: {
				title,
				description,
				difficulty,
				tags,
				examples,
				constraints,
				hints: hints || null,
				editorial: editorial || null,
				testCases,
				codeSnippets,
				referenceSolutions,
				userId: user?.id || null,
			},
		});
		return NextResponse.json(
			{
				success: true,
				data: newProblem,
				message: "Problem created successfully",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating problem:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: "Failed to create problem",
			}),
			{ status: 500 },
		);
	}
}
