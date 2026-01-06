"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, Eye, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const sparklineData = [
    { value: 400 }, { value: 300 }, { value: 500 }, { value: 450 },
    { value: 600 }, { value: 550 }, { value: 700 }, { value: 650 },
    { value: 800 }, { value: 750 }, { value: 900 }, { value: 850 },
];

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ReactNode;
    color: string;
    index: number;
}

function StatCard({ title, value, description, icon, color, index }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
            <Card className="relative overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-xl group transition-all hover:shadow-2xl hover:bg-card/80">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-linear-to-r ${color}`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
                    <div className={`p-2 rounded-lg bg-linear-to-br ${color} text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        {icon}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <div className="text-4xl font-black tracking-tight">{value}</div>
                        {description && (
                            <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                                <span className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                                    <TrendingUp className="h-3 w-3" />
                                </span>
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="h-[60px] w-full mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparklineData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    dot={false}
                                    className={`text-${color.split('-')[1]}-500`}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

interface StatsCardsProps {
    totalJobs: number;
    totalViews: number;
    avgConversion: number;
    newThisWeek: number;
}

export function StatsCards({ totalJobs, totalViews, avgConversion, newThisWeek }: StatsCardsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                index={0}
                title="Total Jobs"
                value={totalJobs}
                description="+12% from last month"
                icon={<Briefcase className="h-4 w-4" />}
                color="from-indigo-600 to-indigo-400"
            />
            <StatCard
                index={1}
                title="Active Seekers"
                value={totalViews > 0 ? Math.floor(totalViews / 10) : 0}
                description="Live platform activity"
                icon={<TrendingUp className="h-4 w-4" />}
                color="from-emerald-600 to-emerald-400"
            />
            <StatCard
                index={2}
                title="Impressions"
                value={totalViews.toLocaleString()}
                description="Aggregated reach"
                icon={<Eye className="h-4 w-4" />}
                color="from-blue-600 to-blue-400"
            />
            <StatCard
                index={3}
                title="Conversion"
                value={`${avgConversion}%`}
                description="Application rate"
                icon={<MousePointerClick className="h-4 w-4" />}
                color="from-violet-600 to-violet-400"
            />
        </div>
    );
}
