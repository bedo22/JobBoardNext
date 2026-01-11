"use client";

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MapPin, Clock, DollarSign, Globe, Building2 } from "lucide-react"
import type { Database } from "@/types/supabase"
import { formatDistanceToNow } from "date-fns"
import { SaveJobButton } from "./save-job-button"

type Job = Database['public']['Tables']['jobs']['Row']

interface JobCardProps {
    job: Job
    isSaved?: boolean
}

export function JobCard({ job, isSaved }: JobCardProps) {

    const salary = (() => {
        if (!job.salary_min && !job.salary_max) return "Competitive"
        if (job.salary_min && job.salary_max) {
            return `${job.salary_min.toLocaleString()}–${job.salary_max.toLocaleString()} EGP`
        }
        if (job.salary_min) return `${job.salary_min.toLocaleString()}+ EGP`
        return "Negotiable"
    })()

    const getLocationInfo = () => {
        if (job.location_type === 'remote') return { icon: Globe, text: "Remote" }
        if (job.location_type === 'hybrid') return { icon: Building2, text: "Hybrid" }
        return { icon: MapPin, text: job.location || "On-site" }
    }

    const { icon: LocationIcon, text: locationText } = getLocationInfo()

    return (
        <Link href={`/jobs/${job.id}`} className="block h-full">
            <div 
                className="job-card-gradient group relative rounded-3xl p-0.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-full"
            >
                <div className="absolute top-4 right-4 z-20">
                    <SaveJobButton jobId={job.id} initialSaved={isSaved} />
                </div>
                <Card className="relative h-full bg-card/90 backdrop-blur-xl border-none shadow-xl flex flex-col rounded-[1.4rem] overflow-hidden">
                    <CardHeader className="pb-4 shrink-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2 sm:gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-black wrap-break-words line-clamp-2 min-h-14 group-hover:text-primary transition-colors">{job.title}</h3>
                                <p className="text-lg text-primary font-bold tracking-tight">{job.company_name}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-start sm:justify-end max-w-full">
                                {job.type && (
                                    <Badge variant="secondary" className="capitalize whitespace-nowrap bg-indigo-500/10 text-indigo-500 border-none font-black text-[10px] tracking-widest">
                                        {job.type.replace('-', ' ')}
                                    </Badge>
                                )}
                                {job.location_type === 'remote' && (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] tracking-widest">
                                        REMOTE
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 flex-1 flex flex-col">
                        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground/80 font-semibold wrap-break-words flex-1">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-muted/50">
                                    <LocationIcon className="h-4 w-4 shrink-0 text-primary" />
                                </div>
                                <span className="uppercase tracking-tighter">{locationText}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-muted/50">
                                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                                </div>
                                <span className="uppercase tracking-tighter">{job.created_at ? `${formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}` : ''}</span>
                            </div>

                            <div className="flex items-center gap-2 font-black text-foreground">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <DollarSign className="h-4 w-4 shrink-0 text-primary" />
                                </div>
                                <span className="tracking-tight">{salary}</span>
                            </div>
                        </div>
                    </CardContent>
                    
                    <div className="px-6 pb-0 shrink-0">
                        <div className="h-0.5 w-full bg-linear-to-r from-primary/20 to-transparent group-hover:from-primary transition-all duration-500" />
                    </div>
                </Card>
            </div>
        </Link>
    )
}
