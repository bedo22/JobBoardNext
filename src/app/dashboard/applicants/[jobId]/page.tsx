"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, FileText, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Job, ApplicationWithProfile } from "@/types/app";

export default function JobApplicantsPage() {
    const { isEmployer, loading: isAuthLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const jobId = params?.jobId as string;
    
    const [job, setJob] = useState<Job | null>(null);
    const [applicants, setApplicants] = useState<ApplicationWithProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) return;

        if (!isEmployer) {
            router.push("/dashboard");
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Job Details
                const { data: jobData, error: jobError } = await supabase
                    .from("jobs")
                    .select("*")
                    .eq("id", jobId)
                    .single();
                
                if (jobError) {
                    console.error("Job Fetch Error:", jobError);
                    throw jobError;
                }
                setJob(jobData);

                // 2. Fetch Applications
                // Try simpler fetch if join fails
                const { data: appsData, error: appsError } = await supabase
                    .from("applications")
                    .select("*, profiles:seeker_id(*)")
                    .eq("job_id", jobId)
                    .order("applied_at", { ascending: false });

                if (appsError) {
                    console.warn("Join Fetch Error, trying flat fetch:", appsError);
                    // Fallback to flat fetch if the join fails due to missing FK in metadata
                    const { data: flatApps, error: flatError } = await supabase
                        .from("applications")
                        .select("*")
                        .eq("job_id", jobId)
                        .order("applied_at", { ascending: false });
                    
                    if (flatError) throw flatError;
                    setApplicants(flatApps || []);
                } else {
                    setApplicants(appsData || []);
                }

            } catch (error) {
                console.error("Error fetching applicants:", error);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchData();
        }
    }, [isEmployer, isAuthLoading, jobId, router]);

    if (isAuthLoading || loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="container py-10 max-w-5xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Applicants for {job?.title}</h1>
                <p className="text-muted-foreground">{applicants.length} total applications</p>
            </div>

            <div className="grid gap-4">
                {applicants.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground">No applications yet for this job.</p>
                    </Card>
                ) : (
                    applicants.map((app) => (
                        <Card key={app.id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={app.profiles?.avatar_url ?? undefined} alt={app.profiles?.full_name ?? 'Applicant'} />
                                            <AvatarFallback>{app.profiles?.full_name?.charAt(0) || "?"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg">{app.profiles?.full_name || "Unknown Applicant"}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Applied {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        {app.resume_url && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                                                    <Download className="mr-2 h-4 w-4" /> Resume
                                                </a>
                                            </Button>
                                        )}
                                        {app.cover_letter && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="secondary" size="sm">
                                                        <FileText className="mr-2 h-4 w-4" /> Cover Letter
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Cover Letter</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="mt-4 whitespace-pre-wrap text-sm">
                                                        {app.cover_letter}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
