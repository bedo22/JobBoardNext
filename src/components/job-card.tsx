"use client";

// src/components/job-card.tsx
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MapPin, Clock, DollarSign, Globe, Building2 } from "lucide-react"
import type { Database } from "@/types/supabase"
import { formatDistanceToNow } from "date-fns"

type Job = Database['public']['Tables']['jobs']['Row']

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const salary = (() => {
    if (!job.salary_min && !job.salary_max) return "Competitive"
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()}–${job.salary_max.toLocaleString()} EGP`
    }
    if (job.salary_min) return `${job.salary_min.toLocaleString()}+ EGP`
    return "Negotiable"
  })()

  // Location icon & text
  const getLocationInfo = () => {
    if (job.location_type === 'remote') return { icon: Globe, text: "Remote" }
    if (job.location_type === 'hybrid') return { icon: Building2, text: "Hybrid" }
    return { icon: MapPin, text: job.location || "On-site" }
  }

  const { icon: LocationIcon, text: locationText } = getLocationInfo()

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold break-words line-clamp-2">{job.title}</h3>
              <p className="text-lg text-primary font-medium">{job.company_name}</p>
            </div>

            {/* Badges: نوع الوظيفة + مكان العمل */}
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end max-w-full">
              {job.type && (
                <Badge variant="secondary" className="capitalize whitespace-nowrap max-w-[50vw] truncate sm:max-w-none">
                  {job.type.replace('-', ' ')}
                </Badge>
              )}
              {job.location_type === 'remote' && (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                  Remote
                </Badge>
              )}
              {job.location_type === 'hybrid' && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  Hybrid
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* معلومات سريعة */}
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground break-words">
            <div className="flex items-center gap-1.5">
              <LocationIcon className="h-4 w-4 shrink-0" />
              <span>{locationText}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{job.created_at ? `${formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}` : ''}</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <DollarSign className="h-4 w-4 shrink-0" />
              <span>{salary}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}