import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Building2, MapPin, Calendar, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import type { Application, Job } from "@/types/app";

type ApplicationWithJob = Application & { job: Job };

export default async function ApplicationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch applications with job details
    const { data: rawApplications, error } = await supabase
        .from("applications")
        .select(`
            *,
            job:jobs(*)
        `)
        .eq("seeker_id", user.id)
        .order("applied_at", { ascending: false });

    if (error) {
        console.error("Error fetching applications:", error);
    }

    const applications = (rawApplications || []) as unknown as ApplicationWithJob[];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
            case 'reviewing': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'interviewing': return 'bg-purple-500/10 text-purple-600 border-purple-200';
            case 'hired': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight">My Applications</h1>
                <p className="text-muted-foreground font-medium text-lg">
                    Track the progress of your {applications?.length || 0} applications.
                </p>
            </div>

            {applications && applications.length > 0 ? (
                <div className="grid gap-4">
                    {applications.map((app) => (
                        <Card key={app.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-stretch">
                                    {/* Left side: Job Info */}
                                    <div className="flex-1 p-6 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold hover:text-primary transition-colors">
                                                    <Link href={`/jobs/${app.job.id}`}>{app.job.title}</Link>
                                                </h3>
                                                <div className="flex items-center gap-2 text-muted-foreground font-semibold mt-1">
                                                    <Building2 className="h-4 w-4" />
                                                    <span>{app.job.company_name}</span>
                                                </div>
                                            </div>
                                            <Badge className={getStatusColor(app.status || 'pending')}>
                                                {(app.status || 'pending').toUpperCase()}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                <span>{app.job.location || app.job.location_type}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                <span>Applied on {format(new Date(app.applied_at), 'MMM dd, yyyy')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side: Actions */}
                                    <div className="bg-muted/30 p-6 flex md:flex-col justify-between items-center gap-3 border-t md:border-t-0 md:border-l border-border/50">
                                        <Button variant="outline" size="sm" className="w-full md:w-32 font-bold" asChild>
                                            <Link href={`/jobs/${app.job.id}`}>
                                                <ExternalLink className="h-4 w-4 mr-2" /> View Job
                                            </Link>
                                        </Button>
                                        <Button variant="secondary" size="sm" className="w-full md:w-32 font-bold" asChild>
                                            <Link href={`/messages/${app.id}`}>
                                                <MessageCircle className="h-4 w-4 mr-2" /> Message
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 rounded-[3rem] border-4 border-dashed border-muted bg-muted/5 text-center">
                    <div className="p-6 rounded-full bg-muted/10 w-fit mb-6">
                        <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
                    </div>
                    <h2 className="text-2xl font-black mb-2 italic">No applications yet</h2>
                    <p className="text-muted-foreground mb-10 font-bold max-w-sm">
                        Apply to jobs to see them tracked here. Good luck with your search!
                    </p>
                    <Link href="/jobs">
                        <Button size="lg" className="rounded-2xl font-black px-8 shadow-xl shadow-primary/20">
                            Find Jobs
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}