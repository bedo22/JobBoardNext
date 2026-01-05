"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteJob(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }
  const jobId = (formData.get("job_id") || "").toString();
  if (!jobId) {
    return { error: "Missing job id" };
  }

  // Verify ownership
  const { data: existing, error: fetchErr } = await supabase
    .from("jobs")
    .select("id, employer_id")
    .eq("id", jobId)
    .maybeSingle();

  if (fetchErr) {
    console.error("Fetch job error:", fetchErr);
    return { error: "Failed to verify job" };
  }
  if (!existing || existing.employer_id !== user.id) {
    return { error: "Not allowed" };
  }

  // Clean up related rows first if FK doesn't cascade
  await supabase.from("applications").delete().eq("job_id", jobId);

  const { error: delErr } = await supabase.from("jobs").delete().eq("id", jobId);
  if (delErr) {
    console.error("Delete job error:", delErr);
    return { error: "Failed to delete job" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return { success: true };
}
