"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, Clock, FileText, ExternalLink, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SearchEntry {
  id: string;
  title: string;
  content: string;
  url: string;
  type: 'notes' | 'medium';
  tags: string[];
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void
}

export function AdvancedSearch({ isOpen, onClose }: AdvancedSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchIndex, setSearchIndex] = useState<SearchEntry[]>([])
  const [isIndexLoaded, setIsIndexLoaded] = useState(false)

  useEffect(() => {
    if (isOpen && !isIndexLoaded) {
      setLoading(true)
      fetch('/search-index.json')
        .then((res) => res.json())
        .then((data) => {
          setSearchIndex(data)
          setIsIndexLoaded(true)
        })
        .catch((err) => {
          console.error('Failed to load search index:', err)
          setError('Could not load search data.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, isIndexLoaded])

  useEffect(() => {
    if (!query || !isIndexLoaded) {
      setResults([])
      return
    }

    const lowerCaseQuery = query.toLowerCase()
    const filteredResults = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.content.toLowerCase().includes(lowerCaseQuery) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
    )
    setResults(filteredResults)

  }, [query, searchIndex, isIndexLoaded])

  const handleResultClick = () => {
    onClose()
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "medium":
        return <ExternalLink className="w-4 h-4" />
      case "notes":
        return <FileText className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "medium":
        return "bg-green-400/20 text-green-400 border-green-400"
      case "notes":
        return "bg-cyan-400/20 text-cyan-400 border-cyan-400"
      default:
        return "bg-gray-400/20 text-gray-400 border-gray-400"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-black border-green-400 text-green-400">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-400">
            <Zap className="w-5 h-5" />
            Advanced Search
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search across articles and notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-black border-green-400 text-green-300 placeholder-green-500 focus:border-green-300"
              autoFocus
            />
            {query && (
              <Button
                onClick={() => setQuery("")}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              <span className="ml-2 text-green-300">Searching...</span>
            </div>
          )}

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-black/80 border border-green-400/30 p-4 rounded hover:border-green-400/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <Link
                      href={result.url}
                      onClick={handleResultClick}
                      className="text-green-400 hover:text-green-300 font-semibold text-sm md:text-base"
                    >
                      {result.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getSourceColor(result.type)}>
                        {getSourceIcon(result.type)}
                        <span className="ml-1">{result.type}</span>
                      </Badge>
                      <div className="text-xs text-green-300">Score: </div>
                    </div>
                  </div>
                </div>

                <p className="text-green-300 text-sm mb-3 line-clamp-2">{result.content}</p>

                {result.tags && result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {result.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {result.tags.length > 5 && (
                      <span className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs rounded">
                        +{result.tags.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {!loading && query && results.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-green-400/50 mx-auto mb-4" />
              <div className="text-green-300 text-lg mb-2">No results found</div>
              <div className="text-green-300/70 text-sm">Try different keywords or check your spelling</div>
            </div>
          )}

          {/* Search Tips */}
          {!query && (
            <div className="bg-black/80 border border-green-400/30 p-4 rounded">
              <h4 className="text-green-400 font-semibold mb-2">Search Tips:</h4>
              <ul className="text-green-300 text-sm space-y-1">
                <li>• Use specific cybersecurity terms for better results</li>
                <li>• Search across both Medium articles and personal notes</li>
                <li>• Results are ranked by relevance and confidence</li>
                <li>• Use quotes for exact phrase matching</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AdvancedSearchButton() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="text-green-400 hover:text-green-300 hover:bg-green-400/10 flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-400/10 border border-green-400/30 rounded">
          <span>⌘</span>K
        </kbd>
      </Button>
      <AdvancedSearch isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
