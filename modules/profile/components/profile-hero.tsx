import { CalendarDays, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import { initials } from "@/lib/utils";
import type { ProfileData } from "../data";

export function ProfileHero({ user }: { user: ProfileData["user"] }) {
	const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email.split("@")[0];

	return (
		<div className="relative overflow-hidden rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur sm:p-8">
			<div
				aria-hidden
				className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-2xl"
			/>
			<div
				aria-hidden
				className="absolute inset-0 bg-dots [mask-image:linear-gradient(to_left,black,transparent_60%)]"
			/>

			<div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
				<div className="relative shrink-0">
					<div className="absolute -inset-1 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,var(--brand),var(--brand-2),transparent_60%,var(--brand))] opacity-80 blur-[2px]" />
					<div className="relative grid size-24 place-items-center overflow-hidden rounded-full border-4 border-card bg-muted text-2xl font-semibold">
						{user.imageUrl ? (
							<Image
								src={user.imageUrl}
								alt={name}
								fill
								sizes="96px"
								className="object-cover"
							/>
						) : (
							initials(user.firstName, user.lastName)
						)}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex flex-col items-center gap-2 sm:flex-row">
						<h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
						{user.role === "ADMIN" && (
							<span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
								<ShieldCheck className="size-3.5" /> Admin
							</span>
						)}
					</div>
					<div className="flex flex-col items-center gap-x-5 gap-y-1 text-sm text-muted-foreground sm:flex-row">
						<span className="inline-flex items-center gap-1.5">
							<Mail className="size-4" /> {user.email}
						</span>
						<span className="inline-flex items-center gap-1.5">
							<CalendarDays className="size-4" /> Member since {formatDate(user.createdAt, "MMMM yyyy")}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
