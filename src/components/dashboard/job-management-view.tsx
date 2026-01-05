"use client";

import { Job } from "@/types/app";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, ExternalLink, Edit, Users, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { deleteJob } from "@/app/dashboard/jobs/actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {jobs.length === 0 ? (
                    <Card className="p-12 text-center border-dashed">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-4 rounded-full bg-muted mb-4">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">No jobs posted yet</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                Start reaching talented candidates by posting your first job listing today.
                            </p>
                            <Link href="/jobs/post">
                                <Button className="mt-6">Create Post</Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    jobs.map(job => (
                        <Card key={job.id} className={`p-6 transition-all hover:shadow-md ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg hover:text-primary cursor-pointer line-clamp-1">
                                        <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{job.company_name}</span>
                                        <span>•</span>
                                        <span className="capitalize">{job.type?.replace(/-/g, ' ')}</span>
                                        <span>•</span>
                                        <span className="capitalize">{job.location_type}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Desktop Quick Actions */}
                                    <div className="hidden sm:flex items-center gap-2">
                                        <Button size="sm" variant="outline" asChild className="gap-2">
                                            <Link href={`/dashboard/applicants/${job.id}`}>
                                                <Users className="h-4 w-4" /> Applicants
                                            </Link>
                                        </Button>
                                        <Button size="sm" variant="outline" asChild className="gap-2">
                                            <Link href={`/jobs/post?edit=${job.id}`}>
                                                <Edit className="h-4 w-4" /> Edit
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* More Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                {isPending ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <MoreVertical className="h-4 w-4" />}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/jobs/${job.id}`} className="gap-2">
                                                    <ExternalLink className="h-4 w-4" /> View Live Listing
                                                </Link>
                                            </DropdownMenuItem>

                                            {/* Mobile-only view applicants/edit */}
                                            <DropdownMenuItem asChild className="sm:hidden">
                                                <Link href={`/dashboard/applicants/${job.id}`} className="gap-2">
                                                    <Users className="h-4 w-4" /> View Applicants
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="sm:hidden">
                                                <Link href={`/jobs/post?edit=${job.id}`} className="gap-2">
                                                    <Edit className="h-4 w-4" /> Edit Listing
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                                                onSelect={(e) => {
                                                    if (!confirm('Are you sure? This listing and all its applications will be permanently deleted.')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                <form action={formAction} className="flex items-center gap-2 w-full">
                                                    <input type="hidden" name="job_id" value={job.id} />
                                                    <Trash2 className="h-4 w-4" />
                                                    <button type="submit" className="flex-1 text-left">Delete Posting</button>
                                                </form>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
