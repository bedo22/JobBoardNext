"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSaveJob, getIsJobSaved } from "@/actions/saved-jobs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/components/providers/auth-provider";

interface SaveJobButtonProps {
    jobId: string;
    initialSaved?: boolean;
    className?: string;
}

export function SaveJobButton({ jobId, initialSaved = false, className }: SaveJobButtonProps) {
    const { user } = useAuthContext();
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(!initialSaved);

    useEffect(() => {
        if (!user || initialSaved) {
            setIsChecking(false);
            return;
        }

        const checkSaved = async () => {
            const saved = await getIsJobSaved(jobId);
            setIsSaved(saved);
            setIsChecking(false);
        };

        checkSaved();
    }, [jobId, user, initialSaved]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please log in to save jobs");
            return;
        }

        setLoading(true);
        try {
            const result = await toggleSaveJob(jobId);
            if (result.success) {
                setIsSaved(result.saved || false);
                toast.success(result.saved ? "Job saved" : "Job removed from saved");
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("Failed to update saved job");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            disabled={loading || isChecking}
            className={cn(
                "rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 shadow-sm",
                isSaved && "text-red-500 hover:text-red-600",
                className
            )}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
            )}
        </Button>
    );
}
