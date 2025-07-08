"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { List, ChevronDown, ChevronRight, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TableOfContentsItem } from "@/lib/local-notes"

interface TableOfContentsProps {
  items: TableOfContentsItem[]
  className?: string
}

interface TocItemProps {
  item: TableOfContentsItem
  depth: number
  activeId: string
  onItemClick: (anchor: string) => void
}

function TocItem({ item, depth, activeId, onItemClick }: TocItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const isActive = activeId === item.anchor
  const hasChildren = item.children && item.children.length > 0

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onItemClick(item.anchor)
  }

  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center group cursor-pointer rounded-md transition-all duration-200",
          "hover:bg-green-400/10 hover:translate-x-1",
          isActive && "bg-green-400/20 text-green-300 shadow-sm",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren && (
          <Button
            onClick={toggleExpanded}
            variant="ghost"
            size="sm"
            className="p-0 h-auto w-4 mr-1 text-green-400/60 hover:text-green-400 hover:bg-transparent"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </Button>
        )}

        <button
          onClick={handleClick}
          className={cn(
            "flex items-center flex-1 py-2 px-2 text-left text-sm transition-colors duration-200",
            "hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-black rounded",
            isActive ? "text-green-300 font-medium" : "text-green-400",
          )}
        >
          <Hash className="w-3 h-3 mr-2 opacity-60" />
          <span className="truncate">{item.title}</span>
        </button>

        {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-400 rounded-full" />}
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {item.children!.map((child) => (
            <TocItem key={child.id} item={child} depth={depth + 1} activeId={activeId} onItemClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  )
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [activeId, setActiveId] = useState("")

  // Track which heading is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id) {
              setActiveId(id)
            }
          }
        })
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0.1,
      },
    )

    // Observe all headings
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    headings.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading)
      }
    })

    return () => {
      headings.forEach((heading) => {
        if (heading.id) {
          observer.unobserve(heading)
        }
      })
    }
  }, [])

  const handleItemClick = (anchor: string) => {
    const element = document.getElementById(anchor)
    if (element) {
      // Smooth scroll to element with offset for fixed header
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Update URL hash without triggering scroll
      history.replaceState(null, "", `#${anchor}`)

      // Set active immediately for better UX
      setActiveId(anchor)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn("bg-black/90 border border-green-400 rounded-lg", className)}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-green-400 font-bold flex items-center font-mono">
            <List className="w-4 h-4 mr-2" />
            Table of Contents
          </h3>
          <Button
            onClick={() => setIsVisible(!isVisible)}
            variant="ghost"
            size="sm"
            className="text-green-400 hover:text-green-300 hover:bg-green-400/10 h-6 px-2"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", !isVisible && "rotate-180")} />
          </Button>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400/30 scrollbar-track-transparent">
            <div className="space-y-1 pr-2">
              {items.map((item) => (
                <TocItem key={item.id} item={item} depth={0} activeId={activeId} onItemClick={handleItemClick} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
