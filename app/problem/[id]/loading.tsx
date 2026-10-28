import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceLoading() {
	return (
		<div className="flex h-dvh flex-col bg-background">
			<div className="flex h-12 items-center justify-between px-3">
				<Skeleton className="h-8 w-40" />
				<Skeleton className="h-8 w-44" />
				<Skeleton className="h-8 w-28" />
			</div>
			<div className="grid min-h-0 flex-1 gap-2 px-2 pb-2 lg:grid-cols-[44fr_56fr]">
				<div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
					<Skeleton className="h-7 w-2/3" />
					<Skeleton className="h-5 w-40 rounded-full" />
					{[90, 80, 85, 60].map((width, i) => (
						<Skeleton
							key={i}
							className="h-4"
							style={{ width: `${width}%` }}
						/>
					))}
					<Skeleton className="h-24 w-full" />
				</div>
				<div className="hidden flex-col gap-2 lg:flex">
					<Skeleton className="flex-[62] rounded-xl" />
					<Skeleton className="flex-[38] rounded-xl" />
				</div>
			</div>
		</div>
	);
}
