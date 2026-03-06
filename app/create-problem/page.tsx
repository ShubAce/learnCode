import { currentUserRole } from "@/modules/auth/actions";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import { UserRole } from "@/src/generated/browser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CreateProblemForm from "@/modules/problems/components/create-problem-form";
import Navbar from "@/modules/home/components/navbar";

const CreateProblem = async () => {
	const user = await currentUser();
	const userRole = await currentUserRole();

	if (userRole !== UserRole.ADMIN) {
		return redirect("/");
	}
	return (
		<>
			<Navbar userRole={userRole} />
			<section className="flex flex-col items-center justify-center container mx-auto px-4 my-4 w-full max-w-7xl mt-24">
				<div className="flex items-center justify-between w-full mb-8">
					<Link href="/">
						<Button
							variant={"outline"}
							size="icon"
						>
							<ArrowLeft className="size-4" />
						</Button>
					</Link>
					<h1 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center flex-1 mx-4">
						Welcome,{" "}
						<span className="text-amber-700">
							{user?.firstName || "Guest"} {user?.lastName || ""}
						</span>
						! Create a Problem
					</h1>
					<div className="w-10"></div>
				</div>
				<CreateProblemForm />
			</section>
		</>
	);
};

export default CreateProblem;
