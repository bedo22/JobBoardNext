"use server";

import { createClient } from "@/lib/supabase/server";
import { sendMessageNotification } from "@/lib/notification-service";

export async function getOrCreateConversation(
    jobId: string,
    seekerId: string,
    employerId: string
) {
    const supabase = await createClient();

    // Check if conversation exists
    const { data: existing } = await supabase
        .from("conversations")
        .select("*")
        .eq("job_id", jobId)
        .eq("seeker_id", seekerId)
        .eq("employer_id", employerId)
        .single();

    if (existing) {
        return { conversationId: existing.id };
    }

    // Create new conversation
    const { data: created, error: createError } = await supabase
        .from("conversations")
        .insert({
            job_id: jobId,
            seeker_id: seekerId,
            employer_id: employerId,
        })
        .select()
        .single();

    if (createError) {
        console.error("Create conversation error:", createError);
        return { error: "Failed to start conversation" };
    }

    return { conversationId: created.id };
}

export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // 1. Get conversation details with job info and profiles
    const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select(`
            *,
            jobs:job_id (
                id,
                title
            )
        `)
        .eq('id', conversationId)
        .single();

    if (convError || !conv) return { error: "Conversation not found" };

    const recipientId = conv.seeker_id === user.id ? conv.employer_id : conv.seeker_id;
    if (!recipientId) return { error: "Recipient not found" };

    // Get sender and recipient profiles
    const { data: senderProfile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();

    const { data: recipientProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', recipientId)
        .single();

    // 2. Insert message
    const { data: msg, error: msgError } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim()
        })
        .select('*')
        .single();

    if (msgError) return { error: "Failed to send message" };

    // 3. Send notification with full context
    const jobInfo = conv.jobs as { id: string; title: string } | null;
    
    if (senderProfile && recipientProfile && jobInfo) {
        await sendMessageNotification({
            userId: recipientId,
            senderId: user.id,
            conversationId: conversationId,
            jobId: jobInfo.id,
            jobTitle: jobInfo.title,
            messagePreview: content.trim(),
            senderName: senderProfile.full_name || 'Someone',
            recipientRole: recipientProfile.role as 'employer' | 'seeker',
            type: 'new_message',
            title: 'New Message',
            message: '' // Will be constructed in service
        });
    }

    return { success: true, message: msg };
}
