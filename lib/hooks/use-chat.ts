"use client";

import { useChat as useChatV6 } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";

type AppendOptions = { body?: object };

interface SimplifiedMessage {
	id: string;
	role: string;
	content: string;
}

export function useChat({ api }: { api: string }) {
	const [input, setInput] = useState("");

	const transport = useMemo(() => new DefaultChatTransport({ api }), [api]);

	const { messages: uiMessages, sendMessage, setMessages: setUiMessages, status } = useChatV6({ transport });

	const isLoading = status === "streaming" || status === "submitted";

	// Convert v6 UIMessages (parts-based) to simple role+content objects
	const messages: SimplifiedMessage[] = uiMessages.map((m) => ({
		id: m.id,
		role: m.role,
		content: m.parts
			.filter((p): p is { type: "text"; text: string } => p.type === "text")
			.map((p) => p.text)
			.join(""),
	}));

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setInput(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>, options?: AppendOptions) => {
		e.preventDefault();
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;
		sendMessage({ text: trimmed }, { body: options?.body });
		setInput("");
	};

	const append = (message: { role: string; content: string }, options?: AppendOptions) => {
		sendMessage({ text: message.content }, { body: options?.body });
	};

	const setMessages = (_msgs: SimplifiedMessage[] | ((prev: SimplifiedMessage[]) => SimplifiedMessage[])) => {
		// In the component, this is only called as setMessages([]) to clear.
		// Clear the underlying v6 messages state.
		setUiMessages([]);
	};

	return {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		append,
		setMessages,
	};
}
