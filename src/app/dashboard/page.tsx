"use client";

import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { JobDistributionChart } from "@/components/analytics/job-distribution-chart"
import { Job } from "@/types/app"

export default function DashboardPage() {
    const { profile, isEmployer, loading: isAuthLoading } = useAuth()
    const [myJobs, setMyJobs] = useState<Job[]>([])
    const [range, setRange] = useState<'7d' | '30d' | 'all'>('30d')

    useEffect(() => {
        if (isEmployer) {
            supabase
                .from('jobs')
                .select('*')
                .eq('employer_id', profile?.id)
                .then(({ data }) => setMyJobs(data || []))
        }
    }, [isEmployer, profile])

    // Time-range filter
    const now = Date.now()
    const msInDay = 24 * 60 * 60 * 1000
    const withinRange = (created?: string | null) => {
        if (!created) return false
        if (range === 'all') return true
        const diff = now - new Date(created).getTime()
        return range === '7d' ? diff < 7 * msInDay : diff < 30 * msInDay
    }
    const filteredJobs = range === 'all' ? myJobs : myJobs.filter(j => withinRange(j.created_at as string | null))

    // Calculate job distribution from filtered jobs
    const jobDistribution = filteredJobs.reduce((acc: Record<string, number>, job) => {
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
                <>
                  {/* Range selector */}
                  <div className="mb-3 flex items-center justify-end gap-2">
                    <Button variant={range==='7d' ? 'default':'outline'} size="sm" onClick={() => setRange('7d')}>7d</Button>
                    <Button variant={range==='30d' ? 'default':'outline'} size="sm" onClick={() => setRange('30d')}>30d</Button>
                    <Button variant={range==='all' ? 'default':'outline'} size="sm" onClick={() => setRange('all')}>All</Button>
                  </div>
                  {/* KPI Cards */}
                  <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card><CardContent className="py-4"><div className="text-sm text-muted-foreground">Total (Range)</div><div className="text-2xl font-semibold">{filteredJobs.length}</div></CardContent></Card>
                    <Card><CardContent className="py-4"><div className="text-sm text-muted-foreground">New This Week</div><div className="text-2xl font-semibold">{myJobs.filter(j => j.created_at && (Date.now() - new Date(j.created_at as string).getTime()) < 7*24*60*60*1000).length}</div></CardContent></Card>
                    <Card><CardContent className="py-4"><div className="text-sm text-muted-foreground">Remote % (Range)</div><div className="text-2xl font-semibold">{(() => { const total = filteredJobs.length; const remote = filteredJobs.filter(j => j.location_type === 'remote').length; return total ? Math.round((remote/total)*100) : 0; })()}%</div></CardContent></Card>
                    <Card><CardContent className="py-4"><div className="text-sm text-muted-foreground">Top Type</div><div className="text-2xl font-semibold">{(() => { const entries = Object.entries(jobDistribution); if (entries.length === 0) return '—'; const [k] = entries.sort((a,b)=>b[1]-a[1])[0]; return k.charAt(0).toUpperCase()+k.slice(1); })()}</div></CardContent></Card>
                  </div>

                  {/* Chart */}
                  <div className="mb-4 grid gap-6 md:grid-cols-2">
                    <JobDistributionChart data={chartData} />
                  </div>

                  {/* Compact table (md+ only) */}
                  <div className="hidden md:block mb-10">
                    <Card>
                      <CardContent className="py-4">
                        <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground px-2">
                          <div>Category</div>
                          <div className="text-right">Count</div>
                          <div className="text-right">Percent</div>
                        </div>
                        <div className="mt-2 divide-y">
                          {chartData.map(row => {
                            const pct = (row.value && filteredJobs.length) ? Math.round((row.value / filteredJobs.length) * 100) : 0;
                            return (
                              <div key={row.name} className="grid grid-cols-3 px-2 py-2 text-sm">
                                <div>{row.name}</div>
                                <div className="text-right">{row.value}</div>
                                <div className="text-right">{pct}%</div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
            )}

            <h2 className="text-2xl font-semibold mb-4">Your Posted Jobs</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myJobs.length === 0 ? (
                    <Card className="p-10 text-center col-span-full">
                        <p className="text-muted-foreground mb-4">You haven&apos;t posted any jobs yet</p>
                        <Link href="/jobs/post">
                            <Button>Post First Job</Button>
                        </Link>
                    </Card>
                ) : (
                    myJobs.map(job => (
                        <Card key={job.id} className="p-6">
                            <h3 className="font-semibold text-lg break-words line-clamp-2">{job.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2 break-words line-clamp-1">{job.company_name}</p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {/* Mobile: single Manage */}
                                <div className="flex md:hidden">
                                    <Button size="sm" asChild>
                                        <Link href={`/dashboard/applicants/${job.id}`}>Manage</Link>
                                    </Button>
                                </div>
                                {/* Desktop: Applicants + Edit */}
                                <div className="hidden md:flex gap-3">
                                    <Button size="sm" asChild>
                                        <Link href={`/dashboard/applicants/${job.id}`}>View Applicants →</Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/jobs/post?edit=${job.id}`}>Edit</Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
