import Image from "next/image";
import {Button} from "@/components/ui/button";
import { UserButton, UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import { Route } from "lucide-react";
import { onBoardUser } from "@/modules/auth/actions";

export default async function Home() {
	await onBoardUser();
	return (
		<div className="flex flex-col items-center justify-center h-screen " >
			<UserButton />
			<Route className="mb-4" size={48} />
			<h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
			<Link href="/sign-in">
				<Button variant="outline">Sign In</Button>
			</Link>
		</div>
	);
}
