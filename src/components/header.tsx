"use client";

import { ModeToggle } from "./mode-toggle";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Upload, User, LogOut, FileText, Shield, Settings, Award, PhoneCall, Megaphone, MoreVertical, Search } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "admin" || userRole === "founder";

  return (
    <header className="app-header sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fadeIn glass-surface gradient-sheen">
      <div className="flex h-16 items-center justify-between w-full px-4 lg:px-6">
        <div className="flex items-center gap-8 flex-1 min-w-0">
          <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-all duration-300 hover:scale-105">
            Reviewer's Menu
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/grade/7" className="text-sm hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-0.5">
              Grade 7
            </Link>
            <Link href="/grade/8" className="text-sm hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-0.5">
              Grade 8
            </Link>
            <Link href="/grade/9" className="text-sm hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-0.5">
              Grade 9
            </Link>
            <Link href="/grade/10" className="text-sm hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-0.5">
              Grade 10
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/search" aria-label="Search">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <ModeToggle />
          {session ? (
            <>
              {isAdmin && (
                <Button asChild size="sm" variant="default" className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Link href="/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    <span className="hidden lg:inline">Upload</span>
                  </Link>
                </Button>
              )}
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Avatar className="transition-all duration-300">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="transition-all duration-200 hover:translate-x-1">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="transition-all duration-200 hover:translate-x-1">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/credits" className="transition-all duration-200 hover:translate-x-1">
                    <Award className="mr-2 h-4 w-4" />
                    Credits
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="https://discord.gg/2rPCnZwcbM" className="transition-all duration-200 hover:translate-x-1">
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Contact Us
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/broadcasts" className="transition-all duration-200 hover:translate-x-1">
                        <Megaphone className="mr-2 h-4 w-4" />
                        Broadcasts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/reviewers" className="transition-all duration-200 hover:translate-x-1">
                        <FileText className="mr-2 h-4 w-4" />
                        Manage Reviewers
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/pointers" className="transition-all duration-200 hover:translate-x-1">
                        <FileText className="mr-2 h-4 w-4" />
                        Pointers Management
                      </Link>
                    </DropdownMenuItem>
                    
                    {userRole === "founder" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/users" className="transition-all duration-200 hover:translate-x-1">
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Admins
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-110" aria-label="Open menu" title="Open menu">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="transition-all duration-200 hover:translate-x-1">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/credits" className="transition-all duration-200 hover:translate-x-1">
                      <Award className="mr-2 h-4 w-4" />
                      Credits
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="https://discord.gg/2rPCnZwcbM" className="transition-all duration-200 hover:translate-x-1">
                      <PhoneCall className="mr-2 h-4 w-4" />
                      Contact Us
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button asChild size="sm" variant="default">
                <Link href="/login">
                  🔐 Admin Login
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}