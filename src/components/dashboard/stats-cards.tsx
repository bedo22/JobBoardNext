"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, MapPin, BarChart2, Users, TrendingUp } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

interface StatsCardsProps {
    totalJobs: number;
    newThisWeek: number;
    remotePercent: number;
    topCategory: string;
}

export function StatsCards({ totalJobs, newThisWeek, remotePercent, topCategory }: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Jobs"
                value={totalJobs}
                description="Total active listings"
                icon={<Briefcase />}
            />
            <StatCard
                title="New This Week"
                value={newThisWeek}
                description="Recent postings"
                icon={<TrendingUp className="text-emerald-500" />}
            />
            <StatCard
                title="Remote Ratio"
                value={`${remotePercent}%`}
                description="Of total jobs"
                icon={<MapPin />}
            />
            <StatCard
                title="Top Category"
                value={topCategory}
                description="Most active type"
                icon={<BarChart2 />}
            />
        </div>
    );
}
