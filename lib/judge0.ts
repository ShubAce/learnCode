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
		`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
		{ submissions },
		{
			headers: {
				"X-RapidAPI-Key": process.env.JUDGE0_API_KEY || "",
				"X-RapidAPI-Host": process.env.RAPIDAPI_HOST || "",
			},
		},
	);

	if (!Array.isArray(data)) {
		throw new Error(`Unexpected response from Judge0 batch submission: ${JSON.stringify(data)}`);
	}

	console.log("Judge0 batch submission response:", data);
	return data;
}

export async function poolBatchResults(tokens: string[]) {
	const MAX_RETRIES = 30;
	let attempts = 0;

	while (attempts < MAX_RETRIES) {
		const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
			params: {
				tokens: tokens.join(","),
				base64_encoded: "false",
			},
			headers: {
				"X-RapidAPI-Key": process.env.JUDGE0_API_KEY || "",
				"X-RapidAPI-Host": process.env.RAPIDAPI_HOST || "",
			},
		});

		const results = data.submissions;

		if (!Array.isArray(results)) {
			throw new Error(`Unexpected response from Judge0 polling: ${JSON.stringify(data)}`);
		}

		console.log(
			`Judge0 poll attempt ${attempts + 1}:`,
			results.map((r: any) => ({ token: r.token, status: r.status?.description, stdout: r.stdout })),
		);

		// Status IDs: 1=In Queue, 2=Processing, 3+=Done (Accepted, Wrong Answer, etc.)
		const isAllDone = results.every((r: { status: { id: number } }) => r.status?.id >= 3);

		if (isAllDone) {
			return results;
		}

		attempts++;
		await sleep(1000);
	}

	throw new Error("Judge0 polling timed out after 30 seconds.");
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
