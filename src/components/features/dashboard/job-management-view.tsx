"use client";

import { Job } from "@/types/app";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, ExternalLink, Edit, Users, Trash2, Loader2, Eye, Sparkles, Briefcase } from "lucide-react";
import Link from "next/link";
import { deleteJob } from "@/app/(dashboard)/dashboard/jobs/actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

interface JobManagementViewProps {
    jobs: Job[];
}

export function JobManagementView({ jobs }: JobManagementViewProps) {
    const [state, formAction, isPending] = useActionState(
        deleteJob,
        { error: "" } as { error: string; success?: never } | { success: boolean; error?: never }
    );

    useEffect(() => {
        if (state?.success) {
            toast.success("Job listing deleted successfully");
        } else if (state?.error && state.error !== "") {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Manage Your Listings</h2>
                <Link href="/jobs/post">
                    <Button size="sm">Post New Job</Button>
                </Link>
            </div>

            <div className="">
                {jobs.length === 0 ? (
                    <Card className="p-12 text-center border-none shadow-2xl bg-card/40 backdrop-blur-xl">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-4 rounded-full bg-primary/10 mb-4 text-primary">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-black italic">The stage is empty</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mt-2 font-semibold">
                                Start reaching talented candidates by posting your first job listing today.
                            </p>
                            <Link href="/jobs/post">
                                <Button className="mt-6 rounded-2xl font-black px-8">Create Post</Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <BentoGrid className="max-w-full">
                        {jobs.map((job, i) => {
                            const isFeatured = i % 5 === 0;
                            return (
                                <BentoGridItem
                                    key={job.id}
                                    title={job.title}
                                    description={
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                <span>{job.company_name}</span>
                                                <span>•</span>
                                                <span>{job.type?.replace(/-/g, ' ')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                                                    <Eye className="h-3 w-3" />
                                                    {job.views || 0}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                                                    <Users className="h-3 w-3" />
                                                    {job.applications?.length || 0}
                                                </div>
                                                {job.views && job.views > 0 && (
                                                    <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                                        {Math.round(((job.applications?.length || 0) / job.views) * 100)}% CONV.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    }
                                    header={
                                        <div className="relative group/card h-full w-full min-h-24 rounded-xl overflow-hidden bg-linear-to-br from-muted to-muted/50 border border-border/50 transition-all">
                                            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg bg-background/50 backdrop-blur-sm shadow-sm" asChild>
                                                    <Link href={`/jobs/post?edit=${job.id}`}>
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-background/50 backdrop-blur-sm shadow-sm">
                                                            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MoreVertical className="h-3.5 w-3.5" />}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 border-white/10 backdrop-blur-xl bg-background/80">
                                                        <DropdownMenuItem asChild className="rounded-lg">
                                                            <Link href={`/jobs/${job.id}`} className="gap-2 font-bold">
                                                                <ExternalLink className="h-4 w-4 text-primary" /> View Live
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild className="rounded-lg">
                                                            <Link href={`/dashboard/applicants/${job.id}`} className="gap-2 font-bold">
                                                                <Users className="h-4 w-4 text-primary" /> Applicants
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive gap-2 cursor-pointer font-bold rounded-lg"
                                                            onSelect={(e) => {
                                                                if (!confirm('Permanently delete this listing?')) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            <form action={formAction} className="flex items-center gap-2 w-full">
                                                                <input type="hidden" name="job_id" value={job.id} />
                                                                <Trash2 className="h-4 w-4" />
                                                                <button type="submit" className="flex-1 text-left">Delete</button>
                                                            </form>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover/card:opacity-20 transition-opacity pointer-events-none">
                                                <Briefcase className="h-12 w-12" />
                                            </div>
                                        </div>
                                    }
                                    icon={isFeatured ? <Sparkles className="h-4 w-4 text-primary" /> : <Briefcase className="h-4 w-4 text-muted-foreground" />}
                                    className={cn(
                                        "group/bento bg-card/40 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all",
                                        isFeatured ? "md:col-span-2" : "md:col-span-1"
                                    )}
                                />
                            );
                        })}
                    </BentoGrid>
                )}
            </div>
        </div>
    );
}
