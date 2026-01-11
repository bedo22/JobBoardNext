"use client";

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Menu, Briefcase, LogOut, LayoutDashboard, Settings } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserDropdown } from "@/components/layout/user-dropdown"
import { NotificationBell } from "@/components/features/notifications/notification-bell"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, useScroll, useSpring } from "framer-motion"
import { useState } from "react"

export function Navbar() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()
  const [isOpen, setIsOpen] = useState(false)
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const handleLogout = async () => {
    await signOut()
    setIsOpen(false)
    toast.success("Logged out successfully")
    router.push("/")
  }

  const navLinks = [
    { name: "Find Jobs", path: "/jobs" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" aria-label="Home" className="flex items-center gap-3 font-black text-2xl group transition-all">
          <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all group-hover:scale-110 group-hover:rotate-3">
            <Briefcase className="h-7 w-7" />
          </div>
          <span className="hidden sm:inline bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent tracking-tight">JobBoard</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all hover:bg-primary/10 hover:text-primary ${pathname === link.path ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons / Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle - Always visible */}
          <ThemeToggle />
          {user && <NotificationBell />}

          {loading ? (
             <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-20 rounded-xl hidden md:block" />
                <Skeleton className="h-9 w-24 rounded-xl hidden md:block" />
                <Skeleton className="h-9 w-9 rounded-full md:hidden" />
             </div>
          ) : (
            <>
              {user ? (
                <>
                  {/* Desktop */}
                  <div className="hidden md:flex items-center gap-3">
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm" className="font-bold rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/40">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>

                    <UserDropdown />
                  </div>

                  {/* Mobile */}
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle className="sr-only">Main menu</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-6 mt-8">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-bold p-2 hover:bg-muted rounded-xl transition-all">
                          <LayoutDashboard className="h-5 w-5 text-primary" /> Dashboard
                        </Link>
                        <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-bold p-2 hover:bg-muted rounded-xl transition-all">
                          <Settings className="h-5 w-5 text-primary" /> Profile Settings
                        </Link>
                        <div className="border-t pt-6">
                           <Button variant="outline" onClick={handleLogout} className="w-full justify-start font-bold rounded-xl h-12 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                             <LogOut className="h-5 w-5 mr-3 text-primary" /> Logout
                           </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center gap-3">
                    <Link href="/login"><Button variant="ghost" className="font-bold rounded-xl hover:bg-primary/10">Login</Button></Link>
                    <Link href="/signup"><Button className="font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Sign Up</Button></Link>
                  </div>

                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle className="sr-only">Main menu</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-8 mt-8">
                        {/* Mobile Nav Links */}
                        <div className="flex flex-col gap-2">
                            {navLinks.map(link => (
                                <Link 
                                    key={link.path} 
                                    href={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-lg font-bold p-3 rounded-xl transition-all hover:bg-primary/5 ${pathname === link.path ? "text-primary bg-primary/10" : "text-foreground/80"}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
                            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                                <Button variant="outline" size="lg" className="w-full font-black rounded-xl h-14 text-lg border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
                                <Button size="lg" className="w-full font-black rounded-xl shadow-xl shadow-primary/20 h-14 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
        style={{ scaleX }}
      />
    </header>
  )
}