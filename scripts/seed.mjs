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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  
  if (!serviceRoleKey) {
      throw new Error('Missing required env: SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)')
  }

  // Safety guard: prevent accidental run in production unless explicitly allowed
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED !== 'true') {
    throw new Error('Refusing to run seed in production. Set ALLOW_PROD_SEED=true to override (not recommended).')
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })

  const employerId = await getOrCreateDemoEmployer(supabase)

  const jobs = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Senior Full-Stack Engineer (Next.js 16)',
      company_name: 'Starlight Fintech',
      location: 'Remote',
      type: 'full-time',
      location_type: 'remote',
      salary_min: 120000,
      salary_max: 160000,
      description: 'Join a fast-growing fintech startup to lead our Next.js 16 migration. You will be responsible for architecting scalable frontend systems and implementing server-side optimization using the new "use cache" directive.',
      requirements: ['Next.js 15/16 Mastery', 'TypeScript Expert', 'PostgreSQL / Supabase Experience', '6+ Years Experience'],
      benefits: ['Stock Options', 'Unlimited PTO', 'Health/Dental/Vision', 'Home Office Stipend'],
      employer_id: employerId,
      created_at: daysAgo(1),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'AI Product Designer',
      company_name: 'Luminary AI',
      location: 'San Francisco, CA',
      type: 'full-time',
      location_type: 'hybrid',
      salary_min: 140000,
      salary_max: 180000,
      description: 'Help us define the future of human-AI interaction. You will design intuitive interfaces for large language model orchestration and agentic workflows.',
      requirements: ['Figma Mastery', 'AI/ML UX Experience', 'Design Systems Knowledge'],
      benefits: ['Premium Healthcare', 'Office Lunches', 'Wellness Allowance'],
      employer_id: employerId,
      created_at: daysAgo(3),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      title: 'Junior Frontend Developer',
      company_name: 'BrightSpark Tech',
      location: 'London, UK',
      type: 'internship',
      location_type: 'onsite',
      salary_min: 30000,
      salary_max: 45000,
      description: 'Looking for a passionate junior dev to help maintain our internal tools and marketing pages. Great opportunity to learn from senior engineers.',
      requirements: ['React Basics', 'Tailwind CSS', 'Strong Communication'],
      benefits: ['Mentorship Program', 'Metro Pass', 'Free Coffee & Snacks'],
      employer_id: employerId,
      created_at: daysAgo(5),
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      title: 'Solidity Smart Contract Engineer',
      company_name: 'Nexus Protocol',
      location: 'Dubai, UAE',
      type: 'contract',
      location_type: 'remote',
      salary_min: 100000,
      salary_max: 200000,
      description: 'Write, test, and deploy secure smart contracts for our decentralized finance protocol. Security-first mindset is a must.',
      requirements: ['Solidity Expertise', 'Foundry/Hardhat', 'DeFi Protocol Knowledge'],
      benefits: ['Crypto Bonuses', 'Global Travel', 'Coworking Stipend'],
      employer_id: employerId,
      created_at: daysAgo(2),
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      title: 'Marketing Manager',
      company_name: 'GrowthEngine',
      location: 'Austin, TX',
      type: 'full-time',
      location_type: 'onsite',
      salary_min: 90000,
      salary_max: 130000,
      description: 'Lead our cross-channel marketing strategy and drive user acquisition for our SaaS platform.',
      requirements: ['SEO/SEM Experience', 'Content Strategy', 'Data Analytics Tools'],
      benefits: ['Performance Bonuses', 'Gym Membership', 'Pet-Friendly Office'],
      employer_id: employerId,
      created_at: daysAgo(7),
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      title: 'Technical Writer',
      company_name: 'DocuStream',
      location: 'Remote',
      type: 'part-time',
      location_type: 'remote',
      salary_min: 40,
      salary_max: 80,
      description: 'Help us document our complex API ecosystem for external developers. Hourly rate.',
      requirements: ['Markdown Expert', 'Developer Background', 'Native English'],
      benefits: ['Flexible Schedule', 'Equity Grant'],
      employer_id: employerId,
      created_at: daysAgo(10),
    },
    {
      id: '00000000-0000-0000-0000-000000000007',
      title: 'DevOps Engineer (AWS/K8s)',
      company_name: 'CloudScale',
      location: 'Berlin, Germany',
      type: 'full-time',
      location_type: 'hybrid',
      salary_min: 110000,
      salary_max: 140000,
      description: 'Manage our global infrastructure across AWS and Kubernetes. Automate everything.',
      requirements: ['Terraform Mastery', 'Docker/K8s', 'Security Best Practices'],
      benefits: ['Commuter Benefit', 'Parental Leave', 'Stock Options'],
      employer_id: employerId,
      created_at: daysAgo(4),
    },
    {
      id: '00000000-0000-0000-0000-000000000008',
      title: 'Cybersecurity Analyst',
      company_name: 'ShieldLink',
      location: 'Singapore',
      type: 'full-time',
      location_type: 'onsite',
      salary_min: 120000,
      salary_max: 170000,
      description: 'Monitor, detect, and respond to security threats across our multi-cloud environment.',
      requirements: ['SIEM / SOC Experience', 'Networking Fundamentals', 'Security Certifications'],
      benefits: ['Medical / Dental', 'Performance Bonus', 'Relocation Support'],
      employer_id: employerId,
      created_at: daysAgo(6),
    },
    {
      id: '00000000-0000-0000-0000-000000000009',
      title: 'Backend Developer (Go)',
      company_name: 'FastFlow',
      location: 'Remote',
      type: 'full-time',
      location_type: 'remote',
      salary_min: 130000,
      salary_max: 180000,
      description: 'Join our infrastructure team to build high-performance microservices in Golang.',
      requirements: ['Golang Expertise', 'gRPC / Protobuf', 'Kubernetes'],
      benefits: ['High Base Salary', 'Home Office Budget', 'Generous Equity'],
      employer_id: employerId,
      created_at: daysAgo(8),
    },
    {
      id: '00000000-0000-0000-0000-000000000010',
      title: 'Head of People',
      company_name: 'HumanFirst',
      location: 'New York, NY',
      type: 'full-time',
      location_type: 'onsite',
      salary_min: 160000,
      salary_max: 220000,
      description: 'Scale our culture and hiring process as we grow from 50 to 200 people.',
      requirements: ['Tech Recruiting Background', 'Culture Building', 'Strategic HR'],
      benefits: ['Full Premium Health', '401k Match', 'Executive Bonuses'],
      employer_id: employerId,
      created_at: daysAgo(12),
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
