"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobDistributionChart } from "@/components/analytics/job-distribution-chart";
import { Job } from "@/types/app";
import { StatsCards } from "@/components/features/dashboard/stats-cards";

interface AnalyticsViewProps {
    jobs: Job[];
    title?: string;
    description?: string;
}

export function AnalyticsView({ jobs, title, description }: AnalyticsViewProps) {
    const [range, setRange] = useState<'7d' | '30d' | 'all'>('30d');
    const [now] = useState(() => Date.now());
    const msInDay = 24 * 60 * 60 * 1000;

    const withinRange = (created?: string | null) => {
        if (!created) return false;
        if (range === 'all') return true;
        const diff = now - new Date(created).getTime();
        return range === '7d' ? diff < 7 * msInDay : diff < 30 * msInDay;
    };

    const filteredJobs = range === 'all' ? jobs : jobs.filter(j => withinRange(j.created_at as string | null));

    const jobDistribution = filteredJobs.reduce((acc: Record<string, number>, job) => {
        const type = job.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(jobDistribution).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: jobDistribution[key]
    }));

    const totalJobs = filteredJobs.length;
    const newThisWeek = jobs.filter(j => j.created_at && (now - new Date(j.created_at as string).getTime()) < 7 * 24 * 60 * 60 * 1000).length;
    const totalViews = filteredJobs.reduce((acc, j) => acc + (j.views || 0), 0);
    const totalApps = filteredJobs.reduce((acc, j) => acc + (j.applications?.length || 0), 0);
    const avgConversion = totalViews > 0 ? Math.round((totalApps / totalViews) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {title && (
                    <div className="space-y-0.5">
                        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-muted-foreground font-semibold text-sm">
                                {description}
                            </p>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-1.5 p-1 bg-background/50 border rounded-2xl w-fit">
                    <Button variant={range === '7d' ? 'default' : 'ghost'} size="sm" onClick={() => setRange('7d')} className="rounded-xl font-black text-[10px] uppercase">Last 7d</Button>
                    <Button variant={range === '30d' ? 'default' : 'ghost'} size="sm" onClick={() => setRange('30d')} className="rounded-xl font-black text-[10px] uppercase">Last 30d</Button>
                    <Button variant={range === 'all' ? 'default' : 'ghost'} size="sm" onClick={() => setRange('all')} className="rounded-xl font-black text-[10px] uppercase">All Time</Button>
                </div>
            </div>

            <StatsCards
                totalJobs={totalJobs}
                newThisWeek={newThisWeek}
                totalViews={totalViews}
                avgConversion={avgConversion}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <JobDistributionChart data={chartData} />
                <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-black">Data Breakdown</CardTitle>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type-specific intelligence</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-white/5 pb-2">
                                <div>Category</div>
                                <div className="text-right">Jobs</div>
                                <div className="text-right">Ratio</div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {chartData.map(row => {
                                    const pct = totalJobs ? Math.round((row.value / totalJobs) * 100) : 0;
                                    return (
                                        <div key={row.name} className="grid grid-cols-3 py-3 text-xs font-semibold hover:bg-white/5 px-1 rounded-lg transition-colors group">
                                            <div className="font-black group-hover:text-primary transition-colors">{row.name}</div>
                                            <div className="text-right font-mono">{row.value}</div>
                                            <div className="text-right flex items-center justify-end gap-2">
                                                <span className="text-[10px] text-muted-foreground">{pct}%</span>
                                                <div className="w-12 h-1 bg-muted/30 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {chartData.length === 0 && (
                                    <p className="py-10 text-center text-muted-foreground italic text-xs">No data for selected range</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
