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
import { Upload, User, LogOut, FileText, Shield, Settings } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "admin" || userRole === "founder";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
            Project Red
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/grade/7" className="text-sm hover:text-primary transition-colors">
              Grade 7
            </Link>
            <Link href="/grade/8" className="text-sm hover:text-primary transition-colors">
              Grade 8
            </Link>
            <Link href="/grade/9" className="text-sm hover:text-primary transition-colors">
              Grade 9
            </Link>
            <Link href="/grade/10" className="text-sm hover:text-primary transition-colors">
              Grade 10
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {session ? (
            <>
              {isAdmin && (
                <Button asChild size="sm" variant="default">
                  <Link href="/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Link>
                </Button>
              )}
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/reviewers">
                        <FileText className="mr-2 h-4 w-4" />
                        Manage Reviewers
                      </Link>
                    </DropdownMenuItem>
                    {userRole === "founder" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/users">
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
            <Button asChild size="sm" variant="default">
              <Link href="/login">
                🔐 Admin Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}