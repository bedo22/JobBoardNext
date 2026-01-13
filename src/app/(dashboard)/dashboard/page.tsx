import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/app";
import Link from "next/link";
import { getEmployerJobsWithStats } from "@/actions/jobs";

// Modular Views
import { OverviewView } from "@/components/features/dashboard/overview-view";
import { SeekerView } from "@/components/features/dashboard/seeker-view";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const role = profile?.role;
    const isEmployer = role === "employer";
    const isSeeker = role === "seeker";

    // Data containers
    let myJobs: Job[] = [];
    let jobStats = { newThisWeek: 0 };
    let seekerApplications: import("@/types/app").ApplicationWithJobAndEmployer[] = [];

    // Fetch data based on role
    if (isEmployer) {
        const result = await getEmployerJobsWithStats();
        myJobs = result.jobs;
        jobStats = result.stats;
    } else if (isSeeker) {
        const { data: applications } = await supabase
            .from("applications")
            .select("*, jobs!job_id(*, profiles!employer_id(*))")
            .eq("seeker_id", user.id)
            .order("applied_at", { ascending: false });
        seekerApplications = applications || [];
    }

    if (!role) {
        return (
            <div className="container py-20 text-center max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-4">Setup Required</h1>
                <p className="text-muted-foreground mb-8">
                    Your profile is missing a role. Please complete your registration to access the dashboard.
                </p>
                <Link href="/">
                    <Button size="lg" className="w-full">Return Home</Button>
                </Link>
            </div>
        );
    }

    if (isSeeker) {
        return (
            <div className="container py-10 max-w-5xl">
                <SeekerView initialApplications={seekerApplications} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Overview</h1>
                    <p className="text-muted-foreground mt-1 font-semibold">
                        Welcome back, {profile?.full_name || 'Employer'}.
                    </p>
                </div>
                <Link href="/jobs/post">
                    <Button size="lg" className="shadow-lg rounded-2xl font-black px-8">Post New Job</Button>
                </Link>
            </div>

            <div className="mt-0">
                <OverviewView jobs={myJobs} newThisWeek={jobStats.newThisWeek} />
            </div>
        </div>
    );
}
