"use client";

import { Job } from "@/types/app";
import { StatsCards } from "./stats-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Briefcase, Plus } from "lucide-react";
import Link from "next/link";

interface OverviewViewProps {
    jobs: Job[];
    onSwitchTab: (tab: string) => void;
}

export function OverviewView({ jobs, onSwitchTab }: OverviewViewProps) {
    // Basic stats (No filtering needed for overview usually)
    const totalJobs = jobs.length;
    const newThisWeek = jobs.filter(j => j.created_at && (Date.now() - new Date(j.created_at as string).getTime()) < 7 * 24 * 60 * 60 * 1000).length;
    const remoteJobs = jobs.filter(j => j.location_type === 'remote').length;
    const remotePercent = totalJobs ? Math.round((remoteJobs / totalJobs) * 100) : 0;

    // Most common category
    const jobDistribution = jobs.reduce((acc: Record<string, number>, job) => {
        const type = job.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    const entries = Object.entries(jobDistribution);
    const topCategory = entries.length > 0
        ? entries.sort((a, b) => b[1] - a[1])[0][0].replace(/-/g, ' ')
        : "—";

    // Recent jobs
    const recentJobs = [...jobs]
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 3);

    return (
        <div className="space-y-8">
            <StatsCards
                totalJobs={totalJobs}
                newThisWeek={newThisWeek}
                remotePercent={remotePercent}
                topCategory={topCategory.charAt(0).toUpperCase() + topCategory.slice(1)}
            />

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Job Postings</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Your latest activity</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => onSwitchTab('manage')} className="gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentJobs.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground italic bg-muted/20 rounded-lg">
                                    No jobs posted yet
                                </div>
                            ) : (
                                recentJobs.map(job => (
                                    <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-primary/10">
                                                <Briefcase className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{job.title}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(job.created_at || '').toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/applicants/${job.id}`}>View</Link>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10">
                        <Plus className="h-32 w-32" />
                    </div>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Manage your pipeline</p>
                    </CardHeader>
                    <CardContent className="space-y-3 z-10">
                        <Link href="/jobs/post" className="block">
                            <Button className="w-full gap-2 justify-start" size="lg">
                                <Plus className="h-4 w-4" /> Post a Job
                            </Button>
                        </Link>
                        <Button variant="outline" className="w-full justify-start" size="lg" onClick={() => onSwitchTab('analytics')}>
                            Check Stats
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
