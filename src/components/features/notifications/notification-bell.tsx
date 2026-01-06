"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Inbox } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NotificationBell() {
    const { notifications, unreadCount, isLoading } = useNotifications();

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await markNotificationAsRead(id);
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead();
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate-in zoom-in duration-300">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h4 className="text-sm font-semibold tracking-tight">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-primary"
                            onClick={handleMarkAllRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[350px]">
                    {isLoading ? (
                        <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
                            Loading notifications...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Inbox className="mb-2 h-8 w-8 text-muted-foreground/30" />
                            <p className="text-xs text-muted-foreground">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((n) => (
                                <Link
                                    key={n.id}
                                    href={n.link || "#"}
                                    onClick={(e) => !n.is_read && handleMarkAsRead(n.id, e)}
                                    className={cn(
                                        "flex flex-col gap-1 border-b px-4 py-3 transition-colors hover:bg-muted/50",
                                        !n.is_read && "bg-primary/5"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h5 className={cn("text-xs font-semibold", !n.is_read && "text-primary")}>
                                            {n.title}
                                        </h5>
                                        {!n.is_read && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                                        {n.message}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground/60">
                                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="border-t p-2">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" asChild>
                        <Link href="/dashboard">View Dashboard</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
