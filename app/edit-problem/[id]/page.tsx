import { currentUserRole } from "@/modules/auth/actions";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import { UserRole } from "@/src/generated/browser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import EditProblemForm from "@/modules/problems/components/edit-problem-form";
import { getProblemById } from "@/modules/problems/actions";

type Props = {
	params: Promise<{ id: string }>;
};

const EditProblem = async ({ params }: Props) => {
	const user = await currentUser();
	const userRole = await currentUserRole();
	const { id } = await params;

	if (userRole !== UserRole.ADMIN) {
		return redirect("/");
	}

	const problemData = await getProblemById(id);

	if (!problemData.success || !problemData.data) {
		return redirect("/");
	}

	return (
		<section className="flex flex-col items-center justify-center container mx-4 my-4">
			<div className="flex flex-col items-center justify-center w-full">
				<Link href={`/problem/${id}`}>
					<Button variant={"outline"}>
						<ArrowLeft className="size-4" />
					</Button>
				</Link>
				<h1 className="text-3xl font-bold text-amber-400">
					Welcome, <span className="text-amber-700">{user?.firstName || "Guest"}</span> ! Edit Problem
				</h1>
				<ModeToggle />
			</div>
			<EditProblemForm problemData={problemData.data} />
		</section>
	);
};

export default EditProblem;
