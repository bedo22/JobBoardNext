"use server";

import { createClient } from "@/lib/supabase/server";

export async function incrementJobView(jobId: string) {
    const supabase = await createClient();
    
    // We use a RPC (Remote Procedure Call) to increment the counter safely
    // This prevents race conditions
    const { error } = await supabase.rpc('increment_job_views', { job_id: jobId });

    if (error) {
        // Fallback to manual increment if RPC doesn't exist yet
        const { data } = await supabase
            .from('jobs')
            .select('views_count')
            .eq('id', jobId)
            .single();
            
        await supabase
            .from('jobs')
            .update({ views_count: (data?.views_count || 0) + 1 })
            .eq('id', jobId);
    }
}

// ✅ SECURE: The server determines identity from the session
export async function getEmployerJobsWithStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const employerId = user.id;

    // Fetch all jobs for the employer with applicant counts
    const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*, applications(count)')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error fetching employer jobs: ${error.message}`);
    }

    // Transform the data to match the Job type with applicants_count
    type RawJobWithCount = {
        applications: { count: number }[];
        created_at: string;
        [key: string]: unknown;
    };

    const jobs = (jobsData as unknown as RawJobWithCount[]).map((job) => ({
        ...job,
        applicants_count: job.applications?.[0]?.count || 0
    }));

    // Calculate stats
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    
    // safe because we know created_at is a string from Supabase
    const newThisWeek = jobs.filter((job) => new Date(job.created_at as string).getTime() > oneWeekAgo.getTime()).length;

    return {
        // Cast to unknown first to avoid "Type '...[]' is missing properties..."
        // Then cast to Job[] because we essentially have Job + applicants_count
        jobs: (jobs as unknown) as import("@/types/app").Job[],
        stats: {
            newThisWeek
        }
    };
}
