"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  MousePointerClick,
  BarChart3,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Bar,
  BarChart,
  Area,
  AreaChart,
} from "recharts";
import { cn } from "@/lib/utils";

interface AnalyticsBentoProps {
  totalJobs: number;
  totalViews: number;
  totalApplicants: number;
  avgConversion: number;
  newThisWeek: number;
}

const sparklineData = [
  { value: 40 },
  { value: 30 },
  { value: 50 },
  { value: 45 },
  { value: 60 },
  { value: 55 },
  { value: 70 },
  { value: 65 },
  { value: 80 },
  { value: 75 },
  { value: 90 },
  { value: 85 },
];

const barData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 19 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 22 },
  { name: "Fri", value: 18 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 6 },
];

const areaData = [
  { name: "W1", views: 120, apps: 15 },
  { name: "W2", views: 180, apps: 22 },
  { name: "W3", views: 150, apps: 18 },
  { name: "W4", views: 220, apps: 35 },
];

function StatHeader({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("p-2 rounded-xl", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function AnalyticsBento({
  totalJobs,
  totalViews,
  totalApplicants,
  avgConversion,
  newThisWeek,
}: AnalyticsBentoProps) {
  return (
    <BentoGrid className="md:auto-rows-[180px] lg:grid-cols-4">
      {/* Total Jobs - Large */}
      <BentoGridItem
        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20"
        header={
          <div className="flex flex-col h-full justify-between p-2">
            <StatHeader
              icon={Briefcase}
              label="Active Listings"
              color="bg-indigo-500/20 text-indigo-500"
            />
            <div className="flex-1 flex items-center">
              <div className="text-6xl font-black tracking-tighter">
                <NumberTicker value={totalJobs} />
              </div>
            </div>
            <div className="h-[80px] w-full opacity-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-500">
                <TrendingUp className="h-3 w-3" />+{newThisWeek}
              </span>
              new this week
            </p>
          </div>
        }
      />

      {/* Total Views */}
      <BentoGridItem
        className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
        header={
          <div className="flex flex-col h-full justify-between p-2">
            <StatHeader
              icon={Eye}
              label="Impressions"
              color="bg-blue-500/20 text-blue-500"
            />
            <div className="text-4xl font-black tracking-tighter">
              <NumberTicker value={totalViews} />
            </div>
            <div className="h-[40px] w-full opacity-50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        }
      />

      {/* Total Applicants */}
      <BentoGridItem
        className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20"
        header={
          <div className="flex flex-col h-full justify-between p-2">
            <StatHeader
              icon={Users}
              label="Applicants"
              color="bg-emerald-500/20 text-emerald-500"
            />
            <div className="text-4xl font-black tracking-tighter">
              <NumberTicker value={totalApplicants} />
            </div>
            <div className="h-[40px] w-full opacity-50">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <Bar dataKey="value" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        }
      />

      {/* Conversion Rate */}
      <BentoGridItem
        className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20"
        header={
          <div className="flex flex-col h-full justify-between p-2">
            <StatHeader
              icon={MousePointerClick}
              label="Conversion"
              color="bg-violet-500/20 text-violet-500"
            />
            <div className="text-4xl font-black tracking-tighter flex items-baseline gap-1">
              <NumberTicker value={avgConversion} />
              <span className="text-2xl text-muted-foreground">%</span>
            </div>
            <motion.div
              className="h-2 w-full bg-muted/30 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${avgConversion}%` }}
                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              />
            </motion.div>
          </div>
        }
      />

      {/* Weekly Activity - Wide */}
      <BentoGridItem
        className="md:col-span-2 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
        header={
          <div className="flex flex-col h-full justify-between p-2">
            <StatHeader
              icon={BarChart3}
              label="Weekly Activity"
              color="bg-orange-500/20 text-orange-500"
            />
            <div className="h-[80px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <Bar
                    dataKey="value"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                    className="opacity-80"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              {barData.map((d) => (
                <span key={d.name}>{d.name}</span>
              ))}
            </div>
          </div>
        }
      />
    </BentoGrid>
  );
}
