import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

function requireEnv(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env: ${name}`)
  return v
}

async function getOrCreateDemoEmployer(supabase) {
  // If DEMO_EMPLOYER_ID provided, use it
  if (process.env.DEMO_EMPLOYER_ID) {
    return process.env.DEMO_EMPLOYER_ID
  }
  // Optionally create one if email/password provided
  const email = process.env.DEMO_EMPLOYER_EMAIL
  const password = process.env.DEMO_EMPLOYER_PASSWORD
  if (email && password) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (error) throw error
    console.log(`Created demo employer user: ${data.user.id} (${email})`)
    return data.user.id
  }
  throw new Error('Please set DEMO_EMPLOYER_ID or DEMO_EMPLOYER_EMAIL and DEMO_EMPLOYER_PASSWORD to seed jobs.')
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

async function main() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  // Safety guard: prevent accidental run in production unless explicitly allowed
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED !== 'true') {
    throw new Error('Refusing to run seed in production. Set ALLOW_PROD_SEED=true to override (not recommended).')
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })

  const employerId = await getOrCreateDemoEmployer(supabase)

  const jobs = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Senior React Engineer',
      company_name: 'Cairo Dev Co',
      location: 'Cairo, EG',
      type: 'full-time',
      location_type: 'hybrid',
      salary_min: 35000,
      salary_max: 55000,
      description: 'Build and optimize high-quality web apps using React and Next.js. Collaborate with product and design to ship fast.',
      requirements: [
        '5+ years with React and TypeScript',
        'Experience with Next.js App Router',
        'State management (Zustand/Redux)',
        'REST/GraphQL APIs',
        'Unit testing with Jest/RTL',
      ],
      benefits: [
        'Flexible hours',
        'Health insurance',
        'Learning stipend',
        'SEED:DEMO',
      ],
      employer_id: employerId,
      created_at: daysAgo(2),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'Backend Engineer (Node.js)',
      company_name: 'Nile Systems',
      location: 'Remote',
      type: 'contract',
      location_type: 'remote',
      salary_min: 40000,
      salary_max: 70000,
      description: 'Design and build scalable APIs using Node.js and Postgres. Work closely with frontend teams.',
      requirements: [
        'Node.js + TypeScript',
        'PostgreSQL and query optimization',
        'Supabase or Prisma experience',
        'CI/CD pipelines',
      ],
      benefits: ['Remote-first', 'Competitive pay', 'SEED:DEMO'],
      employer_id: employerId,
      created_at: daysAgo(5),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      title: 'UI/UX Designer',
      company_name: 'Alexandria Tech',
      location: 'Alexandria, EG',
      type: 'part-time',
      location_type: 'onsite',
      description: 'Create intuitive interfaces and design systems. Collaborate with engineers for pixel-perfect implementation.',
      requirements: [
        'Figma mastery',
        'Design systems and tokens',
        'Prototyping and user testing',
        'Handoff to developers',
      ],
      benefits: ['Hybrid option', 'Great team', 'SEED:DEMO'],
      employer_id: employerId,
      created_at: daysAgo(7),
    },
  ]

  console.log('Upserting demo jobs...')
  const { error } = await supabase.from('jobs').upsert(jobs, { onConflict: 'id' })
  if (error) throw error

  console.log('Seed completed successfully.')
}

main().catch((e) => {
  console.error('Seed failed:', e)
  process.exit(1)
})
