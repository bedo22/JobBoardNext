import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

function requireEnv(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env: ${name}`)
  return v
}

async function main() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED !== 'true') {
    throw new Error('Refusing to run reset in production. Set ALLOW_PROD_SEED=true to override (not recommended).')
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })

  // Remove demo-tagged jobs
  console.log('Deleting demo jobs (benefits contains SEED:DEMO)...')
  const { error } = await supabase
    .from('jobs')
    .delete()
    .contains('benefits', ['SEED:DEMO'])

  if (error) throw error

  // Optionally delete the demo employer user if specified
  if (process.env.DELETE_DEMO_USER === 'true' && process.env.DEMO_EMPLOYER_ID) {
    console.log(`Deleting demo employer user: ${process.env.DEMO_EMPLOYER_ID}`)
    const { error: delErr } = await supabase.auth.admin.deleteUser(process.env.DEMO_EMPLOYER_ID)
    if (delErr) throw delErr
  }

  console.log('Reset completed successfully.')
}

main().catch((e) => {
  console.error('Reset failed:', e)
  process.exit(1)
})
