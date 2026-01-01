
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { JobType } from '@/types/app'

import type { Job } from "@/types/app"

export type Filters = {
  search: string
  location: string
  type: JobType[]
  remote: boolean
  hybrid: boolean
}

export function useJobs(filters: Filters = {
  search: '',
  location: '',
  type: [],
  remote: false,
  hybrid: false
}) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const PAGE_SIZE = 10

  const fetchJobs = async (reset = false) => {
    setLoading(true)
    const from = reset ? 0 : page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    // Text search
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }

    // Location
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    // Employment type (full-time, part-time, etc.)
    if (filters.type.length > 0) {
      query = query.in('type', filters.type)
    }

    // Remote & Hybrid
    if (filters.remote && filters.hybrid) {
      query = query.in('location_type', ['remote', 'hybrid'])
    } else if (filters.remote) {
      query = query.eq('location_type', 'remote')
    } else if (filters.hybrid) {
      query = query.eq('location_type', 'hybrid')
    }

    const { data, count, error } = await query

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setJobs(prev => reset ? data! : [...prev, ...data!])
    setHasMore(count ? count > to + 1 : false)
    setPage(prev => reset ? 1 : prev + 1)
    setLoading(false)
  }

  const loadMore = () => !loading && hasMore && fetchJobs(false)
  const refetch = () => fetchJobs(true)

  // Instant filtering for checkboxes and toggles (better UX for click actions)
  useEffect(() => {
    refetch()
  }, [JSON.stringify(filters.type), filters.remote, filters.hybrid])

  // Debounced filtering for text inputs (wait until user stops typing)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      refetch()
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounce)
  }, [filters.search, filters.location])

  return { jobs, loading, hasMore, loadMore, refetch }
}