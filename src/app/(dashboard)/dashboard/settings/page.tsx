import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { UserCheck, Building2 } from "lucide-react";

export const metadata = {
    title: "Settings | JobBoard",
    description: "Manage your professional profile and account settings.",
};

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/");
    }

    return (
        <div className="space-y-10">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    {profile.role === "employer" ? (
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Building2 className="h-5 w-5" />
                        </div>
                    ) : (
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    )}
                    <span className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">
                        {profile.role || "User"} Account
                    </span>
                </div>
                <h1 className="text-4xl font-black tracking-tight italic">Account Settings</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Manage your professional presence and personal information.
                </p>
            </header>

            <ProfileForm profile={profile} />
        </div>
    );
}