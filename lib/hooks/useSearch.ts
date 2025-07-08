"use client"

import { useState, useEffect, useMemo } from "react"
import { useDebounce } from "./useDebounce"
import { SEARCH_CONFIG } from "@/lib/constants"

export interface SearchResult {
  id: string
  title: string
  content: string
  excerpt: string
  category?: string
  tags: string[]
  score: number
}

export interface SearchableItem {
  id: string
  title: string
  content: string
  excerpt: string
  category?: string
  tags: string[]
}

export function useSearch<T extends SearchableItem>(items: T[]) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, SEARCH_CONFIG.debounceMs)

  const results = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < SEARCH_CONFIG.minQueryLength) {
      return []
    }

    const searchTerms = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean)

    const searchResults = items
      .map((item) => {
        let score = 0
        const titleLower = item.title.toLowerCase()
        const contentLower = item.content.toLowerCase()
        const categoryLower = item.category?.toLowerCase() || ""
        const tagsLower = item.tags.map((tag) => tag.toLowerCase())

        // Title matches (highest weight)
        searchTerms.forEach((term) => {
          if (titleLower.includes(term)) {
            score += 10
            if (titleLower.startsWith(term)) score += 5
          }
        })

        // Category matches
        searchTerms.forEach((term) => {
          if (categoryLower.includes(term)) {
            score += 5
          }
        })

        // Tag matches
        searchTerms.forEach((term) => {
          tagsLower.forEach((tag) => {
            if (tag.includes(term)) {
              score += 3
              if (tag === term) score += 2
            }
          })
        })

        // Content matches (lower weight)
        searchTerms.forEach((term) => {
          const matches = (contentLower.match(new RegExp(term, "g")) || []).length
          score += matches * 0.5
        })

        return {
          ...item,
          score,
        }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, SEARCH_CONFIG.maxResults)

    return searchResults
  }, [items, debouncedQuery])

  const search = (newQuery: string) => {
    setQuery(newQuery)
    if (newQuery && newQuery.length >= SEARCH_CONFIG.minQueryLength) {
      setIsLoading(true)
      // Simulate loading delay for better UX
      setTimeout(() => setIsLoading(false), 100)
    } else {
      setIsLoading(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setIsLoading(false)
  }

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(false)
    }
  }, [debouncedQuery])

  return {
    query,
    results,
    isLoading,
    search,
    clearSearch,
    hasResults: results.length > 0,
    totalResults: results.length,
  }
}
