import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { DEFAULT_LANGUAGE, LANGUAGE_IDS } from "@/config/languages";
import { db } from "@/lib/db";
import { buildTutorPrompt } from "@/modules/ai/prompt";

export const maxDuration = 30;

// Bound the context window (and cost) of long conversations
const MAX_HISTORY = 20;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_PROMPT_CODE_CHARS = 20_000;

// Only user/assistant turns are accepted: the system prompt is ours alone.
const messageSchema = z.object({
	id: z.string().max(200),
	role: z.enum(["user", "assistant"]),
	parts: z.array(z.looseObject({ type: z.string(), text: z.string().optional() })).max(100),
});

const bodySchema = z.object({
	messages: z.array(messageSchema).min(1).max(200),
	problemId: z.string().min(1).max(64),
	language: z.enum(LANGUAGE_IDS).default(DEFAULT_LANGUAGE),
	code: z.string().max(64_000).default(""),
});

const json = (body: unknown, status: number) => Response.json(body, { status });

/** Keeps only text parts, capped in length, and drops turns left empty. */
function sanitize(messages: z.infer<typeof messageSchema>[]): UIMessage[] {
	return messages
		.slice(-MAX_HISTORY)
		.map((message) => ({
			id: message.id,
			role: message.role,
			parts: message.parts
				.filter((part) => part.type === "text" && typeof part.text === "string")
				.map((part) => ({ type: "text" as const, text: part.text!.slice(0, MAX_MESSAGE_CHARS) })),
		}))
		.filter((message) => message.parts.length > 0);
}

export async function POST(request: Request) {
	const { userId } = await auth();
	if (!userId) return json({ error: "Sign in to use the AI tutor." }, 401);

	if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
		return json({ error: "The AI tutor isn't configured. Set GOOGLE_GENERATIVE_AI_API_KEY in your environment." }, 503);
	}

	const parsed = bodySchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return json({ error: "Invalid request." }, 400);
	const { problemId, language } = parsed.data;

	const messages = sanitize(parsed.data.messages);
	if (messages.length === 0 || messages.at(-1)?.role !== "user") return json({ error: "Ask a question to get started." }, 400);

	const problem = await db.problem.findUnique({
		where: { id: problemId },
		select: { title: true, difficulty: true, tags: true, description: true, constraints: true },
	});
	if (!problem) return json({ error: "Problem not found." }, 404);

	const code =
		parsed.data.code.length > MAX_PROMPT_CODE_CHARS ? `${parsed.data.code.slice(0, MAX_PROMPT_CODE_CHARS)}\n… (truncated)` : parsed.data.code;

	const result = streamText({
		model: google(process.env.AI_MODEL || "gemini-2.5-flash"),
		system: buildTutorPrompt({ ...problem, language, code }),
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse({
		onError: (error) => {
			console.error("[ai-chat]", error);
			return "The AI tutor couldn't respond right now. Please try again in a moment.";
		},
	});
}
