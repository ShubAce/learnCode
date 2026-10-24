import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Accent, Eyebrow } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

type FormPageHeaderProps = {
	eyebrow: string;
	title: string;
	accent: string;
	description: string;
	backHref: string;
	backLabel: string;
};

export function FormPageHeader({ eyebrow, title, accent, description, backHref, backLabel }: FormPageHeaderProps) {
	return (
		<div className="flex flex-col gap-5">
			<Button
				asChild
				variant="ghost"
				size="sm"
				className="w-fit"
			>
				<Link href={backHref}>
					<ArrowLeft /> {backLabel}
				</Link>
			</Button>
			<div className="flex flex-col gap-3">
				<Eyebrow className="w-fit">{eyebrow}</Eyebrow>
				<h1 className="text-4xl font-semibold tracking-tighter text-balance sm:text-5xl">
					{title} <Accent>{accent}</Accent>
				</h1>
				<p className="max-w-2xl text-pretty text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}
