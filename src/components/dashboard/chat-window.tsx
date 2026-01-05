"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Database } from "@/types/supabase";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface MessageWithProfile extends Message {
    profiles: Profile | null;
}

interface ChatWindowProps {
    conversationId: string;
    otherParticipant: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

export function ChatWindow({ conversationId, otherParticipant }: ChatWindowProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<MessageWithProfile[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data, error } = await supabase
                    .from("messages")
                    .select("*, profiles:sender_id(*)")
                    .eq("conversation_id", conversationId)
                    .order("created_at", { ascending: true });

                if (error) throw error;
                setMessages(data || [] as any);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        if (conversationId) {
            fetchMessages();
        }
    }, [conversationId]);

    // Realtime Subscription
    useEffect(() => {
        if (!conversationId) return;

        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                async (payload) => {
                    const newMessage = payload.new as Message;

                    // Fetch profile for the new message
                    const { data: profileData } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", newMessage.sender_id!)
                        .single();

                    const messageWithProfile: MessageWithProfile = {
                        ...newMessage,
                        profiles: profileData as Profile,
                    };

                    setMessages((prev) => [...prev, messageWithProfile]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending || !user) return;

        setSending(true);
        try {
            const { error } = await supabase.from("messages").insert({
                conversation_id: conversationId,
                sender_id: user.id,
                content: newMessage.trim(),
            });

            if (error) throw error;
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground mt-4">Loading conversation...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-lg bg-background shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={otherParticipant.avatar_url ?? undefined} />
                    <AvatarFallback>{otherParticipant.full_name?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold">{otherParticipant.full_name || "Unknown Participant"}</h3>
                    <p className="text-xs text-muted-foreground">Real-time Chat</p>
                </div>
            </div>

            {/* Messages Area */}
            <div
                className="flex-1 p-4 overflow-y-auto"
                ref={scrollRef}
            >
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <MessageCircle className="h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender_id === user?.id;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none"
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-1 opacity-70 ${isMe ? "text-right" : "text-left"}`}>
                                            {msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : "just now"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-muted/30 flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    className="flex-1"
                />
                <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    );
}
