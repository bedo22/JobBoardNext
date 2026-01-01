import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string().min(3),
  company_name: z.string().min(2),
  location: z.string().optional(),
  type: z.enum(["full-time", "part-time", "contract", "internship"]),
  location_type: z.enum(["onsite", "remote", "hybrid"]),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  description: z.string().min(50),
  requirements: z.string(),
  benefits: z.string().optional(),
})

export type JobFormInput = z.infer<typeof jobSchema>
