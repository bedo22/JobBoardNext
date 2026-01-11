"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
    related_id: string | null;
    related_type: string | null;
    sender_id: string | null;
    metadata: Record<string, string | number | boolean | null>;
    read_at: string | null;
    deleted_at: string | null;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel>;

        async function setupNotifications() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setIsLoading(false);
                return;
            }

            // 1. Initial Fetch
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_read).length);
            }
            setIsLoading(false);

            // 2. Realtime Subscription
            channel = supabase
                .channel(`user-notifications-${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        const newNotification = payload.new as Notification;

                        // Update lists
                        setNotifications(prev => [newNotification, ...prev].slice(0, 20));
                        setUnreadCount(prev => prev + 1);

                        // Show Toast
                        toast(newNotification.title, {
                            description: newNotification.message,
                            action: newNotification.link ? {
                                label: "View",
                                onClick: () => router.push(newNotification.link!)
                            } : undefined
                        });
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        const updated = payload.new as Notification;
                        setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));

                        // Recalculate unread
                        setUnreadCount(prev => {
                            const wasRead = (payload.old as Notification).is_read;
                            const isReadNow = updated.is_read;
                            if (!wasRead && isReadNow) return Math.max(0, prev - 1);
                            if (wasRead && !isReadNow) return prev + 1;
                            return prev;
                        });
                    }
                )
                .subscribe();
        }

        setupNotifications();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [router]);

    return {
        notifications,
        unreadCount,
        isLoading
    };
}
