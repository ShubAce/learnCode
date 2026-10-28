import { Skeleton } from "@/components/ui/skeleton";

export default function ProblemsLoading() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-32 pb-8 sm:px-6">
			<div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
				<div className="flex flex-col gap-4">
					<Skeleton className="h-6 w-32 rounded-full" />
					<Skeleton className="h-12 w-full max-w-xl" />
					<Skeleton className="h-5 w-80" />
				</div>
				<Skeleton className="h-36 w-full rounded-2xl lg:w-[25rem]" />
			</div>
			<Skeleton className="h-16 w-full rounded-2xl" />
			<div className="overflow-hidden rounded-2xl border">
				{Array.from({ length: 8 }, (_, i) => (
					<div
						key={i}
						className="flex items-center gap-4 border-b px-5 py-4 last:border-b-0"
					>
						<Skeleton className="size-5 rounded-full" />
						<Skeleton
							className="h-4"
							style={{ width: `${30 + ((i * 17) % 30)}%` }}
						/>
						<Skeleton className="ml-auto h-5 w-16 rounded-full" />
					</div>
				))}
			</div>
		</div>
	);
}
