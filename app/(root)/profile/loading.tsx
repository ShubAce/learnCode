import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-28 pb-8 sm:px-6">
			<Skeleton className="h-40 w-full rounded-3xl" />
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				{Array.from({ length: 4 }, (_, i) => (
					<Skeleton
						key={i}
						className="h-36 rounded-2xl"
					/>
				))}
			</div>
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
				<Skeleton className="h-80 rounded-2xl" />
				<Skeleton className="h-80 rounded-2xl" />
			</div>
		</div>
	);
}
