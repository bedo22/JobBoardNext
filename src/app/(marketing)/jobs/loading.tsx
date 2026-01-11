import { JobCardSkeleton } from "@/components/features/jobs/job-card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function JobsLoading() {
    return (
        <div className="container py-10">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Filters Skeleton */}
                <aside className="lg:w-80 space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-8 w-28" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </aside>

                {/* Jobs List Skeleton */}
                <div className="flex-1">
                    <div className="mb-8">
                        <Skeleton className="h-10 w-48 mb-2" />
                        <Skeleton className="h-5 w-32" />
                    </div>

                    <div className="space-y-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <JobCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
