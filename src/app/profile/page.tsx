import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { UserCheck, Building2 } from "lucide-react";

export const metadata = {
    title: "Your Profile | JobBoard",
    description: "Manage your professional profile and account settings.",
};

export default async function ProfilePage() {
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
        <div className="min-h-screen bg-muted/30">
            <div className="container py-12 max-w-5xl">
                <header className="mb-10">
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
                        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                            {profile.role || "User"} Account
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Account Settings</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Manage your professional presence and personal information.
                    </p>
                </header>

                <ProfileForm profile={profile} />
            </div>
        </div>
    );
}
