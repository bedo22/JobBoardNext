"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, Eye, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ReactNode;
    gradient: string;
    index: number;
}

function StatCard({ title, value, description, icon, gradient, index }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Card className={`overflow-hidden border-none shadow-sm transition-all hover:shadow-md ${gradient}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-80">{title}</CardTitle>
                    <div className="h-4 w-4 opacity-70">{icon}</div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{value}</div>
                    {description && (
                        <p className="text-xs opacity-60 mt-1 font-medium">
                            {description}
                        </p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

interface StatsCardsProps {
    totalJobs: number;
    newThisWeek: number;
    totalViews: number;
    avgConversion: number;
}

export function StatsCards({ totalJobs, newThisWeek, totalViews, avgConversion }: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                index={0}
                title="Total Jobs"
                value={totalJobs}
                description="Total active listings"
                icon={<Briefcase />}
                gradient="bg-linear-to-br from-indigo-500/10 to-primary/5 border-l-4 border-indigo-500/40"
            />
            <StatCard
                index={1}
                title="New This Week"
                value={newThisWeek}
                description="Recent postings"
                icon={<TrendingUp />}
                gradient="bg-linear-to-br from-emerald-500/10 to-teal-400/5 border-l-4 border-emerald-500/40"
            />
            <StatCard
                index={2}
                title="Total Views"
                value={totalViews.toLocaleString()}
                description="Aggregated view count"
                icon={<Eye />}
                gradient="bg-linear-to-br from-sky-500/10 to-blue-400/5 border-l-4 border-sky-500/40"
            />
            <StatCard
                index={3}
                title="Avg. Conversion"
                value={`${avgConversion}%`}
                description="Views to applications"
                icon={<MousePointerClick />}
                gradient="bg-linear-to-br from-amber-500/10 to-orange-400/5 border-l-4 border-amber-500/40"
            />
        </div>
    );
}
