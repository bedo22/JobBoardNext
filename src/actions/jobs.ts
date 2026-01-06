'use server'

import { supabase } from "@/lib/supabaseClient";
import { Job } from "@/types/app";

/**
 * Increments the view count for a specific job.
 * uses a secure RPC to bypass RLS for this specific operation.
 */
export async function incrementJobView(jobId: string) {
    if (!jobId) return;

    try {
        const { error } = await supabase.rpc('increment_view_count', {
            job_id: jobId
        });

        if (error) {
            console.error("Error incrementing job view:", error);
            return { error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("Unexpected error incrementing job view:", error);
        return { error: "Failed to increment view count" };
    }
}

/**
 * Fetches employer's jobs with calculated statistics
 * Calculates newThisWeek on the server to avoid client-side impure functions
 */
export async function getEmployerJobsWithStats(employerId: string) {
    if (!employerId) {
        return { jobs: [], stats: { newThisWeek: 0 } };
    }

    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*, applications(id)')
            .eq('employer_id', employerId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Failed to fetch jobs:", error);
            return { jobs: [], stats: { newThisWeek: 0 }, error: error.message };
        }

        const jobs = (data || []) as Job[];

        // Calculate statistics on the server
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const newThisWeek = jobs.filter(j => 
            j.created_at && (now - new Date(j.created_at).getTime()) < oneWeek
        ).length;

        return {
            jobs,
            stats: {
                newThisWeek
            }
        };
    } catch (error) {
        console.error("Unexpected error fetching jobs:", error);
        return { jobs: [], stats: { newThisWeek: 0 }, error: "Failed to fetch jobs" };
    }
}
