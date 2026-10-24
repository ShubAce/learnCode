import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { DEFAULT_LANGUAGE, LANGUAGE_IDS } from "@/config/languages";
import { db } from "@/lib/db";
import { buildTutorPrompt } from "@/modules/ai/prompt";

export const maxDuration = 30;

// Keep the context window (and cost) bounded on long conversations
const MAX_HISTORY = 20;

const bodySchema = z.object({
	messages: z.array(z.custom<UIMessage>((value) => Boolean(value) && typeof value === "object")).min(1),
	problemId: z.string().min(1).max(64),
	language: z.enum(LANGUAGE_IDS).default(DEFAULT_LANGUAGE),
	code: z.string().max(20_000).default(""),
});

const json = (body: unknown, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
	const { userId } = await auth();
	if (!userId) return json({ error: "Sign in to use the AI tutor." }, 401);

	if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
		return json({ error: "The AI tutor isn't configured. Set GOOGLE_GENERATIVE_AI_API_KEY in your environment." }, 503);
	}

	const parsed = bodySchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return json({ error: "Invalid request." }, 400);
	const { messages, problemId, language, code } = parsed.data;

	const problem = await db.problem.findUnique({
		where: { id: problemId },
		select: { title: true, difficulty: true, tags: true, description: true, constraints: true },
	});
	if (!problem) return json({ error: "Problem not found." }, 404);

	const result = streamText({
		model: google(process.env.AI_MODEL || "gemini-2.5-flash"),
		system: buildTutorPrompt({ ...problem, language, code }),
		messages: await convertToModelMessages(messages.slice(-MAX_HISTORY)),
	});

	return result.toUIMessageStreamResponse({
		onError: (error) => {
			console.error("[ai-chat]", error);
			return "The AI tutor couldn't respond right now. Please try again in a moment.";
		},
	});
}
