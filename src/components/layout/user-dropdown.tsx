"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/auth-provider";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User, Building2, Briefcase, LayoutDashboard, Home } from "lucide-react";

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function UserDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, isEmployer, signOut, loading } = useAuthContext();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (loading) {
    return (
      <div className="size-9 animate-pulse rounded-full bg-muted" />
    );
  }

  if (!user) {
    return null;
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="size-9 cursor-pointer border-2 border-transparent transition-colors hover:border-primary/50">
            <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center gap-1 pt-1">
              {isEmployer ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Building2 className="size-3" />
                  Employer
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <Briefcase className="size-3" />
                  Job Seeker
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isDashboard ? (
             <DropdownMenuItem asChild>
               <Link href="/" className="cursor-pointer">
                 <Home className="mr-2 size-4" />
                 Home Page
               </Link>
             </DropdownMenuItem>
          ) : (
             <DropdownMenuItem asChild>
               <Link href="/dashboard" className="cursor-pointer">
                 <LayoutDashboard className="mr-2 size-4" />
                 Dashboard
               </Link>
             </DropdownMenuItem>
          )}
        
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
