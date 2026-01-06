import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Briefcase, Users, Sparkles, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { JobCard } from "@/components/features/jobs/job-card"
import { BackgroundMesh } from "@/components/features/marketing/background-mesh"
import { TrustedBy } from "@/components/features/marketing/trusted-by"

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
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex flex-col justify-center">
                <BackgroundMesh />
                
                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-fade-in">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-black tracking-widest uppercase">The Future of Tech Hiring</span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
                            Engineer your <br />
                            <span className="text-primary italic">dream career.</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                            A high-performance job board for the next generation of developers. 
                            Verified roles, instant applications, and AI-powered matching.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
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

                        <div className="pt-10 flex items-center justify-center gap-8 text-muted-foreground overflow-hidden">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-12 w-12 rounded-full border-4 border-background bg-muted ring-2 ring-primary/20 overflow-hidden relative">
                                        <Image 
                                            src={`https://i.pravatar.cc/150?u=${i}`} 
                                            alt="user" 
                                            fill
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
            <section className="py-32 bg-muted/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />
                <div className="container relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
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

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
            <section className="py-32 relative">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-16">
                        {[
                            { icon: Briefcase, title: "Verified Roles", desc: "Every job is manually vetted for quality and salary transparency.", color: "text-indigo-500" },
                            { icon: Users, title: "Direct Access", desc: "Skip the black hole. Your application goes straight to the hiring lead.", color: "text-emerald-500" },
                            { icon: TrendingUp, title: "Career Growth", desc: "Exclusive access to senior-level roles and high-growth startups.", color: "text-blue-500" }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:shadow-2xl hover:-translate-y-2">
                                <div className={`w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <feature.icon className={`h-10 w-10 ${feature.color}`} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-muted-foreground font-semibold leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
