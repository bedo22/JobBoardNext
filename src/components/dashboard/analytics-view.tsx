"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobDistributionChart } from "@/components/analytics/job-distribution-chart";
import { Job } from "@/types/app";
import { StatsCards } from "./stats-cards";

interface AnalyticsViewProps {
    jobs: Job[];
}

export function AnalyticsView({ jobs }: AnalyticsViewProps) {
    const [range, setRange] = useState<'7d' | '30d' | 'all'>('30d');

    // Time-range filter
    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;

    const withinRange = (created?: string | null) => {
        if (!created) return false;
        if (range === 'all') return true;
        const diff = now - new Date(created).getTime();
        return range === '7d' ? diff < 7 * msInDay : diff < 30 * msInDay;
    };

    const filteredJobs = range === 'all' ? jobs : jobs.filter(j => withinRange(j.created_at as string | null));

    // Calculate distributions
    const jobDistribution = filteredJobs.reduce((acc: Record<string, number>, job) => {
        const type = job.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(jobDistribution).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: jobDistribution[key]
    }));

    // KPI data
    const totalJobs = filteredJobs.length;
    const newThisWeek = jobs.filter(j => j.created_at && (Date.now() - new Date(j.created_at as string).getTime()) < 7 * 24 * 60 * 60 * 1000).length;
    const remotePercent = totalJobs ? Math.round((filteredJobs.filter(j => j.location_type === 'remote').length / totalJobs) * 100) : 0;

    const entries = Object.entries(jobDistribution);
    const topCategory = entries.length > 0
        ? entries.sort((a, b) => b[1] - a[1])[0][0].replace(/-/g, ' ')
        : "N/A";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Performance Analytics</h2>
                <div className="flex items-center gap-2">
                    <Button variant={range === '7d' ? 'default' : 'outline'} size="sm" onClick={() => setRange('7d')}>7d</Button>
                    <Button variant={range === '30d' ? 'default' : 'outline'} size="sm" onClick={() => setRange('30d')}>30d</Button>
                    <Button variant={range === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setRange('all')}>All</Button>
                </div>
            </div>

            <StatsCards
                totalJobs={totalJobs}
                newThisWeek={newThisWeek}
                remotePercent={remotePercent}
                topCategory={topCategory.charAt(0).toUpperCase() + topCategory.slice(1)}
            />

            <div className="grid gap-6 md:grid-cols-2">
                <JobDistributionChart data={chartData} />
                <Card>
                    <CardHeader>
                        <CardTitle>Data Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground border-b pb-2">
                                <div>Category</div>
                                <div className="text-right">Jobs</div>
                                <div className="text-right">Ratio</div>
                            </div>
                            <div className="divide-y">
                                {chartData.map(row => {
                                    const pct = totalJobs ? Math.round((row.value / totalJobs) * 100) : 0;
                                    return (
                                        <div key={row.name} className="grid grid-cols-3 py-3 text-sm">
                                            <div className="font-medium">{row.name}</div>
                                            <div className="text-right">{row.value}</div>
                                            <div className="text-right">{pct}%</div>
                                        </div>
                                    );
                                })}
                                {chartData.length === 0 && (
                                    <p className="py-10 text-center text-muted-foreground italic">No data for selected range</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
