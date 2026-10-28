import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
	return `${count} ${count === 1 ? singular : plural}`;
}

export function initials(...parts: (string | null | undefined)[]) {
	return (
		parts
			.filter(Boolean)
			.map((part) => part!.trim()[0])
			.join("")
			.toUpperCase()
			.slice(0, 2) || "?"
	);
}
