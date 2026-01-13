"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ApplicationCard } from "./application-card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChatWindow } from "@/components/features/messaging/chat-window";
import { useChat } from "@/hooks/use-chat";

import { ApplicationWithJobAndEmployer } from "@/types/app";

export function SeekerView({ initialApplications = [] }: { initialApplications?: ApplicationWithJobAndEmployer[] }) {
    const [applications, setApplications] = useState<ApplicationWithJobAndEmployer[]>(initialApplications);
    const [loading, setLoading] = useState(initialApplications.length === 0);
    const { activeChat, isChatOpening, openChat, closeChat } = useChat();

    useEffect(() => {
        async function fetchApplications() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from("applications")
                    .select("*, jobs!job_id(*, profiles!employer_id(*))")
                    .eq("seeker_id", user.id)
                    .order("applied_at", { ascending: false });

                if (error) {
                    console.error("Error fetching seeker applications:", error);
                    throw error;
                }
                setApplications(data || []);
            } catch (error) {
                console.error("Error fetching seeker applications:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchApplications();
    }, []);

    const handleOpenChat = async (application: ApplicationWithJobAndEmployer) => {
        if (!application.jobs?.employer_id) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await openChat({
            jobId: application.job_id,
            seekerId: user.id,
            employerId: application.jobs.employer_id,
            participantName: application.jobs.company_name,
            participantAvatar: application.jobs.profiles?.avatar_url || null,
            participantId: application.jobs.employer_id
        });
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
                    Track the status of jobs you&apos;ve applied to.
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
                            You haven&apos;t applied to any jobs yet. Browse our current listings to find your next opportunity.
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
                        <ApplicationCard
                            key={app.id}
                            application={app}
                            onChat={handleOpenChat}
                            isChatOpening={isChatOpening}
                        />
                    ))}
                </div>
            )}

            {/* Chat Sheet */}
            <Sheet open={!!activeChat} onOpenChange={(open) => !open && closeChat()}>
                <SheetContent side="right" className="sm:max-w-[500px] p-0">
                    <SheetHeader className="p-6 border-b sr-only">
                        <SheetTitle>Chat with {activeChat?.participantName}</SheetTitle>
                    </SheetHeader>
                    {activeChat && (
                        <ChatWindow
                            conversationId={activeChat.conversationId}
                            otherParticipant={{
                                id: activeChat.participantId,
                                full_name: activeChat.participantName,
                                avatar_url: activeChat.participantAvatar
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
