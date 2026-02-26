import { currentUserRole } from "@/modules/auth/actions";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, User } from "lucide-react";
import { UserRole } from "@/src/generated/browser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import CreateProblemForm from "@/modules/problems/components/create-problem-form";

const CreateProblem = async () => {
	const user = await currentUser();
	const userRole = await currentUserRole();

	if (userRole !== UserRole.ADMIN) {
		return redirect("/");
	}
	return (
		<section className="flex flex-col items-center justify-center container mx-4 my-4">
			<div className="flex flex-col items-center justify-center w-full">
				<Link href="/">
					<Button variant={"outline"}>
						<ArrowLeft className="size-4" />
					</Button>
				</Link>
				<h1 className="text-3xl font-bold text-amber-400">
					Welcome, <span className="text-amber-700">{user?.firstName || "Guest"}</span> ! Create a Problem
                </h1>
                <ModeToggle/>
            </div>
            <CreateProblemForm />
		</section>
	);
};

export default CreateProblem;
