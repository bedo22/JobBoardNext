"use client";

import { Briefcase, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-muted/20 backdrop-blur-sm py-16 mt-20 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all group-hover:scale-110 group-hover:rotate-3">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="font-black text-xl tracking-tight">JobBoard</span>
            </Link>
            <p className="text-sm text-muted-foreground font-semibold leading-relaxed max-w-xs">
              The modern platform for tech talent. Connecting exceptional developers with innovative companies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Find Jobs", href: "/jobs" },
                { name: "Post a Job", href: "/jobs/post" },
                { name: "Pricing", href: "/pricing" },
                { name: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary font-semibold transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest mb-4 text-primary">Connect</h3>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-3 rounded-xl bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all hover:scale-110 hover:-translate-y-1 border border-border/50 hover:border-primary/30"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground font-bold">
            © 2025 JobBoard • Built with{" "}
            <span className="text-red-500 animate-pulse">❤️</span> in Egypt
          </p>
        </div>
      </div>
    </footer>
  )
}