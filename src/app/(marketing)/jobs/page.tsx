"use client";

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { JobCard } from "@/components/features/jobs/job-card"
import { JobFilters } from "@/components/features/jobs/job-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useJobs } from "@/hooks/use-jobs"
import type { JobType } from "@/types/app"

export default function JobsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize filters from URL params
  const [filters, setFilters] = useState(() => {
    const search = searchParams.get('search') || ""
    const location = searchParams.get('location') || ""
    const typeParam = searchParams.get('type')
    const type = typeParam ? typeParam.split(',') as JobType[] : []
    const remote = searchParams.get('remote') === 'true'
    const hybrid = searchParams.get('hybrid') === 'true'

    return { search, location, type, remote, hybrid }
  })

  const { jobs, loading, hasMore, loadMore } = useJobs(filters)

  // Sync filters to URL whenever they change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.search) params.set('search', filters.search)
    if (filters.location) params.set('location', filters.location)
    if (filters.type.length > 0) params.set('type', filters.type.join(','))
    if (filters.remote) params.set('remote', 'true')
    if (filters.hybrid) params.set('hybrid', 'true')

    const queryString = params.toString()
    const newUrl = queryString ? `/jobs?${queryString}` : '/jobs'

    // Use shallow routing to avoid page reload
    router.push(newUrl, { scroll: false })
  }, [filters, router])

  // Infinite scroll
  const observer = useRef<IntersectionObserver | null>(null)
  const lastJobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore()
      }
    })

    if (lastJobRef.current) observer.current.observe(lastJobRef.current)
  }, [loading, hasMore, loadMore])

  return (
    <div className="container py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        <JobFilters onChange={setFilters} initialFilters={filters} />

        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">All Jobs</h1>
            <p className="text-muted-foreground mt-2">
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
            </p>
            <p className="sr-only" aria-live="polite">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found</p>
            <p className="text-muted-foreground mt-2">
            </p>
          </div>

          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                ref={index === jobs.length - 1 ? lastJobRef : null}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-6 mt-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-xl" />
              ))}
            </div>
          )}


          {hasMore && !loading && (
            <div className="text-center mt-10">
              <Button onClick={loadMore} size="lg">
                Load more jobs
              </Button>
            </div>
          )}

          {/* No jobs */}
          {!loading && jobs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No jobs found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilters({
                  search: "",
                  location: "",
                  type: [],
                  remote: false,
                  hybrid: false,
                })}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}