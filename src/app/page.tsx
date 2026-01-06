import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Briefcase, Users, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { JobCard } from "@/components/features/jobs/job-card"

export const dynamic = 'force-dynamic'

export default async function Index() {
  // Fetch latest 3 jobs
  const { data: latestJobs } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background py-24 min-h-[calc(100svh-4rem)] flex items-center">
        {/* Optional dot grid background */}
        <div className="pointer-events-none absolute inset-0 -z-0 bg-grid-pattern opacity-60 dark:opacity-40" />
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/ blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,theme(colors.primary/8),transparent_60%)]" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Find Your Dream Job <span className="text-primary">Today</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of professionals who found their perfect role through JobBoard.
              New jobs posted every minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs">
                <Button size="lg" className="text-lg px-8">
                  Browse Jobs <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs/post">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Briefcase className="mr-2 h-5 w-5" /> Post a Job
                </Button>
              </Link>
            </div>

            {/* Category chips */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/jobs?search=frontend"><Button variant="outline" size="sm">Frontend</Button></Link>
              <Link href="/jobs?search=backend"><Button variant="outline" size="sm">Backend</Button></Link>
              <Link href="/jobs?type=full-time"><Button variant="outline" size="sm">Full-time</Button></Link>
              <Link href="/jobs?type=contract"><Button variant="outline" size="sm">Contract</Button></Link>
              <Link href="/jobs?remote=true"><Button variant="outline" size="sm">Remote</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs - New Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Opportunities</h2>
            <Link href="/jobs">
              <Button variant="ghost">View All Jobs →</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestJobs && latestJobs.length > 0 ? (
              latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground mb-4">No jobs posted yet.</p>
                <Link href="/jobs/post">
                  <Button>Be the first to post!</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Jobs</h3>
              <p className="text-muted-foreground">Fresh opportunities verified daily</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Companies</h3>
              <p className="text-muted-foreground">From innovative startups to enterprises</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Applications</h3>
              <p className="text-muted-foreground">Apply in less than 60 seconds</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}