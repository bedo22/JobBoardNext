"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateProfileBio } from "@/lib/ai";
import { Database } from "@/types/supabase";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function updateProfile(data: ProfileUpdate) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

    if (error) {
        console.error("Update profile error:", error);
        return { error: "Failed to update profile" };
    }

    revalidatePath("/profile");
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
        const bio = await generateProfileBio(params);
        return { bio };
    } catch (error) {
        return { error: "Failed to generate bio" };
    }
}
