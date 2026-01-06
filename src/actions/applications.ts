"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotification } from "./notifications";

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

    // Fetch seeker_id and job title for notification
    const { data: application } = await supabase
        .from("applications")
        .select("seeker_id, jobs(title)")
        .eq("id", applicationId)
        .single();

    const { error: updateError } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", applicationId);

    if (updateError) {
        console.error("Update status error:", updateError);
        return { error: "Failed to update status" };
    }

    // Trigger Notification
    if (application && application.seeker_id) {
        await sendNotification({
            userId: application.seeker_id,
            type: 'status_change',
            title: "Application Updated",
            message: `Your application for "${((application.jobs as unknown) as { title: string })?.title || 'Position'}" is now ${status}.`,
            link: '/dashboard'
        });
    }

    revalidatePath(`/dashboard/applicants/${jobId}`);
    revalidatePath("/dashboard"); // For seeker view updates

    return { success: true };
}

export async function submitApplication({
    jobId,
    coverLetter,
    resumeUrl
}: {
    jobId: string;
    coverLetter: string;
    resumeUrl: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // 1. Fetch job details to find employer and title
    const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('employer_id, title')
        .eq('id', jobId)
        .single();

    if (jobError || !job) return { error: "Job not found" };

    // 2. Insert application
    const { data: app, error } = await supabase
        .from('applications')
        .insert({
            job_id: jobId,
            seeker_id: user.id,
            cover_letter: coverLetter,
            resume_url: resumeUrl,
        })
        .select('*, profiles:seeker_id(full_name)')
        .single();

    if (error) {
        console.error("Application error:", error);
        return { error: "Failed to submit application" };
    }

    // 3. Notify Employer
    await sendNotification({
        userId: job.employer_id,
        type: 'status_change',
        title: "New Applicant",
        message: `${(app.profiles as { full_name: string })?.full_name || 'A candidate'} applied for "${job.title}".`,
        link: `/dashboard/applicants/${jobId}`
    });

    revalidatePath(`/dashboard/applicants/${jobId}`);
    return { success: true };
}
