"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Inbox } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

interface Conversation {
    id: string;
    job_id: string;
    seeker_id: string;
    employer_id: string;
    created_at: string;
    updated_at: string;
    jobs: {
        title: string;
        company_name: string | null;
    };
    employer: {
        full_name: string;
        avatar_url: string | null;
    };
    lastMessage?: {
        content: string;
        created_at: string;
        sender_id: string;
    };
    unreadCount: number;
}

export default function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchConversations() {
            if (!user) return; // Additional safety check
            
            const { data: convs, error } = await supabase
                .from("conversations")
                .select(`
                    *,
                    jobs:job_id (
                        title,
                        company_name
                    ),
                    employer:employer_id (
                        full_name,
                        avatar_url
                    )
                `)
                .eq("seeker_id", user.id)
                .order("updated_at", { ascending: false });

            if (error) {
                console.error("Error fetching conversations:", error);
                setLoading(false);
                return;
            }

            // Fetch last message and unread count for each conversation
            const conversationsWithMessages = await Promise.all(
                (convs || []).map(async (conv) => {
                    // Get last message
                    const { data: lastMsg } = await supabase
                        .from("messages")
                        .select("content, created_at, sender_id")
                        .eq("conversation_id", conv.id)
                        .order("created_at", { ascending: false })
                        .limit(1)
                        .single();

                    // Get unread count
                    const { count } = await supabase
                        .from("messages")
                        .select("*", { count: "exact", head: true })
                        .eq("conversation_id", conv.id)
                        .neq("sender_id", user?.id || '')
                        .eq("is_read", false);

                    return {
                        ...conv,
                        lastMessage: lastMsg || undefined,
                        unreadCount: count || 0,
                    };
                })
            );

            setConversations(conversationsWithMessages);
            setLoading(false);
        }

        fetchConversations();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`user-conversations-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                },
                () => {
                    fetchConversations(); // Refresh on new message
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    if (!user) {
        return (
            <div className="container max-w-4xl mx-auto py-8">
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">Please log in to view messages</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Messages
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Inbox className="mb-4 h-12 w-12 text-muted-foreground/30" />
                            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start a conversation by applying to a job
                            </p>
                            <Link
                                href="/jobs"
                                className="text-sm text-primary hover:underline"
                            >
                                Browse Jobs
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {conversations.map((conv) => (
                                <Link
                                    key={conv.id}
                                    href={`/messages/${conv.id}`}
                                    className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={conv.employer.avatar_url || undefined} />
                                        <AvatarFallback>
                                            {conv.employer.full_name?.charAt(0) || "E"}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div>
                                                <h4 className="font-semibold text-sm">
                                                    {conv.employer.full_name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {conv.jobs.title}
                                                </p>
                                            </div>
                                            {conv.unreadCount > 0 && (
                                                <Badge variant="default" className="shrink-0">
                                                    {conv.unreadCount}
                                                </Badge>
                                            )}
                                        </div>

                                        {conv.lastMessage && (
                                            <>
                                                <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                                                    {conv.lastMessage.sender_id === user.id
                                                        ? "You: "
                                                        : ""}
                                                    {conv.lastMessage.content}
                                                </p>
                                                <p className="text-xs text-muted-foreground/60">
                                                    {formatDistanceToNow(
                                                        new Date(conv.lastMessage.created_at),
                                                        { addSuffix: true }
                                                    )}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
