import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobCardSkeleton() {
    return (
        <Card className="border">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-7 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </CardContent>
        </Card>
    )
}
