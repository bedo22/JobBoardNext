"use client";

import { useEffect, useRef } from "react";
import { incrementJobView } from "@/actions/jobs";

interface ViewTrackerProps {
    jobId: string;
}

/**
 * A silent client component that tracks job views.
 * uses localStorage to ensure a user is only counted once per session/day.
 */
export function ViewTracker({ jobId }: ViewTrackerProps) {
    const hasTracked = useRef(false);

    useEffect(() => {
        // Prevent double-tracking in strict mode or during re-renders
        if (hasTracked.current) return;

        const trackView = async () => {
            const storageKey = `viewed_job_${jobId}`;
            const lastViewed = localStorage.getItem(storageKey);
            const now = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000;

            // If never viewed, or last view was more than 24 hours ago
            if (!lastViewed || (now - parseInt(lastViewed)) > ONE_DAY) {
                await incrementJobView(jobId);
                localStorage.setItem(storageKey, now.toString());
            }

            hasTracked.current = true;
        };

        trackView();
    }, [jobId]);

    return null;
}
