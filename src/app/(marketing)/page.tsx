import dynamicImport from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Users, Sparkles, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { JobCard } from "@/components/features/jobs/job-card"
import { BackgroundMesh } from "@/components/features/marketing/background-mesh"

// Dynamic imports for performance optimization
const TrustedBy = dynamicImport(() => import("@/components/features/marketing/trusted-by").then(mod => mod.TrustedBy), {
  loading: () => <div className="h-32 animate-pulse bg-muted/20" />
})

const BackgroundBeams = dynamicImport(() => import("@/components/ui/background-beams").then(mod => mod.BackgroundBeams))

const BentoGrid = dynamicImport(() => import("@/components/ui/bento-grid").then(mod => mod.BentoGrid), {
  loading: () => <div className="h-96 animate-pulse bg-muted/10 rounded-xl" />
})

const BentoGridItem = dynamicImport(() => import("@/components/ui/bento-grid").then(mod => mod.BentoGridItem))

export const dynamic = 'force-dynamic'

async function getLatestJobs() {
    const { data: latestJobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)
    return latestJobs
}

export default async function Index() {
    const latestJobs = await getLatestJobs()

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative pt-6 pb-16 md:pb-24 overflow-hidden min-h-[600px] flex items-center">
                <BackgroundMesh />
                <BackgroundBeams />
                
                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-fade-in">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-black tracking-widest uppercase">The Future of Tech Hiring</span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] md:leading-[0.9] text-foreground">
                            Engineer your <br />
                            <span className="text-primary italic mt-4 md:mt-0 block md:inline">dream career.</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                            A high-performance job board for the next generation of developers. 
                            Verified roles, instant applications, and AI-powered matching.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Link href="/jobs">
                                <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Explore Jobs <ArrowRight className="ml-3 h-6 w-6 stroke-3" />
                                </Button>
                            </Link>
                            <Link href="/jobs/post">
                                <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-black border-2 hover:bg-muted/50 transition-all">
                                    <Briefcase className="mr-3 h-6 w-6" /> Post a Listing
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-8 flex items-center justify-center gap-8 text-muted-foreground overflow-hidden">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-12 w-12 rounded-full border-4 border-background bg-muted ring-2 ring-primary/20 overflow-hidden relative">
                                        <Image 
                                            src={`https://i.pravatar.cc/150?u=${i}`} 
                                            alt="user" 
                                            fill
                                            sizes="48px"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <p className="font-black text-foreground leading-none">500+ Hired</p>
                                <p className="text-sm font-bold opacity-60">This month alone</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <TrustedBy />

            {/* Featured Jobs Section */}
            <section className="py-20 md:py-24 bg-muted/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />
                <div className="container relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">Featured Opportunities</h2>
                            <p className="text-muted-foreground font-bold text-lg">Hand-picked roles from top-tier tech companies.</p>
                        </div>
                        <Link href="/jobs">
                            <Button variant="link" className="text-primary font-black text-lg p-0 hover:no-underline group uppercase tracking-widest">
                                View Full Board <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {latestJobs && latestJobs.length > 0 ? (
                            latestJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-24 rounded-[3rem] border-4 border-dashed border-muted bg-muted/5">
                                <div className="p-6 rounded-full bg-muted/10 w-fit mx-auto mb-6">
                                    <Sparkles className="h-12 w-12 text-primary opacity-20" />
                                </div>
                                <h3 className="text-2xl font-black mb-2 italic">The board is warming up</h3>
                                <p className="text-muted-foreground mb-10 font-bold">Be the first to post a job and capture top talent.</p>
                                <Link href="/jobs/post">
                                    <Button size="lg" className="rounded-2xl font-black px-8">Post the first job</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-20 md:py-24 relative overflow-hidden">
                <div className="container">
                    <div className="mb-16 text-center space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">The Advantage</h2>
                        <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto">Why high-growth startups choose JobBoard Elite for their engineering pipelines.</p>
                    </div>
                    
                    <BentoGrid className="max-w-6xl mx-auto">
                        {[
                            { 
                                title: "Verified Roles", 
                                description: "Every job is manually vetted for quality and salary transparency. No ghost jobs here.", 
                                header: (
                                    <div className="relative flex flex-1 w-full h-full min-h-40 rounded-xl overflow-hidden border border-white/10">
                                        <Image
                                            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800"
                                            alt="Verified Roles"
                                            fill
                                            className="object-cover opacity-90 transition-transform duration-500 group-hover/bento:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                    </div>
                                ),
                                icon: <Briefcase className="h-4 w-4 text-indigo-500" />,
                                className: "md:col-span-2"
                            },
                            { 
                                title: "Direct Access", 
                                description: "Your application goes straight to the hiring lead. No middleman.", 
                                header: (
                                    <div className="relative flex flex-1 w-full h-full min-h-40 rounded-xl overflow-hidden border border-white/10">
                                        <Image
                                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
                                            alt="Direct Access"
                                            fill
                                            className="object-cover opacity-90 transition-transform duration-500 group-hover/bento:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                    </div>
                                ),
                                icon: <Users className="h-4 w-4 text-emerald-500" />,
                                className: "md:col-span-1"
                            },
                            { 
                                title: "Career Growth", 
                                description: "Exclusive access to senior-level roles and early-stage opportunities.", 
                                header: (
                                    <div className="relative flex flex-1 w-full h-full min-h-40 rounded-xl overflow-hidden border border-white/10">
                                        <Image
                                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                            alt="Career Growth"
                                            fill
                                            className="object-cover opacity-90 transition-transform duration-500 group-hover/bento:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                    </div>
                                ),
                                icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
                                className: "md:col-span-1"
                            },
                            { 
                                title: "AI-Powered Matching", 
                                description: "Our intelligence engine matches your specific tech stack with the perfect team.", 
                                header: (
                                    <div className="relative flex flex-1 w-full h-full min-h-40 rounded-xl overflow-hidden border border-white/10">
                                        <Image
                                            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
                                            alt="AI-Powered Matching"
                                            fill
                                            className="object-cover opacity-90 transition-transform duration-500 group-hover/bento:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                    </div>
                                ),
                                icon: <Sparkles className="h-4 w-4 text-primary" />,
                                className: "md:col-span-2"
                            }
                        ].map((item, i) => (
                            <BentoGridItem
                                key={i}
                                title={item.title}
                                description={item.description}
                                header={item.header}
                                icon={item.icon}
                                className={item.className}
                            />
                        ))}
                    </BentoGrid>
                </div>
            </section>
        </div>
    )
}
