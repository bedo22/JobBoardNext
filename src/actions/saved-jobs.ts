"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleSaveJob(jobId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to save jobs." };
    }

    // Check if already saved
    const { data: existing } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_id", jobId)
        .single();

    if (existing) {
        // Unsave
        const { error } = await supabase
            .from("saved_jobs")
            .delete()
            .eq("id", existing.id);

        if (error) return { error: "Failed to unsave job." };
        
        revalidatePath("/dashboard/saved");
        revalidatePath("/jobs");
        return { success: true, saved: false };
    } else {
        // Save
        const { error } = await supabase
            .from("saved_jobs")
            .insert({
                user_id: user.id,
                job_id: jobId,
            });

        if (error) return { error: "Failed to save job." };
        
        revalidatePath("/dashboard/saved");
        revalidatePath("/jobs");
        return { success: true, saved: true };
    }
}

export async function getIsJobSaved(jobId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_id", jobId)
        .single();

    return !!data;
}
