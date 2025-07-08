"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, FileText, User, Award, Code, BookOpen, Briefcase, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { SearchService, type SearchableContent } from "@/lib/search-service"

interface SearchProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchableContent[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchStats, setSearchStats] = useState({ blogs: 0, notes: 0, total: 0 })
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchService = SearchService.getInstance()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      // Build search index when modal opens
      searchService.buildSearchIndex().then((index) => {
        const blogs = index.filter((item) => item.type === "blog").length
        const notes = index.filter((item) => item.type === "notes").length
        setSearchStats({ blogs, notes, total: index.length })
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)

    const searchTimeout = setTimeout(async () => {
      try {
        const searchResults = await searchService.searchContent(query)
        setResults(searchResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleResultClick(results[selectedIndex])
    }
  }

  const handleResultClick = (result: SearchableContent) => {
    if (result.type === "blog") {
      // Open external Medium link
      window.open(result.url, "_blank", "noopener,noreferrer")
    } else {
      // Navigate to internal page
      router.push(result.url)
    }
    onClose()
    setQuery("")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "experience":
        return <Briefcase size={16} />
      case "skills":
        return <Code size={16} />
      case "certifications":
        return <Award size={16} />
      case "blog":
        return <BookOpen size={16} />
      case "notes":
        return <FileText size={16} />
      case "about":
        return <User size={16} />
      default:
        return <FileText size={16} />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "experience":
        return "text-blue-400"
      case "skills":
        return "text-purple-400"
      case "certifications":
        return "text-yellow-400"
      case "blog":
        return "text-green-400"
      case "notes":
        return "text-cyan-400"
      case "about":
        return "text-pink-400"
      default:
        return "text-green-400"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-black/95 border border-green-400 rounded-lg w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center p-4 border-b border-green-400/30">
          <Search className="text-green-400 mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search across blogs, notes, skills, and more..."
            className="flex-1 bg-transparent text-green-400 placeholder-green-400/50 outline-none font-mono"
          />
          <button onClick={onClose} className="text-green-400 hover:text-green-300 ml-3">
            <X size={20} />
          </button>
        </div>

        {/* Search Stats */}
        {searchStats.total > 0 && (
          <div className="px-4 py-2 border-b border-green-400/30 bg-green-400/5">
            <div className="text-green-400 text-xs">
              Index: {searchStats.blogs} blogs • {searchStats.notes} notes • {searchStats.total} total items
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-green-400">
              <div className="animate-pulse">Searching across all content...</div>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-4 text-center text-green-400/70">
              No results found for "{query}"
              <div className="text-xs mt-1">
                Try searching for: siem, penetration testing, forensics, or specific tools
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    index === selectedIndex ? "bg-green-400/10 border border-green-400/30" : "hover:bg-green-400/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${getTypeColor(result.type)}`}>{getTypeIcon(result.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-green-400 font-medium text-sm truncate flex-1">{result.title}</h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded border ${getTypeColor(result.type)} border-current`}
                          >
                            {result.type}
                          </span>
                          {result.type === "blog" && <ExternalLink size={12} className="text-green-400/70" />}
                        </div>
                      </div>

                      <p className="text-green-300/80 text-xs line-clamp-2 mb-2">{result.content}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {result.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs px-1 py-0.5 bg-green-400/10 text-green-400 rounded">
                              #{tag}
                            </span>
                          ))}
                          {result.tags.length > 3 && (
                            <span className="text-xs text-green-400/70">+{result.tags.length - 3} more</span>
                          )}
                        </div>

                        {(result.publishedDate || result.lastModified) && (
                          <span className="text-xs text-green-300/70">
                            {formatDate(result.publishedDate || result.lastModified)}
                          </span>
                        )}
                      </div>

                      {result.author && <div className="text-xs text-green-300/70 mt-1">by {result.author}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-4 text-green-400/70 text-sm">
              <div className="mb-3 font-bold">Enhanced Search Features:</div>
              <div className="space-y-1 text-xs">
                <div>
                  • <span className="text-green-400">Live Content</span>: Search across Medium blogs and Notion notes
                </div>
                <div>
                  • <span className="text-green-400">Auto-Detection</span>: Content automatically indexed from APIs
                </div>
                <div>
                  • <span className="text-green-400">Smart Filtering</span>: Search by skills, tools, categories, or
                  content
                </div>
                <div>
                  • <span className="text-green-400">Real-time Updates</span>: Index refreshes every 5 minutes
                </div>
              </div>
              <div className="mt-4 text-xs">
                <div className="font-bold mb-1">Try searching for:</div>
                <div className="text-green-300/70">
                  "siem detection", "lateral movement", "penetration testing", "qradar", "splunk", "forensics"
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="border-t border-green-400/30 p-3 text-xs text-green-400/70">
          <div className="flex justify-between">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <span>{results.length} results</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-green-400 border border-green-400 rounded hover:bg-green-400/10 transition-colors text-sm"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search</span>
        <span className="hidden md:inline text-xs text-green-400/70">⌘K</span>
      </button>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
