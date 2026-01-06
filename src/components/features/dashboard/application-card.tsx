"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, MapPin, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Job, Application } from "@/types/app";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type JobWithEmployer = Job & { profiles: Profile | null };
type ApplicationWithJob = Application & {
    jobs: JobWithEmployer | null;
};

interface ApplicationCardProps {
    application: ApplicationWithJob;
    onChat: (application: ApplicationWithJob) => void;
    isChatOpening?: boolean;
}

export function ApplicationCard({ application, onChat, isChatOpening }: ApplicationCardProps) {
    const getStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
            case "reviewed": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "shortlisted": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "rejected": return "bg-red-500/10 text-red-600 border-red-500/20";
            default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
        }
    };

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between md:justify-start md:gap-4">
                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-1">
                                {application.jobs?.title || "Deleted Job"}
                            </h3>
                            <Badge variant="outline" className={`${getStatusColor(application.status)} capitalize px-2.5 py-0.5 font-medium`}>
                                {application.status || "Pending"}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 font-medium text-foreground/80">
                                <Briefcase className="h-4 w-4" />
                                {application.jobs?.company_name}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {application.jobs?.location || "Remote"}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                Applied {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-primary hover:text-primary hover:bg-primary/5"
                            onClick={() => onChat(application)}
                            disabled={isChatOpening}
                        >
                            <MessageSquare className="h-4 w-4" /> Message Employer
                        </Button>

                        <Button variant="outline" size="sm" asChild className="gap-2 text-xs font-semibold">
                            <Link href={`/jobs/${application.job_id}`}>
                                <ExternalLink className="h-3.5 w-3.5" /> View Listing
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
