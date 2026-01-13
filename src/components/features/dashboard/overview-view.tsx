"use client";

import { Job } from "@/types/app";
import { AnalyticsBento } from "@/components/features/dashboard/analytics-bento";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Briefcase, Plus, Sparkles, Bell } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DotPattern } from "@/components/ui/dot-pattern";

interface OverviewViewProps {
    jobs: Job[];
    newThisWeek: number;
}

export function OverviewView({ jobs, newThisWeek }: OverviewViewProps) {
    const totalJobs = jobs.length;
    const totalViews = jobs.reduce((acc, j) => acc + (j.views || 0), 0);
    const totalApplicants = jobs.reduce((acc, j) => acc + (j.applications?.length || 0), 0);
    const avgConversion = totalViews > 0 ? Math.round((totalApplicants / totalViews) * 100) : 0;

    const recentJobs = [...jobs]
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 4);

    return (
        <div className="space-y-6 relative">
            <DotPattern className="opacity-30 mask-[radial-gradient(400px_circle_at_center,white,transparent)]" />
            <div className="relative z-10 space-y-6">
                <AnalyticsBento
                    totalJobs={totalJobs}
                    totalViews={totalViews}
                    totalApplicants={totalApplicants}
                    avgConversion={avgConversion}
                    newThisWeek={newThisWeek}
                />

            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-2xl bg-card/40 backdrop-blur-2xl relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-primary to-primary/20" />
                    <CardHeader className="flex flex-row items-center justify-between pb-8">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-3 text-2xl font-black">
                                <span className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Sparkles className="h-5 w-5 animate-pulse" />
                                </span>
                                Intelligence Feed
                            </CardTitle>
                            <p className="text-sm text-muted-foreground font-semibold">Live activity from your hiring pipeline</p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all group" asChild>
                            <Link href="/dashboard/jobs">
                                Full Pipeline <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout">
                                {recentJobs.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-20 text-center text-muted-foreground bg-muted/5 rounded-3xl border-2 border-dashed border-border/50"
                                    >
                                        <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
                                            <Briefcase className="h-8 w-8 opacity-20" />
                                        </div>
                                        <p className="font-bold">No activity yet</p>
                                        <p className="text-sm mt-1">Post a job listing to start tracking performance</p>
                                    </motion.div>
                                ) : (
                                    recentJobs.map((job, idx) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ 
                                                duration: 0.6, 
                                                delay: idx * 0.1,
                                                ease: [0.23, 1, 0.32, 1] 
                                            }}
                                            className="group flex items-center justify-between p-5 rounded-2xl bg-muted/5 border border-white/5 hover:bg-white/5 transition-all hover:scale-[1.01] hover:shadow-lg"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="p-4 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 text-primary group-hover:scale-110 transition-transform">
                                                        <Briefcase className="h-6 w-6" />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-lg leading-tight group-hover:text-primary transition-colors">{job.title}</p>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-xs font-bold text-muted-foreground/80 uppercase tracking-tighter">
                                                            Posted {new Date(job.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                        <Badge variant="secondary" className="px-2 py-0 text-[10px] h-5 font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-none">
                                                            {job.applications?.length || 0} APPLICANTS
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="icon" className="rounded-full border-primary/20 bg-primary/5 group-hover:bg-primary group-hover:text-white transition-all shadow-sm" asChild>
                                                <Link href={`/dashboard/applicants/${job.id}`}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-none shadow-2xl bg-linear-to-br from-primary to-indigo-700 text-primary-foreground overflow-hidden relative group p-1">
                        <div className="absolute -top-12 -right-12 p-8 transform opacity-10 transition-transform group-hover:rotate-12 group-hover:scale-110">
                            <Plus className="h-48 w-48 text-white" />
                        </div>
                        <div className="relative bg-black/10 rounded-3xl p-6 h-full border border-white/10">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="text-2xl font-black">Hire Top Talent</CardTitle>
                                <p className="text-white/70 text-sm font-bold mt-1">Ready to scale your engineering team?</p>
                            </CardHeader>
                            <CardContent className="p-0 relative z-10">
                                <Link href="/jobs/post" className="block">
                                    <Button className="w-full bg-white text-indigo-700 hover:bg-white/95 font-black py-7 rounded-2xl shadow-2xl transition-all hover:scale-[1.03] active:scale-95 text-lg" size="lg">
                                        <Plus className="h-6 w-6 mr-3 stroke-3" /> Post New Job
                                    </Button>
                                </Link>
                            </CardContent>
                        </div>
                    </Card>

                    <Card className="border-none shadow-xl bg-card/40 backdrop-blur-2xl ring-1 ring-white/5 p-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-3 font-black">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <Bell className="h-4 w-4" />
                                </div>
                                Tips & Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="p-5 rounded-2xl bg-muted/5 border border-white/5 space-y-2">
                                <p className="text-sm font-black text-primary uppercase tracking-tighter">Pro Hiring Tip</p>
                                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                                    Jobs with &quot;Remote&quot; tags see a <span className="text-emerald-500 font-bold">285% increase</span> in applicants. Consider localized remote options.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full justify-between rounded-xl py-6 border-white/10 hover:bg-white/5 group transition-all"
                                asChild
                            >
                                <Link href="/dashboard/analytics">
                                    <span className="font-black text-sm uppercase tracking-widest">Full Analytics</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                </div>
            </div>
        </div>
    );
}
