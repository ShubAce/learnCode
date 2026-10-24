import { NextResponse } from "next/server";
import { createProblem } from "@/modules/problems/actions";

/** REST entry point for problem creation; the authoring form calls the server action directly. */
export async function POST(request: Request) {
	const body = await request.json().catch(() => null);
	if (!body) return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });

	const result = await createProblem(body);
	if (!result.ok) {
		const status = result.error.includes("admin") ? 401 : 400;
		return NextResponse.json({ success: false, error: result.error }, { status });
	}

	return NextResponse.json({ success: true, data: result.data, message: "Problem created successfully" }, { status: 201 });
}
