"use client";

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Job } from "@/types/app"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { getEmployerJobsWithStats } from "@/actions/jobs"

// Modular Views
import { OverviewView } from "@/components/features/dashboard/overview-view"
import { SeekerView } from "@/components/features/dashboard/seeker-view"

export default function DashboardPage() {
  const { profile, isEmployer, isSeeker, loading: isAuthLoading } = useAuth()
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [jobStats, setJobStats] = useState<{ newThisWeek: number }>({ newThisWeek: 0 })
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    async function fetchEmployerData() {
      if (!profile?.id) return;
      try {
        const result = await getEmployerJobsWithStats(profile.id);
        setMyJobs(result.jobs);
        setJobStats(result.stats);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    if (isEmployer) {
      fetchEmployerData();
    } else if (isSeeker) {
      // No extra data needed for seeker dash yet, handled in SeekerView
      setIsLoadingData(false);
    } else if (!isAuthLoading) {
      setIsLoadingData(false);
    }
  }, [isEmployer, isSeeker, profile, isAuthLoading])

  if (isAuthLoading || isLoadingData) {
    return (
      <div className="container py-32 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  // Role-based Layouts
  if (isSeeker) {
    return (
      <div className="container py-10 max-w-5xl">
        <SeekerView />
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
          <OverviewView jobs={myJobs} newThisWeek={jobStats.newThisWeek} onSwitchTab={() => {}} />
        </div>
      </div>
    )

  // Default Fallback
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
