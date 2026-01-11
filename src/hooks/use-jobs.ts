
import { useEffect, useRef, useCallback, useReducer } from 'react'
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

const PAGE_SIZE = 10

/**
 * Improved architecture using useReducer pattern for complex state
 * This eliminates circular dependencies and provides predictable state updates
 */
type State = {
  jobs: Job[]
  loading: boolean
  hasMore: boolean
  page: number
  error: string | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { jobs: Job[]; hasMore: boolean; reset: boolean } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'RESET' }

function jobsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    
    case 'FETCH_SUCCESS':
      const { jobs: newJobs, hasMore, reset } = action.payload
      
      if (reset) {
        return {
          ...state,
          jobs: newJobs,
          hasMore,
          page: 1,
          loading: false,
          error: null,
        }
      }
      
      // Prevent duplicates
      const existingIds = new Set(state.jobs.map(j => j.id))
      const uniqueNewJobs = newJobs.filter(job => !existingIds.has(job.id))
      
      return {
        ...state,
        jobs: [...state.jobs, ...uniqueNewJobs],
        hasMore,
        page: state.page + 1,
        loading: false,
        error: null,
      }
    
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    
    case 'RESET':
      return { jobs: [], loading: true, hasMore: true, page: 0, error: null }
    
    default:
      return state
  }
}

export function useJobs(filters: Filters = {
  search: '',
  location: '',
  type: [],
  remote: false,
  hybrid: false
}) {
  const [state, dispatch] = useReducer(jobsReducer, {
    jobs: [],
    loading: true,
    hasMore: true,
    page: 0,
    error: null,
  })

  // Use ref to track if a fetch is in progress (prevents race conditions)
  const fetchingRef = useRef(false)
  
  // Serialize filters for stable comparison
  const filtersKey = JSON.stringify(filters)

  const fetchJobs = useCallback(async (page: number, reset = false) => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return
    fetchingRef.current = true

    dispatch({ type: 'FETCH_START' })
    
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    try {
      let query = supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to)

      // Apply filters
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters.type.length > 0) {
        query = query.in('type', filters.type)
      }

      if (filters.remote && filters.hybrid) {
        query = query.in('location_type', ['remote', 'hybrid'])
      } else if (filters.remote) {
        query = query.eq('location_type', 'remote')
      } else if (filters.hybrid) {
        query = query.eq('location_type', 'hybrid')
      }

      const { data, count, error } = await query

      if (error) throw error

      const hasMore = count ? count > to + 1 : false
      
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: { jobs: data || [], hasMore, reset },
      })
    } catch (error) {
      console.error('Error fetching jobs:', error)
      
      let errorMessage = 'Failed to fetch jobs'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message)
      }

      dispatch({
        type: 'FETCH_ERROR',
        payload: errorMessage,
      })
    } finally {
      fetchingRef.current = false
    }
  }, [filters.search, filters.location, filters.type, filters.remote, filters.hybrid])

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore && !fetchingRef.current) {
      void fetchJobs(state.page, false)
    }
  }, [state.loading, state.hasMore, state.page, fetchJobs])

  // Reset and fetch when filters change
  useEffect(() => {
    dispatch({ type: 'RESET' })
    
    // Debounce text inputs
    const isTextFilter = filters.search || filters.location
    const delay = isTextFilter ? 500 : 0
    
    const timer = setTimeout(() => {
      void fetchJobs(0, true)
    }, delay)

    return () => clearTimeout(timer)
  }, [filtersKey, fetchJobs, filters.search, filters.location]) // Include all dependencies

  return {
    jobs: state.jobs,
    loading: state.loading,
    hasMore: state.hasMore,
    error: state.error,
    loadMore,
  }
}