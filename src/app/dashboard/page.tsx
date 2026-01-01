"use client";

import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { JobDistributionChart } from "@/components/analytics/job-distribution-chart"
import { Job } from "@/types/app"

export default function DashboardPage() {
    const { profile, isEmployer, loading: isAuthLoading } = useAuth()
    const [myJobs, setMyJobs] = useState<Job[]>([])

    useEffect(() => {
        if (isEmployer) {
            supabase
                .from('jobs')
                .select('*')
                .eq('employer_id', profile?.id)
                .then(({ data }) => setMyJobs(data || []))
        }
    }, [isEmployer, profile])

    // Calculate job distribution
    const jobDistribution = myJobs.reduce((acc: Record<string, number>, job) => {
        const type = job.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(jobDistribution).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: jobDistribution[key]
    }));

    if (isAuthLoading) {
        return <div className="container py-20 text-center">Loading dashboard...</div>;
    }

    if (!isEmployer) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-3xl font-bold">Only employers can access dashboard</h1>
                <Link href="/jobs"><Button className="mt-4">Browse Jobs</Button></Link>
            </div>
        )
    }

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Employer Dashboard</h1>
                <Link href="/jobs/post">
                    <Button size="lg">Post New Job</Button>
                </Link>
            </div>

            {myJobs.length > 0 && (
                <div className="mb-10 grid gap-6 md:grid-cols-2">
                    <JobDistributionChart data={chartData} />
                </div>
            )}

            <h2 className="text-2xl font-semibold mb-4">Your Posted Jobs</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myJobs.length === 0 ? (
                    <Card className="p-10 text-center col-span-full">
                        <p className="text-muted-foreground mb-4">You haven't posted any jobs yet</p>
                        <Link href="/jobs/post">
                            <Button>Post First Job</Button>
                        </Link>
                    </Card>
                ) : (
                    myJobs.map(job => (
                        <Card key={job.id} className="p-6">
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2">{job.company_name}</p>
                            <div className="mt-6 flex gap-3">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/jobs/${job.id}`}>View Job</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href={`/dashboard/applicants/${job.id}`}>View Applicants →</Link>
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
