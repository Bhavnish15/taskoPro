"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, Settings, Crown, Wallet, Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }
console.log({user})
  const NavLinks = () => (
    <>
      {isAuthenticated ? (
        <>
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/tasks" onClick={() => setIsOpen(false)}>
            <Button variant="ghost">Tasks</Button>
          </Link>
          <Link href="/upgrade" onClick={() => setIsOpen(false)}>
            <Button variant="ghost">Upgrade</Button>
          </Link>
          {user?.isAdmin && (
            <Link href="/admin" onClick={() => setIsOpen(false)}>
              <Button variant="ghost">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
        </>
      ) : (
        <>
          <Link href="/faq" onClick={() => setIsOpen(false)}>
            <Button variant="ghost">FAQ</Button>
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            <Button variant="ghost">Contact</Button>
          </Link>
        </>
      )}
    </>
  )

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <Crown className="w-6 h-6 text-primary" />
          TaskoPro
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavLinks />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Wallet className="w-4 h-4" />
                <span className="font-medium">{user?.wallet || 0}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || user?.email || ""} />
                      <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.displayName && <p className="font-medium">{user.displayName}</p>}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                      <Badge variant="outline" className="w-fit">
                        VIP {user?.vipLevel}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/auth">
              <Button>Get Started</Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && (
            <div className="flex items-center gap-2 text-sm">
              <Wallet className="w-4 h-4" />
              <span className="font-medium">{user?.wallet || 0}</span>
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || user.email} />
                      <AvatarFallback>{user.displayName?.[0] || user.email[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-medium">{user.displayName || user.email}</p>
                      <Badge variant="outline" className="w-fit">
                        VIP {user.vipLevel}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <NavLinks />
                </div>

                {isAuthenticated ? (
                  <Button onClick={handleSignOut} variant="outline" className="mt-4">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="mt-4 w-full">Get Started</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
