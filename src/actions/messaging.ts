"use server";

import { createClient } from "@/lib/supabase/server";
import { sendNotification } from "./notifications";

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

    // 1. Get conversation details to find the recipient
    const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

    if (convError || !conv) return { error: "Conversation not found" };

    const recipientId = conv.seeker_id === user.id ? conv.employer_id : conv.seeker_id;
    if (!recipientId) return { error: "Recipient not found" };

    // 2. Insert message
    const { data: msg, error: msgError } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim()
        })
        .select('*, profiles:sender_id(full_name)')
        .single();

    if (msgError) return { error: "Failed to send message" };

    // 3. Dispatch Notification to recipient
    await sendNotification({
        userId: recipientId,
        type: 'new_message',
        title: "New Message",
        message: `${(msg.profiles as { full_name: string })?.full_name || 'Someone'} sent you a message.`,
        link: '/dashboard'
    });

    return { success: true, message: msg };
}
