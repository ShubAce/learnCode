import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
		return new Response(JSON.stringify({ error: "GOOGLE_GENERATIVE_AI_API_KEY is not set. Add it to your .env.local file." }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}

	const { messages, problemContext, currentCode } = await req.json();

	const systemPrompt = `You are an expert AI coding assistant embedded in LearnCode, a competitive programming platform. Help the user solve the following problem.

## Problem Details
**Title:** ${problemContext?.title ?? "Unknown"}
**Difficulty:** ${problemContext?.difficulty ?? "Unknown"}
**Tags:** ${problemContext?.tags?.join(", ") || "N/A"}

**Description:**
${problemContext?.description ?? "N/A"}

**Constraints:**
${problemContext?.constraints ?? "N/A"}

## User's Current Code (${problemContext?.language ?? "JavaScript"}):
\`\`\`${(problemContext?.language ?? "javascript").toLowerCase()}
${currentCode || "(No code written yet)"}
\`\`\`

## Your Guidelines:
- Be concise and educational
- Start with hints and nudges before giving full solutions
- If the user explicitly asks for the full solution, provide it with a clear step-by-step explanation
- Help debug code, explain errors, and suggest improvements
- Teach relevant algorithms and data structures when appropriate
- Use markdown formatting: code blocks with language tags, **bold**, and bullet points
- Always explain your reasoning so the user learns, not just copies
- always answer directly in short form without asking the user to clarify or provide more information
- you only have access to the problem description, constraints, and the user's current code. Do not answers anything that is not based on these information. you will stricitly refuse to answer if the user asks anything unrelated to the problem description, constraints, and the user's current code.
`;

	const result = streamText({
		model: google("gemini-2.5-flash"),
		system: systemPrompt,
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}
