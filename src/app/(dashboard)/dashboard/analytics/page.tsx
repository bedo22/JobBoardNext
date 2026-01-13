import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getEmployerJobsWithStats } from "@/actions/jobs";
import { AnalyticsView } from "@/components/features/dashboard/analytics-view";

export default async function AnalyticsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Employer Data
    const result = await getEmployerJobsWithStats();

    return (
        <AnalyticsView 
            jobs={result.jobs} 
            title="Analytics" 
            description="Global metrics and conversion performance." 
        />
    )
}
