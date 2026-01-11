"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateProfileBio as generateBio } from "@/lib/ai";
import { profileSchema } from "@/lib/validation";

export async function updateProfile(rawData: unknown) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    // 1. Validate Input with Zod (Strict Shape Check)
    const result = profileSchema.safeParse(rawData);

    if (!result.success) {
        return { error: "Invalid data: " + result.error.issues[0].message };
    }

    const data = result.data;

    // 2. White-listing (Manual mapping ensures NO other fields slip through)
    // Even though Zod handles this, manual mapping is a double-safety for critical updates.
    const safeUpdate = {
        full_name: data.full_name,
        company_name: data.company_name,
        bio: data.bio,
        website_url: data.website_url,
        github_url: data.github_url,
        linkedin_url: data.linkedin_url,
        twitter_url: data.twitter_url,
        skills: data.skills,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from("profiles")
        .update(safeUpdate)
        .eq("id", user.id);

    if (error) {
        console.error("Update profile error:", error);
        return { error: "Failed to update profile" };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return { success: true };
}

export async function generateAiBio(params: {
    name: string;
    role: string;
    skills: string[];
    experience?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    try {
        const bio = await generateBio(params);
        return { bio };
    } catch {
        return { error: "Failed to generate bio" };
    }
}