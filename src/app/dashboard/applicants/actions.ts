"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatus(
    applicationId: string,
    status: string,
    jobId: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    // Verify ownership of the job
    const { data: job, error: jobError } = await supabase
        .from("jobs")
        .select("employer_id")
        .eq("id", jobId)
        .single();

    if (jobError || !job || job.employer_id !== user.id) {
        return { error: "Not authorized to manage this job's applications" };
    }

    const { error: updateError } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", applicationId);

    if (updateError) {
        console.error("Update status error:", updateError);
        return { error: "Failed to update status" };
    }

    revalidatePath(`/dashboard/applicants/${jobId}`);
    revalidatePath("/dashboard"); // For seeker view updates

    return { success: true };
}

export async function getOrCreateConversation(
    jobId: string,
    seekerId: string,
    employerId: string
) {
    const supabase = await createClient();

    // Check if conversation exists
    const { data: existing, error: fetchError } = await supabase
        .from("conversations")
        .select("*")
        .eq("job_id", jobId)
        .eq("seeker_id", seekerId)
        .eq("employer_id", employerId)
        .single();

    if (existing) {
        return { conversationId: existing.id };
    }

    // Create new conversation
    const { data: created, error: createError } = await supabase
        .from("conversations")
        .insert({
            job_id: jobId,
            seeker_id: seekerId,
            employer_id: employerId,
        })
        .select()
        .single();

    if (createError) {
        console.error("Create conversation error:", createError);
        return { error: "Failed to start conversation" };
    }

    return { conversationId: created.id };
}
