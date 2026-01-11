import Link from "next/link"
import { Briefcase } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* Left Side: Auth Forms */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-20 relative z-10">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="mb-8 flex items-center gap-2 font-bold text-2xl group transition-all">
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                JobBoard
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right Side: Technical Glow Branding */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-card border-l border-border/40">
        <BackgroundBeams className="opacity-40" />
        
        <div className="relative z-20 max-w-lg p-12 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tighter leading-tight italic uppercase">
              The Standard for <br />
              <span className="text-primary underline decoration-primary/30 underline-offset-8">Modern HR Intelligence</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              Join the ecosystem where elite talent meets high-stakes projects. Built with speed, security, and design-excellence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Uptime", value: "99.9%" },
              { label: "Matches", value: "12k+" },
              { label: "Security", value: "Enterprise" },
              { label: "Support", value: "24/7" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-background/40 backdrop-blur-md border border-border/40">
                <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="pt-8">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-sm">
                <p className="text-sm font-bold text-primary/80 leading-relaxed italic">
                  &quot;The most efficient job board I&apos;ve ever used. The AI integration is a game-changer for our hiring pipeline.&quot;
                </p>
                <p className="mt-2 text-xs font-black uppercase tracking-widest text-primary/40">— Head of Talent @ TechFlow</p>
            </div>
          </div>
        </div>

        {/* Decorative Grid Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      </div>
    </div>
  )
}
