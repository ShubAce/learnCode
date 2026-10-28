import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/modules/auth/server";
import { FormPageHeader } from "@/modules/problems/components/problem-form/form-page-header";
import { ProblemForm } from "@/modules/problems/components/problem-form/problem-form";

export const metadata: Metadata = { title: "Create a problem" };

export default async function CreateProblemPage() {
	if (!(await isAdmin())) redirect("/problems");

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-28 pb-8 sm:px-6">
			<FormPageHeader
				eyebrow="Admin · New problem"
				title="Craft a new"
				accent="challenge"
				description="Write the statement, add examples and hidden test cases, then provide starter code and a reference solution for every language."
				backHref="/problems"
				backLabel="Back to problems"
			/>
			<ProblemForm mode="create" />
		</div>
	);
}
