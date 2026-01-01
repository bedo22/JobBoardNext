import type { Database } from "@/types/supabase"

// Base Types from Supabase
export type Job = Database['public']['Tables']['jobs']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Application = Database['public']['Tables']['applications']['Row']

// Enums
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'
export type LocationType = 'onsite' | 'remote' | 'hybrid'

// Composite Types (Joins)
// This matches the query: .select("*, profiles:seeker_id(*)")
export type ApplicationWithProfile = Application & {
    profiles: Profile | null
}