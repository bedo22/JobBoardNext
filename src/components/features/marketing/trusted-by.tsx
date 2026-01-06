"use client";

import { motion } from "framer-motion";
import { Building2, Globe, Cpu, Zap, Shield, Rocket } from "lucide-react";

const companies = [
    { name: "TechFlow", icon: Rocket },
    { name: "GlobalSynergy", icon: Globe },
    { name: "NexusAI", icon: Cpu },
    { name: "VoltSystems", icon: Zap },
    { name: "DataGuard", icon: Shield },
    { name: "Skyline", icon: Building2 },
];

export function TrustedBy() {
    return (
        <div className="py-12 border-y border-border/50 bg-muted/20 overflow-hidden relative">
            <div className="container mb-8 text-center">
                <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">
                    Fueling growth for modern engineering teams
                </p>
            </div>
            
            <div className="flex gap-12 whitespace-nowrap">
                <motion.div 
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ 
                        duration: 30, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                    className="flex gap-12 items-center min-w-full"
                >
                    {[...companies, ...companies].map((company, idx) => (
                        <div key={idx} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <company.icon className="h-6 w-6 text-primary" />
                            <span className="text-xl font-black tracking-tighter italic">{company.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
            
            <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-background to-transparent z-10" />
            <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-background to-transparent z-10" />
        </div>
    );
}
