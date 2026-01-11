"use client"

import * as React from "react"
import {
  Briefcase,
  LayoutDashboard,
  Users,
  BarChart3,
  Plus,
  Heart,
  FileText,
  Search,
  Home,
  Building2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthContext } from "@/components/providers/auth-provider"

type NavItem = {
  title: string
  url: string
  icon: React.ElementType
  suffix?: React.ReactNode
}

// Menu items for Employers
const employerItems: NavItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Jobs",
    url: "/dashboard/jobs",
    icon: Briefcase,
    suffix: (
      <Link href="/jobs/post">
        <Plus className="h-4 w-4" />
      </Link>
    )
  },
  {
    title: "Applicants",
    url: "/dashboard/applicants",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
]

// Menu items for Job Seekers
const seekerItems: NavItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Applications",
    url: "/dashboard/applications",
    icon: FileText,
  },
  {
    title: "Saved Jobs",
    url: "/dashboard/saved",
    icon: Heart,
  },
]

// Global items for everyone (The Bridge)
const platformItems: NavItem[] = [
  {
    title: "Find Jobs",
    url: "/jobs",
    icon: Search,
  },
  {
    title: "Home Page",
    url: "/",
    icon: Home,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { isEmployer, loading } = useAuthContext()

  // During loading or if not authenticated (though middleware protects this), 
  // we default to a safe state or empty.
  const mainNavItems = isEmployer ? employerItems : seekerItems
  const portalLabel = isEmployer ? "Employer Portal" : "Candidate Portal"
  const PortalIcon = isEmployer ? Building2 : Briefcase

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-card/40 backdrop-blur-xl" {...props}>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PortalIcon className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-black text-lg tracking-tight">JobBoard</span>
            <span className="truncate text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              {loading ? "Loading..." : portalLabel}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Dashboard Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest px-4 mb-2 text-muted-foreground/70">
            Management
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const isActive = pathname === item.url
              return (
                <SidebarMenuItem key={item.title} className="relative">
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={isActive}
                    className={cn(
                      "transition-all duration-200 h-11 px-4",
                      isActive ? "bg-primary/10 text-primary font-black shadow-sm ring-1 ring-primary/20" : "font-bold text-muted-foreground hover:bg-muted hover:text-foreground",
                      item.suffix ? "pr-12" : ""
                    )}
                  >
                    <Link href={item.url} className="flex items-center w-full gap-3">
                      <item.icon className={cn("size-5", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="flex-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.suffix && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 group-data-[collapsible=icon]:hidden text-muted-foreground hover:text-foreground">
                      {item.suffix}
                    </div>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="opacity-50 mx-4" />

        {/* The Bridge (Platform Links) */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest px-4 mb-2 text-muted-foreground/70 group-data-[collapsible=icon]:hidden">
            Public Access
          </SidebarGroupLabel>
          <SidebarMenu>
            {platformItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                 <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    className="font-bold text-muted-foreground hover:bg-muted hover:text-foreground h-11 px-4"
                  >
                    <Link href={item.url} className="flex items-center w-full gap-3">
                      <item.icon className="size-5 text-muted-foreground" />
                      <span className="flex-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
