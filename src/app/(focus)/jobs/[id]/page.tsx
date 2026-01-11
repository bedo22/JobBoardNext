import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Clock, DollarSign, Briefcase, CheckCircle } from "lucide-react"
import { ApplyDialog } from "@/components/features/jobs/apply-dialog"
import { formatDistanceToNow } from "date-fns"
import ReactMarkdown from "react-markdown"
import { ViewTracker } from "@/components/features/jobs/view-tracker"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single()

  if (!job) return { title: "Job Not Found" }

  return {
    title: `${job.title} at ${job.company_name} | JobBoard`,
    description: `Apply for the ${job.title} position at ${job.company_name}. Salary: ${job.salary_min?.toLocaleString() ?? "Competitive"} - ${job.salary_max?.toLocaleString() ?? ""}`,
    openGraph: {
      title: `${job.title} at ${job.company_name}`,
      description: `We are hiring a ${job.title}. ${job.location_type === "remote" ? "Remote" : job.location}. Apply now!`,
      type: "article",
      publishedTime: job.created_at,
      authors: [job.company_name],
    },
  }
}

export default async function FocusJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [jobResponse, userResponse] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", id).single(),
    supabase.auth.getUser(),
  ])

  const job = jobResponse.data
  const user = userResponse.data.user

  if (!job) {
    notFound()
  }

  let alreadyApplied = false
  if (user) {
    const { data } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("seeker_id", user.id)
      .maybeSingle()
    alreadyApplied = !!data
  }

  const salary =
    job.salary_min && job.salary_max
      ? `${job.salary_min.toLocaleString()}–${job.salary_max.toLocaleString()} EGP`
      : job.salary_min
        ? `${job.salary_min.toLocaleString()} EGP+`
        : "Competitive salary"

  const postedTime = job.created_at
    ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true })
    : "Recently"

  return (
    <>
      <ViewTracker jobId={id} />

      {/* Back button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      {/* Job Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{job.title}</h1>
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <p className="text-xl font-semibold text-primary">{job.company_name}</p>
          <div className="flex gap-2">
            <Badge variant="secondary" className="capitalize">
              {job.type?.replace("-", " ")}
            </Badge>
            {job.location_type === "remote" && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Remote
              </Badge>
            )}
            {job.location_type === "hybrid" && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Hybrid
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 gap-4 py-6 border-y mb-8">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-medium">
              {job.location_type === "remote"
                ? "Remote"
                : job.location_type === "hybrid"
                  ? "Hybrid"
                  : job.location || "On-site"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Salary</p>
            <p className="text-sm font-medium">{salary}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Posted</p>
            <p className="text-sm font-medium">{postedTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm font-medium capitalize">{job.type}</p>
          </div>
        </div>
      </div>

      {/* Apply CTA - Sticky on mobile */}
      <Card className="mb-8 sticky top-16 z-30">
        <CardContent className="py-4">
          {user ? (
            user.id === job.employer_id ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  You posted this job
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/applicants/${job.id}`}>
                    Manage applicants
                  </Link>
                </Button>
              </div>
            ) : alreadyApplied ? (
              <div className="flex items-center gap-3 justify-center py-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">You have already applied!</span>
              </div>
            ) : (
              <ApplyDialog jobTitle={job.title} jobId={job.id} />
            )
          ) : (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Sign in to apply
              </span>
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.requirements.map((req: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.benefits.map((ben: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  )
}
