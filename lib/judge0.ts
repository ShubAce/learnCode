import axios from "axios";

export function getJudge0LanguageId(language: string) {
	const languageMap = {
		PYTHON: 71,
		JAVASCRIPT: 63,
		JAVA: 62,
		CPP: 54,
	};

	return (languageMap as Record<string, number>)[language.toUpperCase()];
}

export async function submitBatch(submissions: { source_code: string; language_id: number; stdin?: string; expected_output?: string }[]) {
	const { data } = await axios.post(
		`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false&wait=true`,
		{ submissions },
		{
			headers: {
				"X-RapidAPI-Key": process.env.JUDGE0_API_KEY || "",
				"X-RapidAPI-Host": process.env.RAPIDAPI_HOST || "",
			},
		},
	);

	console.log("Judge0 API response:", data);
	return data;
}

export async function poolBatchResults(tokens: string[]) {
	while (true) {
		const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
			params: {
				tokens: tokens.join(","),
				base64_encoded: false,
			},
			headers: {
				"X-RapidAPI-Key": process.env.JUDGE0_API_KEY || "",
				"X-RapidAPI-Host": process.env.RAPIDAPI_HOST || "",
			},
		});
		console.log(data);
		const results = data.submissions;
		const isAllDone = results.every((r: { status: { id: number } }) => r.status.id !== 1 && r.status.id >= 3);

		if (isAllDone) {
			return results;
		}
		await sleep(1000);
	}
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
