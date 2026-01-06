"use client";

import { useState } from "react";
import { Job } from "@/types/app";
import { StatsCards } from "@/components/features/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Briefcase, Plus, Sparkles, Bell } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface OverviewViewProps {
    jobs: Job[];
    onSwitchTab: (tab: string) => void;
}

export function OverviewView({ jobs, onSwitchTab }: OverviewViewProps) {
    const [now] = useState(() => Date.now());
    const totalJobs = jobs.length;
    const newThisWeek = jobs.filter(j => j.created_at && (now - new Date(j.created_at as string).getTime()) < 7 * 24 * 60 * 60 * 1000).length;
    const totalViews = jobs.reduce((acc, j) => acc + (j.views || 0), 0);
    const totalApps = jobs.reduce((acc, j) => acc + (j.applications?.length || 0), 0);
    const avgConversion = totalViews > 0 ? Math.round((totalApps / totalViews) * 100) : 0;

    const recentJobs = [...jobs]
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 4);

    return (
        <div className="space-y-10">
            <StatsCards
                totalJobs={totalJobs}
                newThisWeek={newThisWeek}
                totalViews={totalViews}
                avgConversion={avgConversion}
            />

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-2 border-none shadow-xl bg-card/50 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                    <CardHeader className="flex flex-row items-center justify-between pb-6">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                Intelligence Feed
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">Unified activity and pipeline insights</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => onSwitchTab('manage')} className="gap-2 rounded-full glass">
                            View Pipeline <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <AnimatePresence>
                                {recentJobs.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-12 text-center text-muted-foreground italic bg-muted/10 rounded-2xl border-2 border-dashed"
                                    >
                                        Your activity feed is waiting for your first post
                                    </motion.div>
                                ) : (
                                    recentJobs.map((job, idx) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background/40 hover:bg-accent/10 transition-all hover:translate-x-1"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                                                    <Briefcase className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base leading-none mb-1">{job.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground font-medium">
                                                            {new Date(job.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-border" />
                                                        <span className="text-xs font-bold text-primary/80">
                                                            {(job.applications as unknown as any[])?.length || 0} Applicants
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {job.views && job.views > 10 && (
                                                    <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                                        High Traffic
                                                    </div>
                                                )}
                                                <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                                    <Link href={`/dashboard/applicants/${job.id}`}>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-none shadow-xl bg-primary text-primary-foreground overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 transition-transform group-hover:scale-125">
                            <Plus className="h-32 w-32" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">Hire Top Talent</CardTitle>
                            <p className="text-primary-foreground/70 text-sm font-medium">Ready to expand your engineering team?</p>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <Link href="/jobs/post" className="block">
                                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold py-6 rounded-xl shadow-lg" size="lg">
                                    <Plus className="h-5 w-5 mr-2" /> Post New Job
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bell className="h-4 w-4 text-primary" />
                                Tips & Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-accent/30 border border-border/50">
                                <p className="text-sm font-bold mb-1">Boost Visibility</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Jobs with &quot;Remote&quot; options receive 3x more applications. Try updating your listings.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full justify-between rounded-xl py-6 hover:bg-primary/5 group"
                                onClick={() => onSwitchTab('analytics')}
                            >
                                <span className="font-bold">Detailed Analytics</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
