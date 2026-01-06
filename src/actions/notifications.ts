'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Creates a Supabase client with the Service Role key to bypass RLS.
 * This should ONLY be used for system-level operations like sending notifications.
 */
async function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseSecretKey) {
        throw new Error("Missing SUPABASE_SECRET_KEY environment variable");
    }

    return createSupabaseClient(supabaseUrl, supabaseSecretKey);
}

export async function sendNotification({
    userId,
    type,
    title,
    message,
    link
}: {
    userId: string;
    type: 'status_change' | 'new_message' | 'system';
    title: string;
    message: string;
    link?: string;
}) {
    try {
        const adminClient = await getAdminClient();

        const { error } = await adminClient
            .from('notifications')
            .insert({
                user_id: userId,
                type,
                title,
                message,
                link,
                is_read: false
            });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Failed to send notification:", error);
        return { error: "Failed to dispatch notification" };
    }
}

export async function markNotificationAsRead(notificationId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error) {
        console.error("Error marking notification as read:", error);
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function markAllNotificationsAsRead() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    if (error) {
        console.error("Error marking all notifications as read:", error);
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
}
