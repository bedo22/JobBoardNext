"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const jobSchema = z.object({
    title: z.string().min(3),
    company_name: z.string().min(2),
    location: z.string().optional(),
    type: z.enum(["full-time", "part-time", "contract", "internship"]),
    location_type: z.enum(["onsite", "remote", "hybrid"]),
    salary_min: z.number().optional(),
    salary_max: z.number().optional(),
    description: z.string().min(50),
    requirements: z.string(),
    benefits: z.string().optional(),
});

export type JobFormState = {
    error?: string;
    success?: boolean;
};

export async function postJob(prevState: JobFormState, formData: FormData): Promise<JobFormState> {
    const supabase = await createClient();

    // 1. Check Auth (Secure Server-Side Check)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: "You must be logged in to post a job." };
    }

    // 2. Extract & Validate Data
    const rawData = {
        title: formData.get("title"),
        company_name: formData.get("company_name"),
        location: formData.get("location"),
        type: formData.get("type"),
        location_type: formData.get("location_type"),
        salary_min: Number(formData.get("salary_min")) || undefined,
        salary_max: Number(formData.get("salary_max")) || undefined,
        description: formData.get("description"),
        requirements: formData.get("requirements"),
        benefits: formData.get("benefits"),
    };

    const validatedFields = jobSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Invalid form data. Please check your inputs." };
    }

    const { data } = validatedFields;

    // 3. Insert into Database
    const { error } = await supabase.from("jobs").insert({
        ...data,
        employer_id: user.id,
        requirements: data.requirements.split("\n").filter((r) => r.trim()),
        benefits: data.benefits?.split("\n").filter((b) => b.trim()) || [],
    });

    if (error) {
        console.error("Database Error:", error);
        return { error: "Failed to post job. Please try again." };
    }

    // 4. Revalidate & Redirect
    revalidatePath("/jobs");
    redirect("/jobs");
}
