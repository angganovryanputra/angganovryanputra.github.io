"use client"

import { useState, useEffect } from "react"
import { Search, X, Clock, FileText, ExternalLink, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface SearchEntry {
  id: string
  title: string
  content: string
  excerpt?: string
  url: string
  type: "note" | "medium" | "static"
  tags: string[]
  category?: string
  publishedDate?: string
  updatedAt?: string
  readingTime?: number
  cover?: string | null
  keywords?: string[]
  score?: number
  matchHighlights?: string[]
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void
}

// Helper to generate a clean snippet and highlight the query
function HighlightedSnippet({ text, query }: { text: string; query: string }) {
  if (!text) return null

  const cleanedText = text.replace(/#+\s/g, "").replace(/\s+/g, " ").trim()

  if (!query) {
    return <span className="text-green-300/70">{cleanedText.substring(0, 160)}…</span>
  }

  const lowerText = cleanedText.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const matchIndex = lowerText.indexOf(lowerQuery)

  if (matchIndex === -1) {
    return <span className="text-green-300/70">{cleanedText.substring(0, 160)}…</span>
  }

  const start = Math.max(0, matchIndex - 90)
  const end = Math.min(cleanedText.length, matchIndex + lowerQuery.length + 90)
  const snippet = cleanedText.substring(start, end)

  return (
    <p className="text-green-300/70 text-sm leading-relaxed">
      {start > 0 && "…"}
      {snippet.split(new RegExp(`(${query})`, "gi")).map((part, index) =>
        part.toLowerCase() === lowerQuery ? (
          <span key={index} className="bg-green-400/20 text-green-100 font-semibold rounded-sm px-1">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
      {end < cleanedText.length && "…"}
    </p>
  )
}

const FALLBACK_COVER = "https://placehold.co/640x360/022c22/34d399.png?text=Cybersecurity+Note"

const ensureExcerpt = (entry: SearchEntry): SearchEntry => {
  const excerpt = entry.excerpt?.trim()
  if (excerpt && excerpt.length > 0) {
    return entry
  }
  const fallbackExcerpt = entry.content.length > 220 ? `${entry.content.slice(0, 220)}…` : entry.content
  return { ...entry, excerpt: fallbackExcerpt }
}

const tokenize = (value: string) =>
  Array.from(
    new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9+#]+/i)
        .map((token) => token.trim())
        .filter(Boolean),
    ),
  )

const computeRecencyBoost = (publishedDate?: string) => {
  if (!publishedDate) return 0
  const published = new Date(publishedDate)
  if (Number.isNaN(published.getTime())) return 0
  const daysAgo = (Date.now() - published.getTime()) / (1000 * 60 * 60 * 24)
  if (daysAgo <= 30) return 3
  if (daysAgo <= 90) return 2
  if (daysAgo <= 365) return 1
  return 0
}

const buildMatchSummary = (reasons: Map<string, number>) =>
  Array.from(reasons.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([reason]) => reason)

function SearchResultItem({ result, onClose, query }: { result: SearchEntry; onClose: () => void; query: string }) {
  const isExternal = result.type === "medium"
  const Icon = result.type === "note" ? FileText : ExternalLink

  const readingTime = result.readingTime ? `${result.readingTime} min read` : null

  const content = (
    <div className="w-full flex items-start gap-4 p-4 bg-black/50 hover:bg-green-400/10 border border-transparent hover:border-green-400/30 rounded-lg transition-all duration-200 cursor-pointer">
      <Icon className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <h3 className="text-green-300 font-semibold text-base group-hover:text-green-200">{result.title}</h3>
          <Badge variant="outline" className={`border-green-400/40 text-green-300 text-xs ml-4`}>
            {result.type}
          </Badge>
        </div>
        <div className="text-xs text-green-400/60 mt-1 flex flex-wrap items-center gap-3">
          {result.publishedDate && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(result.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {readingTime && <span>{readingTime}</span>}
          {result.category && <span className="text-green-300/70">{result.category}</span>}
          {typeof result.score === "number" && (
            <span className="inline-flex items-center gap-1 bg-green-900/40 border border-green-400/40 text-green-200 px-2 py-0.5 rounded-full">
              <Zap className="w-3 h-3" />
              Skor {result.score}
            </span>
          )}
        </div>
        {(result.cover ?? FALLBACK_COVER) && (
          <div className="mt-3">
            <div className="relative w-full overflow-hidden rounded border border-green-400/20" style={{ aspectRatio: "16 / 9" }}>
              <Image
                src={result.cover || FALLBACK_COVER}
                alt={result.title}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
          </div>
        )}
        <div className="mt-2">
          <HighlightedSnippet text={result.excerpt || result.content} query={query} />
        </div>
        {result.matchHighlights && result.matchHighlights.length > 0 && (
          <div className="mt-2 text-xs text-green-400/70 flex flex-wrap gap-2">
            {result.matchHighlights.slice(0, 3).map((highlight, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-green-900/40 border border-green-400/30 px-2 py-1 rounded-full">
                <Search className="w-3 h-3" />
                {highlight}
              </span>
            ))}
          </div>
        )}
        {result.tags && result.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {result.tags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-green-900/50 text-green-300 text-xs font-normal">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={result.url} target="_blank" rel="noopener noreferrer" onClick={onClose}>
        {content}
      </a>
    );
  }

  return (
    <Link href={result.url} passHref legacyBehavior>
      <a onClick={onClose}>{content}</a>
    </Link>
  );
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
          setSearchIndex(data.map(ensureExcerpt))
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
    if (!query.trim() || !isIndexLoaded) {
      setResults([])
      return
    }

    const normalizedQuery = query.trim().toLowerCase()
    const queryTokens = tokenize(normalizedQuery)

    const rankedResults = searchIndex
      .map((item) => {
        const title = item.title.toLowerCase()
        const excerpt = (item.excerpt || item.content).toLowerCase()
        const content = item.content.toLowerCase()
        const tags = item.tags?.map((tag) => tag.toLowerCase()) ?? []
        const category = item.category?.toLowerCase() ?? ""
        const keywords = (item.keywords || []).map((keyword) => keyword.toLowerCase())

        let score = 0
        const matchReasons = new Map<string, number>()

        if (title.includes(normalizedQuery) && normalizedQuery.length > 1) {
          score += 8
          matchReasons.set("Judul mengandung kata kunci", 3)
        }

        queryTokens.forEach((token) => {
          if (title.includes(token)) {
            score += 5
            matchReasons.set(`Judul cocok dengan "${token}"`, 2)
          }
          if (tags.some((tag) => tag.includes(token))) {
            score += 4
            matchReasons.set(`Tag terkait "${token}"`, 2)
          }
          if (category.includes(token)) {
            score += 3
            matchReasons.set(`Kategori menyertakan "${token}"`, 1.5)
          }
          if (keywords.some((keyword) => keyword.includes(token))) {
            score += 2
            matchReasons.set(`Keyword khusus berisi "${token}"`, 1.2)
          }
          if (excerpt.includes(token)) {
            score += 2
            matchReasons.set(`Ringkasan menyinggung "${token}"`, 1)
          } else if (content.includes(token)) {
            score += 1
          }
        })

        const recencyBoost = computeRecencyBoost(item.publishedDate)
        if (recencyBoost > 0) {
          score += recencyBoost
          matchReasons.set("Konten masih baru", recencyBoost)
        }

        if (score === 0) {
          return null
        }

        return {
          item,
          score,
          reasons: buildMatchSummary(matchReasons),
        }
      })
      .filter((value): value is { item: SearchEntry; score: number; reasons: string[] } => value !== null)

    rankedResults.sort((a, b) => b.score - a.score)

    setResults(
      rankedResults.map(({ item, score, reasons }) => ({
        ...item,
        score,
        matchHighlights: reasons,
      })),
    )
  }, [query, searchIndex, isIndexLoaded])

  const handleClose = () => {
    setQuery("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-black/80 border-green-400/50 text-green-300 max-w-2xl p-0">
        <DialogHeader className="p-4 border-b border-green-400/30">
          <DialogTitle className="flex items-center gap-2 text-green-400">
            <Zap className="w-5 h-5" />
            Advanced Search
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400/70" />
            <Input
              type="text"
              placeholder="Search notes, articles, keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-black/50 border-green-400/50 rounded-md pl-10 pr-10 focus:ring-green-400 focus:border-green-400"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-green-400/70 hover:text-green-300"
                onClick={() => setQuery('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {loading && (
            <div className="text-center py-8 text-green-300">Loading search index...</div>
          )}

          {error && (
            <div className="text-center py-8 text-red-400">Error: {error}</div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
              {results.map((result) => (
                <SearchResultItem key={result.id} result={result} onClose={handleClose} query={query} />
              ))}
            </div>
          )}

          {/* No Results Message */}
          {query && !loading && results.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-green-400/50 mx-auto mb-4" />
              <div className="text-green-300 text-lg mb-2">No results found for &quot;{query}&quot;</div>
              <div className="text-green-300/70 text-sm">Try different keywords or check your spelling</div>
            </div>
          )}

          {/* Search Tips */}
          {!query && !loading && (
            <div className="bg-black/80 border border-green-400/30 p-4 rounded">
              <h4 className="text-green-400 font-semibold mb-2">Search Tips:</h4>
              <ul className="text-green-300 text-sm space-y-1">
                <li>• Use specific cybersecurity terms for better results (e.g., &quot;XSS&quot;, &quot;Nmap&quot;)</li>
                <li>• Search across both Medium articles and personal notes</li>
                <li>• Press <kbd className="px-2 py-1 text-xs bg-green-400/10 border border-green-400/30 rounded">⌘K</kbd> to open search anytime</li>
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
