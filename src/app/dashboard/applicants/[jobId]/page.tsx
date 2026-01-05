"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, FileText, Download, CheckCircle2, XCircle, Clock, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateApplicationStatus, getOrCreateConversation } from "../actions";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChatWindow } from "@/components/dashboard/chat-window";
import { MessageSquare } from "lucide-react";
import type { Job, ApplicationWithProfile } from "@/types/app";

export default function JobApplicantsPage() {
    const { isEmployer, loading: isAuthLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const jobId = params?.jobId as string;

    const [job, setJob] = useState<Job | null>(null);
    const [applicants, setApplicants] = useState<ApplicationWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [activeChat, setActiveChat] = useState<{
        conversationId: string;
        applicant: ApplicationWithProfile;
    } | null>(null);
    const [isChatOpening, setIsChatOpening] = useState(false);

    const fetchApplicants = async () => {
        try {
            const { data: appsData, error: appsError } = await supabase
                .from("applications")
                .select("*, profiles:seeker_id(*)")
                .eq("job_id", jobId)
                .order("applied_at", { ascending: false });

            if (appsError) throw appsError;
            setApplicants(appsData || []);
        } catch (error) {
            console.error("Error fetching applicants:", error);
        }
    };

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

                if (jobError) throw jobError;
                setJob(jobData);

                // 2. Fetch Applications
                await fetchApplicants();

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchData();
        }
    }, [isEmployer, isAuthLoading, jobId, router]);

    const handleStatusChange = async (appId: string, newStatus: string) => {
        startTransition(async () => {
            const result = await updateApplicationStatus(appId, newStatus, jobId);
            if (result.success) {
                toast.success(`Status updated to ${newStatus}`);
                fetchApplicants(); // Refresh list
            } else {
                toast.error(result.error || "Failed to update status");
            }
        });
    };

    const handleOpenChat = async (applicant: ApplicationWithProfile) => {
        if (!job || !applicant.profiles) return;
        setIsChatOpening(true);
        try {
            const result = await getOrCreateConversation(jobId, applicant.seeker_id, job.employer_id);
            if (result.conversationId) {
                setActiveChat({
                    conversationId: result.conversationId,
                    applicant
                });
            } else {
                toast.error(result.error || "Could not open chat");
            }
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Failed to start conversation");
        } finally {
            setIsChatOpening(false);
        }
    };

    const getStatusIcon = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case "shortlisted": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
            case "reviewed": return <Search className="h-4 w-4 text-blue-500" />;
            default: return <Clock className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getStatusBadgeClass = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case "shortlisted": return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20";
            case "rejected": return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
            case "reviewed": return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
            default: return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
        }
    };

    if (isAuthLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading applicants...</p>
            </div>
        );
    }

    return (
        <div className="container py-10 max-w-5xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
            </Button>

            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Applicants for {job?.title}</h1>
                <p className="text-muted-foreground mt-2 text-lg">{applicants.length} candidates applied</p>
            </div>

            <div className="grid gap-6">
                {applicants.length === 0 ? (
                    <Card className="p-16 text-center border-dashed">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-4 rounded-full bg-muted mb-4">
                                <Search className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-medium">No applications yet</h3>
                            <p className="text-muted-foreground mt-2">Check back later once candidates start applying.</p>
                        </div>
                    </Card>
                ) : (
                    applicants.map((app) => (
                        <Card key={app.id} className={`overflow-hidden transition-all hover:shadow-md ${isPending ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center p-8">
                                    <div className="flex items-center gap-5 flex-1">
                                        <Avatar className="h-14 w-14 ring-2 ring-primary/5">
                                            <AvatarImage src={app.profiles?.avatar_url ?? undefined} alt={app.profiles?.full_name ?? 'Applicant'} />
                                            <AvatarFallback className="bg-primary/5 text-primary text-xl font-semibold">
                                                {app.profiles?.full_name?.charAt(0) || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-xl">{app.profiles?.full_name || "Unknown Applicant"}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                Applied {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                                        <div className="flex gap-2">
                                            {app.resume_url && (
                                                <Button variant="outline" size="sm" asChild className="gap-2">
                                                    <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                                                        <Download className="h-4 w-4" /> Resume
                                                    </a>
                                                </Button>
                                            )}
                                            {app.cover_letter && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="secondary" size="sm" className="gap-2">
                                                            <FileText className="h-4 w-4" /> Cover Letter
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Cover Letter - {app.profiles?.full_name}</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 max-h-[60vh] overflow-y-auto pr-4">
                                                            {app.cover_letter}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleOpenChat(app)}
                                            disabled={isChatOpening}
                                        >
                                            <MessageSquare className="h-4 w-4" /> Message
                                        </Button>

                                        <div className="h-8 w-px bg-border hidden lg:block" />

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild disabled={isPending}>
                                                <Button
                                                    variant="ghost"
                                                    className={`gap-2 font-medium border ${getStatusBadgeClass(app.status)}`}
                                                >
                                                    {getStatusIcon(app.status)}
                                                    <span className="capitalize">{app.status || "Pending"}</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, "pending")} className="gap-2 cursor-pointer">
                                                    <Clock className="h-4 w-4 text-yellow-500" /> Pending
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, "reviewed")} className="gap-2 cursor-pointer">
                                                    <Search className="h-4 w-4 text-blue-500" /> Reviewed
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, "shortlisted")} className="gap-2 cursor-pointer">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Shortlisted
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, "rejected")} className="gap-2 cursor-pointer">
                                                    <XCircle className="h-4 w-4 text-red-500" /> Rejected
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Chat Sheet */}
            <Sheet open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
                <SheetContent side="right" className="sm:max-w-[500px] p-0">
                    <SheetHeader className="p-6 border-b sr-only">
                        <SheetTitle>Chat with {activeChat?.applicant.profiles?.full_name}</SheetTitle>
                    </SheetHeader>
                    {activeChat && (
                        <ChatWindow
                            conversationId={activeChat.conversationId}
                            otherParticipant={{
                                id: activeChat.applicant.seeker_id,
                                full_name: activeChat.applicant.profiles?.full_name || "Applicant",
                                avatar_url: activeChat.applicant.profiles?.avatar_url || null
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
