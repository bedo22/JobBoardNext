"use client";

import { useState } from "react";
import { getOrCreateConversation } from "@/actions/messaging";
import { toast } from "sonner";

export function useChat() {
    const [activeChat, setActiveChat] = useState<{
        conversationId: string;
        participantName: string;
        participantAvatar: string | null;
        participantId: string;
    } | null>(null);
    const [isChatOpening, setIsChatOpening] = useState(false);

    const openChat = async ({
        jobId,
        seekerId,
        employerId,
        participantName,
        participantAvatar,
        participantId
    }: {
        jobId: string;
        seekerId: string;
        employerId: string;
        participantName: string;
        participantAvatar: string | null;
        participantId: string;
    }) => {
        setIsChatOpening(true);
        try {
            const result = await getOrCreateConversation(jobId, seekerId, employerId);
            if (result.conversationId) {
                setActiveChat({
                    conversationId: result.conversationId,
                    participantName,
                    participantAvatar,
                    participantId
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

    const closeChat = () => setActiveChat(null);

    return {
        activeChat,
        isChatOpening,
        openChat,
        closeChat
    };
}
