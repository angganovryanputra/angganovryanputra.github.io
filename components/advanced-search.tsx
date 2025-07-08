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
  type: 'notes' | 'medium' | 'static';
  tags: string[];
  publishedDate?: string;
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void
}

// Helper to generate a clean snippet and highlight the query
function HighlightedSnippet({ text, query }: { text: string; query: string }) {
  if (!query) {
    return <span className="text-green-300/70">{text.substring(0, 150)}...</span>;
  }

  // Clean markdown hashes and excessive newlines
  const cleanedText = text.replace(/#+\s/g, '').replace(/\n{2,}/g, ' ');
  const lowerText = cleanedText.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts = cleanedText.split(new RegExp(`(${query})`, 'gi'));

  const index = lowerText.indexOf(lowerQuery);
  const start = Math.max(0, index - 75);
  const end = Math.min(cleanedText.length, index + lowerQuery.length + 75);
  const snippet = cleanedText.substring(start, end);

  return (
    <p className="text-green-300/70 text-sm leading-relaxed">
      {start > 0 && '...'}
      {snippet.split(new RegExp(`(${query})`, 'gi')).map((part, i) =>
        part.toLowerCase() === lowerQuery ? (
          <span key={i} className="bg-green-400/20 text-green-300 font-bold rounded-sm px-1">
            {part}
          </span>
        ) : (
          part
        )
      )}
      {end < cleanedText.length && '...'}
    </p>
  );
}

function SearchResultItem({ result, onClose }: { result: SearchEntry; onClose: () => void }) {
  const isExternal = result.type === 'medium';
  const Icon = result.type === 'notes' ? FileText : ExternalLink;

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
        {result.publishedDate && (
          <div className="text-xs text-green-400/60 mt-1">
            {new Date(result.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        )}
        <div className="mt-2">
          <HighlightedSnippet text={result.content} query={''} />
        </div>
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
                <SearchResultItem key={result.id} result={result} onClose={handleClose} />
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
