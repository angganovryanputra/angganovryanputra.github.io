"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Shield, Terminal, User, Briefcase, Award, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdvancedSearchButton } from "@/components/advanced-search"
import { cn } from "@/lib/utils"

const navigationItems = [
  { href: "/", label: "Home", icon: Terminal },
  { href: "/about", label: "About", icon: User },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/skills", label: "Skills", icon: Award },
  { href: "/certifications", label: "Certifications", icon: Award },
  { href: "/articles", label: "Articles", icon: ExternalLink },
  { href: "/notes", label: "Notes", icon: FileText },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden" // Prevent background scroll
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "bg-black/90 backdrop-blur-md border-b border-green-400/30",
          scrolled && "bg-black/95 border-green-400/50 shadow-lg shadow-green-400/10",
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors group"
            >
              <div className="relative">
                <Shield className="w-8 h-8 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 w-8 h-8 border border-green-400/30 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg font-mono">mxz4rt</div>
                <div className="text-xs text-green-300 font-mono">Security Professional</div>
              </div>
              <div className="sm:hidden">
                <div className="font-bold text-lg font-mono">mxz4rt</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      "hover:scale-105 hover:shadow-md hover:shadow-green-400/20",
                      isActive
                        ? "bg-green-400/20 text-green-300 border border-green-400/50 shadow-md shadow-green-400/20"
                        : "text-green-400 hover:text-green-300 hover:bg-green-400/10",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-mono">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* Search Button - Always visible */}
              <div className="hidden sm:block">
                <AdvancedSearchButton />
              </div>

              {/* Mobile Search Icon */}
              <div className="sm:hidden">
                <AdvancedSearchButton />
              </div>

              {/* Mobile menu button */}
              <Button
                aria-label={isOpen ? "Close main menu" : "Open main menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={toggleMenu}
                variant="ghost"
                size="icon"
                className="lg:hidden text-green-400 hover:text-green-300 hover:bg-green-400/10"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            id="mobile-menu"
            className={cn(
              "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div className="border-t border-green-400/30 py-4">
              <div className="flex flex-col space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                        "hover:translate-x-2 hover:shadow-md hover:shadow-green-400/20",
                        isActive
                          ? "bg-green-400/20 text-green-300 border border-green-400/50 shadow-md shadow-green-400/20"
                          : "text-green-400 hover:text-green-300 hover:bg-green-400/10",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-mono">{item.label}</span>
                      {isActive && <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-16" />
    </>
  )
}
