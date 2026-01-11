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

export async function getEmployerJobsWithStats(employerId: string) {
    const supabase = await createClient();

    // Fetch all jobs for the employer
    const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error fetching employer jobs: ${error.message}`);
    }

    // Calculate stats
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    
    const newThisWeek = jobs.filter(job => new Date(job.created_at) > oneWeekAgo).length;

    return {
        jobs: jobs || [],
        stats: {
            newThisWeek
        }
    };
}
