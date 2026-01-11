"use client";

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { Job } from "@/types/app"
import { getEmployerJobsWithStats } from "@/actions/jobs"
import { Loader2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ApplicantsPage() {
    const { profile, loading: isAuthLoading } = useAuth()
    const [myJobs, setMyJobs] = useState<Job[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)

    useEffect(() => {
        async function fetchEmployerData() {
            if (!profile?.id) return;
            try {
                const result = await getEmployerJobsWithStats(profile.id);
                setMyJobs(result.jobs);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setIsLoadingData(false);
            }
        }

        if (!isAuthLoading && profile?.id) {
            fetchEmployerData();
        } else if (!isAuthLoading && !profile?.id) {
            setIsLoadingData(false); 
        }
    }, [profile, isAuthLoading])

    if (isAuthLoading || isLoadingData) {
        return (
            <div className="container py-32 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading applicants...</p>
            </div>
        );
    }

    const totalApplicants = myJobs.reduce((acc, job) => acc + (job.applicants_count || 0), 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Applicants</h1>
                <p className="text-muted-foreground font-semibold">
                    Manage candidates across all active job listings.
                </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Applicants</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{totalApplicants}</div>
                    <p className="text-xs text-muted-foreground">Across {myJobs.length} active jobs</p>
                </div>
            </div>

            <div className="space-y-4">
                 <h2 className="text-xl font-bold tracking-tight">Applicants by Job</h2>
                 <div className="grid gap-4">
                    {myJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                            <div>
                                <h3 className="font-semibold">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">{job.applicants_count || 0} applicants</p>
                            </div>
                            <Link href={`/dashboard/applicants/${job.id}`}>
                                <Button variant="outline" size="sm">View Applicants</Button>
                            </Link>
                        </div>
                    ))}
                    
                    {myJobs.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
                            No jobs posted yet.
                        </div>
                    )}
                 </div>
            </div>
        </div>
    )
}
