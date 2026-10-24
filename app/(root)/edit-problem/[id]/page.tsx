import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/modules/auth/server";
import { FormPageHeader } from "@/modules/problems/components/problem-form/form-page-header";
import { ProblemForm } from "@/modules/problems/components/problem-form/problem-form";
import { getProblemFormValues } from "@/modules/problems/data";

export const metadata: Metadata = { title: "Edit problem" };

type EditProblemPageProps = { params: Promise<{ id: string }> };

export default async function EditProblemPage({ params }: EditProblemPageProps) {
	if (!(await isAdmin())) redirect("/problems");

	const { id } = await params;
	const values = await getProblemFormValues(id);
	if (!values) notFound();

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-28 pb-8 sm:px-6">
			<FormPageHeader
				eyebrow="Admin · Edit problem"
				title="Polish"
				accent={values.title}
				description="Update the statement, examples, test cases or code. Changes go live as soon as you save."
				backHref={`/problem/${id}`}
				backLabel="Back to problem"
			/>
			<ProblemForm
				mode="edit"
				problemId={id}
				defaultValues={values}
			/>
		</div>
	);
}
