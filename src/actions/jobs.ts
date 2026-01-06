'use server'

import { supabase } from "@/lib/supabaseClient";

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
