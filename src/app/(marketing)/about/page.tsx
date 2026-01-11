"use client";

import { motion } from "framer-motion";
import { BackgroundMesh } from "@/components/features/marketing/background-mesh";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, Globe, ShieldCheck } from "lucide-react";

const values = [
    {
        quote: "We believe in transparency. Every job listing on our platform includes verified salary ranges and direct contact information.",
        name: "Transparency First",
        title: "Integrity"
    },
    {
        quote: "Quality over quantity. We manually vet every role to ensure only high-growth, high-integrity opportunities reach our community.",
        name: "Curation Excellence",
        title: "Quality"
    },
    {
        quote: "Built for developers, by developers. Our stack is as modern as the roles we host, ensuring a seamless experience.",
        name: "Developer Centric",
        title: "Community"
    },
    {
        quote: "Real-time communication is the backbone of great hiring. Our platform ensures you're never left in a 'black hole'.",
        name: "Instant Connectivity",
        title: "Speed"
    }
];

export default function AboutPage() {
    return (
        <div className="relative min-h-screen bg-background">
            <BackgroundMesh />
            
            <div className="container relative z-10 pt-32 pb-24">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary"
                        >
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-black tracking-widest uppercase text-primary">Our Mission</span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic"
                        >
                            Humanizing <br />
                            <span className="text-primary not-italic">Tech Hiring.</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto"
                        >
                            JobBoard Elite was born out of frustration with the &quot;black hole&quot; of traditional job boards. We built a platform that treats engineering talent with the respect it deserves.
                        </motion.p>
                    </div>

                    {/* Stats/Cards Section */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Code, label: "Developer Mindset", desc: "Built by engineers who understand the codebase." },
                            { icon: Globe, label: "Global Reach", desc: "Connecting talent with remote-first startups worldwide." },
                            { icon: ShieldCheck, label: "Verified Data", desc: "No duplicate listings or expired roles. Ever." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="p-8 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/5 space-y-4"
                            >
                                <div className="p-4 rounded-2xl bg-primary/10 w-fit text-primary">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black">{item.label}</h3>
                                <p className="text-muted-foreground text-sm font-semibold">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Values Section with Infinite Moving Cards */}
                    <div className="space-y-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-black tracking-tighter">What We Stand For</h2>
                            <p className="text-muted-foreground font-bold">The principles that guide every feature we build.</p>
                        </div>
                        
                        <div className="rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
                            <InfiniteMovingCards
                                items={values}
                                direction="right"
                                speed="slow"
                            />
                        </div>
                    </div>

                    {/* CTA Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-12 rounded-[3rem] bg-linear-to-br from-primary to-indigo-600 text-primary-foreground text-center space-y-8 shadow-2xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Ready to experience the future?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/jobs">
                                <Button size="lg" variant="secondary" className="h-14 px-8 rounded-2xl font-black">
                                    Browse Open Roles <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/jobs/post">
                                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl font-black bg-white/10 border-white/20 hover:bg-white/20">
                                    Join as Employer
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
