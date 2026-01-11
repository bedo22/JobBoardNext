"use client";

import { useParams, useRouter } from "next/navigation";
import { ChatWindow } from "@/components/features/messaging/chat-window";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/use-auth";

export default function ConversationPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const conversationId = params.conversationId as string;
    
    const [jobTitle, setJobTitle] = useState<string>("");
    const [employerName, setEmployerName] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchConversationDetails() {
            const { data: conv, error } = await supabase
                .from("conversations")
                .select(`
                    *,
                    jobs:job_id (
                        title
                    ),
                    employer:employer_id (
                        full_name
                    )
                `)
                .eq("id", conversationId)
                .single();

            if (error) {
                console.error("Error fetching conversation:", error);
                setLoading(false);
                return;
            }

            if (!user || conv.seeker_id !== user.id) {
                // Not authorized
                router.push("/messages");
                return;
            }

            setJobTitle((conv.jobs as { title: string })?.title || "");
            setEmployerName((conv.employer as { full_name: string })?.full_name || "");
            setLoading(false);
        }

        fetchConversationDetails();
    }, [conversationId, user, router]);

    if (!user) {
        return (
            <div className="container max-w-4xl mx-auto py-8">
                <p className="text-center text-muted-foreground">Please log in to view messages</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container max-w-4xl mx-auto py-8">
                <p className="text-center text-muted-foreground">Loading conversation...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-4">
            <div className="flex items-center gap-4 mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/messages")}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold">{employerName}</h1>
                    <p className="text-sm text-muted-foreground">{jobTitle}</p>
                </div>
            </div>

            <ChatWindow 
                conversationId={conversationId}
                otherParticipant={{
                    id: '',
                    full_name: employerName,
                    avatar_url: null
                }}
            />
        </div>
    );
}
