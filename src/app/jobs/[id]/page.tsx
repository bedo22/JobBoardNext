
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Clock, DollarSign, Briefcase, CheckCircle } from "lucide-react"
import { ApplyDialog } from "@/components/features/jobs/apply-dialog"
import { formatDistanceToNow } from "date-fns"
import ReactMarkdown from 'react-markdown'
import { ViewTracker } from "@/components/features/jobs/view-tracker"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()
    const { data: job } = await supabase.from('jobs').select('*').eq('id', id).single()

    if (!job) return { title: 'Job Not Found' }

    return {
        title: `${job.title} at ${job.company_name} | JobBoard`,
        description: `Apply for the ${job.title} position at ${job.company_name}. Salary: ${job.salary_min?.toLocaleString() ?? "Competitive"} - ${job.salary_max?.toLocaleString() ?? ""}`,
        openGraph: {
            title: `${job.title} at ${job.company_name}`,
            description: `We are hiring a ${job.title}. ${job.location_type === 'remote' ? 'Remote' : job.location}. Apply now!`,
            type: 'article',
            publishedTime: job.created_at,
            authors: [job.company_name],
        },
    }
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Fetch Job and User in parallel for speed
    const [jobResponse, userResponse] = await Promise.all([
        supabase.from('jobs').select('*').eq('id', id).single(),
        supabase.auth.getUser()
    ])

    const job = jobResponse.data
    const user = userResponse.data.user

    if (!job) {
        notFound()
    }

    // 2. Check if already applied (Server-Side)
    let alreadyApplied = false
    if (user) {
        const { data } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', id)
            .eq('seeker_id', user.id)
            .maybeSingle()
        alreadyApplied = !!data
    }

    // 3. Format Data
    const salary = job.salary_min && job.salary_max
        ? `${job.salary_min.toLocaleString()}–${job.salary_max.toLocaleString()} EGP`
        : job.salary_min
            ? `${job.salary_min.toLocaleString()} EGP+`
            : 'Competitive salary'

    const postedTime = job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true }) : 'Recently'

    return (
        <div className="container py-10 max-w-5xl">
            {/* View Tracker Client Component */}
            <ViewTracker jobId={id} />
            {/* Back button */}
            <Link href="/jobs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="h-5 w-5" /> Back to jobs
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Job Header */}
                    <div>
                        <h1 className="text-4xl font-bold mb-4 break-words">{job.title}</h1>
                        <div className="flex items-center gap-4 flex-wrap">
                            <p className="text-2xl font-semibold text-primary break-words">{job.company_name}</p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="capitalize">{job.type?.replace('-', ' ')}</Badge>
                                {job.location_type === 'remote' && <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Remote</Badge>}
                                {job.location_type === 'hybrid' && <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Hybrid</Badge>}
                            </div>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">
                                    {job.location_type === 'remote' ? 'Remote' : job.location_type === 'hybrid' ? 'Hybrid' : job.location || 'On-site'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Salary</p>
                                <p className="font-medium">{salary}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Posted</p>
                                <p className="font-medium">{postedTime}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Type</p>
                                <p className="font-medium capitalize">{job.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none dark:prose-invert">
                                <ReactMarkdown>{job.description}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requirements & Benefits */}
                    {job.requirements && job.requirements.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {job.requirements.map((req: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {job.benefits && job.benefits.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Benefits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {job.benefits.map((ben: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <span>{ben}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar - Apply Button */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="pt-6">
                            {user ? (
                                user.id === job.employer_id ? (
                                    <div className="space-y-3">
                                        <div className="text-sm text-muted-foreground text-center">
                                            You posted this job.
                                        </div>
                                        <Button asChild size="lg" variant="outline" className="w-full">
                                            <Link href={`/dashboard/applicants/${job.id}`}>Manage applicants</Link>
                                        </Button>
                                    </div>
                                ) : alreadyApplied ? (
                                    <div className="text-center py-8">
                                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                                        <p className="text-lg font-semibold">You have already applied!</p>
                                    </div>
                                ) : (
                                    <ApplyDialog jobTitle={job.title} jobId={job.id} />
                                )
                            ) : (
                                <div className="space-y-4">
                                    <Button asChild size="lg" className="w-full">
                                        <Link href="/login">Login to Apply</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="w-full">
                                        <Link href="/signup">Sign Up to Apply</Link>
                                    </Button>
                                    <p className="text-center text-sm text-muted-foreground">
                                        You need an account to apply
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
