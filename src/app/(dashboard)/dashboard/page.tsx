"use client";

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Job } from "@/types/app"
import Link from "next/link"
import { Loader2, LayoutDashboard, BarChart3, ListChecks } from "lucide-react"
import { getEmployerJobsWithStats } from "@/actions/jobs"

// Modular Views
import { OverviewView } from "@/components/features/dashboard/overview-view"
import { AnalyticsView } from "@/components/features/dashboard/analytics-view"
import { JobManagementView } from "@/components/features/dashboard/job-management-view"
import { SeekerView } from "@/components/features/dashboard/seeker-view"

export default function DashboardPage() {
  const { profile, isEmployer, isSeeker, loading: isAuthLoading } = useAuth()
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [jobStats, setJobStats] = useState<{ newThisWeek: number }>({ newThisWeek: 0 })
  const [activeTab, setActiveTab] = useState("overview")
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

  if (isEmployer) {
    return (
      <div className="container py-10 max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Employer Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile?.full_name || 'Employer'}. Manage your listings and track performance.
            </p>
          </div>
          <Link href="/jobs/post">
            <Button size="lg" className="shadow-sm">Post New Job</Button>
          </Link>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full md:w-auto">
            <TabsTrigger value="overview" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2">
              <BarChart3 className="h-4 w-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="manage" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2">
              <ListChecks className="h-4 w-4" /> Manage Jobs
            </TabsTrigger>
          </TabsList>

          <div className="mt-2 min-h-[400px]">
            <TabsContent value="overview" className="m-0 focus-visible:outline-none">
              <OverviewView jobs={myJobs} newThisWeek={jobStats.newThisWeek} onSwitchTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="analytics" className="m-0 focus-visible:outline-none">
              <AnalyticsView jobs={myJobs} />
            </TabsContent>

            <TabsContent value="manage" className="m-0 focus-visible:outline-none">
              <JobManagementView jobs={myJobs} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    )
  }

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
