"use client";

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { Job } from "@/types/app"
import { getEmployerJobsWithStats } from "@/actions/jobs"
import { JobManagementView } from "@/components/features/dashboard/job-management-view"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function JobsPage() {
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
                <p className="text-muted-foreground animate-pulse">Loading jobs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">My Jobs</h1>
                    <p className="text-muted-foreground font-semibold">
                        Create, edit, and manage your job listings.
                    </p>
                </div>
                <Link href="/jobs/post">
                    <Button size="lg" className="shadow-lg rounded-2xl font-black px-8">Post New Job</Button>
                </Link>
            </div>
            <JobManagementView jobs={myJobs} />
        </div>
    )
}
