"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Job, Application } from "@/types/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, Calendar, MapPin, ExternalLink, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChatWindow } from "@/components/dashboard/chat-window";
import { getOrCreateConversation } from "@/app/dashboard/applicants/actions";
import { toast } from "sonner";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type JobWithEmployer = Job & { profiles: Profile | null };
type ApplicationWithJob = Application & {
    jobs: JobWithEmployer | null;
};

export function SeekerView() {
    const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState<{
        conversationId: string;
        application: ApplicationWithJob;
    } | null>(null);
    const [isChatOpening, setIsChatOpening] = useState(false);

    useEffect(() => {
        async function fetchApplications() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from("applications")
                    .select("*, jobs:job_id(*, profiles:employer_id(*))")
                    .eq("seeker_id", user.id)
                    .order("applied_at", { ascending: false });

                if (error) throw error;
                setApplications(data || []);
            } catch (error) {
                console.error("Error fetching seeker applications:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchApplications();
    }, []);

    const handleOpenChat = async (application: ApplicationWithJob) => {
        if (!application.jobs?.employer_id) return;
        setIsChatOpening(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const result = await getOrCreateConversation(
                application.job_id,
                user.id,
                application.jobs.employer_id
            );

            if (result.conversationId) {
                setActiveChat({
                    conversationId: result.conversationId,
                    application
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

    const getStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
            case "reviewed": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "shortlisted": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "rejected": return "bg-red-500/10 text-red-600 border-red-500/20";
            default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Finding your applications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Your Applications</h2>
                <p className="text-muted-foreground mt-1">
                    Track the status of jobs you've applied to.
                </p>
            </div>

            {applications.length === 0 ? (
                <Card className="border-dashed py-16">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                        <div className="bg-primary/5 p-4 rounded-full mb-4">
                            <Briefcase className="h-10 w-10 text-primary/40" />
                        </div>
                        <h3 className="text-xl font-semibold">No applications yet</h3>
                        <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                            You haven't applied to any jobs yet. Browse our current listings to find your next opportunity.
                        </p>
                        <Link href="/jobs">
                            <Button size="lg" className="gap-2">
                                Browse Jobs <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {applications.map((app) => (
                        <Card key={app.id} className="group overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between md:justify-start md:gap-4">
                                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-1">
                                                {app.jobs?.title || "Deleted Job"}
                                            </h3>
                                            <Badge variant="outline" className={`${getStatusColor(app.status)} capitalize px-2.5 py-0.5 font-medium`}>
                                                {app.status || "Pending"}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5 font-medium text-foreground/80">
                                                <Briefcase className="h-4 w-4" />
                                                {app.jobs?.company_name}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                {app.jobs?.location || "Remote"}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                Applied {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2 text-primary hover:text-primary hover:bg-primary/5"
                                            onClick={() => handleOpenChat(app)}
                                            disabled={isChatOpening}
                                        >
                                            <MessageSquare className="h-4 w-4" /> Message Employer
                                        </Button>

                                        <Button variant="outline" size="sm" asChild className="gap-2 text-xs font-semibold">
                                            <Link href={`/jobs/${app.job_id}`}>
                                                <ExternalLink className="h-3.5 w-3.5" /> View Listing
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Chat Sheet */}
            <Sheet open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
                <SheetContent side="right" className="sm:max-w-[500px] p-0">
                    <SheetHeader className="p-6 border-b sr-only">
                        <SheetTitle>Chat with {activeChat?.application.jobs?.company_name}</SheetTitle>
                    </SheetHeader>
                    {activeChat && (
                        <ChatWindow
                            conversationId={activeChat.conversationId}
                            otherParticipant={{
                                id: activeChat.application.jobs?.employer_id || "",
                                full_name: activeChat.application.jobs?.company_name || "Employer",
                                avatar_url: activeChat.application.jobs?.profiles?.avatar_url || null
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
