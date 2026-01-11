"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="container min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-destructive/10 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Something went wrong!
                </h1>
                <p className="text-muted-foreground max-w-125 mx-auto text-lg">
                    An unexpected error occurred. We&apos;ve been notified and are working on it.
                </p>
            </div>
            <div className="flex gap-4">
                <Button
                    variant="default"
                    size="lg"
                    onClick={() => reset()}
                >
                    Try again
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.href = "/"}
                >
                    Go to Home
                </Button>
            </div>
        </div>
    );
}
