import { AppSidebar } from "@/components/layout/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { UserDropdown } from "@/components/layout/user-dropdown"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex w-full flex-col bg-muted/5">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-background/80 px-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1 text-primary hover:bg-primary/10 transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadcrumbNav />
            </div>
            <div className="flex items-center gap-4">
              <UserDropdown />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
