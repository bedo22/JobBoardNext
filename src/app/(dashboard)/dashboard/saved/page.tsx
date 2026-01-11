import { createClient } from "@/lib/supabase/server";
import { JobCard } from "@/components/features/jobs/job-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Job } from "@/types/app";

export default async function SavedJobsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch saved jobs with job details
    const { data: savedJobs, error } = await supabase
        .from("saved_jobs")
        .select(`
            *,
            job:jobs(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching saved jobs:", error);
    }

    const jobs = (savedJobs?.map(s => s.job).filter(Boolean) || []) as unknown as Job[];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight">Saved Jobs</h1>
                <p className="text-muted-foreground font-medium text-lg">
                    {jobs.length} {jobs.length === 1 ? "job" : "jobs"} you have bookmarked.
                </p>
            </div>

            {jobs.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 rounded-[3rem] border-4 border-dashed border-muted bg-muted/5 text-center">
                    <div className="p-6 rounded-full bg-muted/10 w-fit mb-6">
                        <Heart className="h-12 w-12 text-muted-foreground opacity-20" />
                    </div>
                    <h2 className="text-2xl font-black mb-2 italic">No saved jobs yet</h2>
                    <p className="text-muted-foreground mb-10 font-bold max-w-sm">
                        Start exploring the board and save jobs you&apos;re interested in for later.
                    </p>
                    <Link href="/jobs">
                        <Button size="lg" className="rounded-2xl font-black px-8 shadow-xl shadow-primary/20">
                            Explore Jobs
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}