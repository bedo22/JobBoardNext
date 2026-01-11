import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  company_name: z.string().min(2, "Company name is required").max(100),
  location: z.string().optional(),
  type: z.enum(["full-time", "part-time", "contract", "internship"]),
  location_type: z.enum(["onsite", "remote", "hybrid"]),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  description: z.string().min(50, "Description must be at least 50 characters").max(5000),
  requirements: z.string().min(10, "Requirements are needed"),
  benefits: z.string().optional(),
})

export const profileSchema = z.object({
    full_name: z.string().min(2).max(50),
    company_name: z.string().max(50).optional().or(z.literal("")),
    bio: z.string().max(500).optional().or(z.literal("")),
    website_url: z.string().url().optional().or(z.literal("")),
    github_url: z.string().url().optional().or(z.literal("")),
    linkedin_url: z.string().url().optional().or(z.literal("")),
    twitter_url: z.string().url().optional().or(z.literal("")),
    skills: z.array(z.string()).max(20, "Max 20 skills allowed")
})

export type JobFormInput = z.infer<typeof jobSchema>
export type ProfileFormInput = z.infer<typeof profileSchema>