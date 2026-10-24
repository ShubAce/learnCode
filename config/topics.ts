/**
 * Topic taxonomy used across the platform (landing page, problem authoring samples).
 * Problem tags are free-form; topics are the curated categories we showcase.
 */
export const TOPICS = [
	{ id: "Array", label: "Arrays & Hashing" },
	{ id: "TwoPointers", label: "Two Pointers" },
	{ id: "SlidingWindow", label: "Sliding Window" },
	{ id: "Stack", label: "Stack & Queue" },
	{ id: "BinarySearch", label: "Binary Search" },
	{ id: "LinkedList", label: "Linked List" },
	{ id: "Tree", label: "Binary Trees" },
	{ id: "Heap", label: "Heap / Priority Queue" },
	{ id: "Backtracking", label: "Backtracking" },
	{ id: "Graph", label: "Graphs" },
	{ id: "DP", label: "Dynamic Programming" },
	{ id: "Greedy", label: "Greedy" },
	{ id: "BitManipulation", label: "Bit Manipulation" },
	{ id: "Sorting", label: "Sorting" },
	{ id: "String", label: "Strings" },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];
