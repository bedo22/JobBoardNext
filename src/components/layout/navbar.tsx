"use client";

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Menu, Briefcase, LogOut, LayoutDashboard, User, Settings } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationBell } from "@/components/features/notifications/notification-bell"

export function Navbar() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut()
    toast.success("Logged out successfully")
    router.push("/")
  }

  const navLinks = [
    { name: "Find Jobs", path: "/jobs" },
    { name: "Pricing", path: "/pricing" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-black text-2xl group transition-all">
          <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all group-hover:scale-110 group-hover:rotate-3">
            <Briefcase className="h-7 w-7" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent tracking-tight">JobBoard</span>
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

          {!loading && (
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

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                            <AvatarFallback>{profile?.full_name?.charAt(0) || <User className="h-4 w-4" />}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{profile?.full_name || "Profile"}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user?.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/profile">
                          <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile Settings</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle className="sr-only">Main menu</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-6 mt-4">
                        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-medium">
                          <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </Link>
                        <Link href="/profile" className="flex items-center gap-2 text-lg font-medium">
                          <Settings className="h-5 w-5" /> Profile Settings
                        </Link>
                        <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                          <LogOut className="h-4 w-4 mr-2" /> Logout
                        </Button>
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

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle className="sr-only">Main menu</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-6 mt-4">
                        <Link href="/login" className="text-lg font-medium">Login</Link>
                        <Link href="/signup"><Button className="w-full">Sign Up</Button></Link>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}