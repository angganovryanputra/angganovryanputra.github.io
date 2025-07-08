"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MatrixRain } from "@/components/matrix-rain"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { TableOfContents } from "@/components/table-of-contents"
import { localNotesManager, type LocalNote } from "@/lib/local-notes"
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Tag,
  Folder,
  Share2,
  Download,
  BookOpen,
  FileText,
  AlertCircle,
  ImageIcon,
  ArrowUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const [note, setNote] = useState<LocalNote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedNotes, setRelatedNotes] = useState<LocalNote[]>([])
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const slug = params.slug as string

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowScrollToTop(scrollTop > 400)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    if (slug) {
      loadNote(slug)
    }
  }, [slug])

  const loadNote = async (noteSlug: string) => {
    try {
      setLoading(true)
      setError(null)

      const noteData = await localNotesManager.getNoteBySlug(noteSlug)

      if (!noteData) {
        setError("Note not found. It may have been moved or deleted.")
        return
      }

      setNote(noteData)

      // Load related notes (same category or shared tags)
      const allNotes = await localNotesManager.getAllNotes()
      const related = allNotes
        .filter((n) => n.id !== noteData.id)
        .filter((n) => {
          const sameCategory = n.category === noteData.category
          const sharedTags = n.tags.some((tag) => noteData.tags.includes(tag))
          return sameCategory || sharedTags
        })
        .slice(0, 6)

      setRelatedNotes(related)
    } catch (err) {
      setError("Failed to load note. Please try again.")
      console.error("Error loading note:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && note) {
      try {
        await navigator.share({
          title: note.title,
          text: note.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleDownload = () => {
    if (!note) return

    const content = `---
title: "${note.title}"
author: "${note.frontmatter.author || "Unknown"}"
date: "${note.frontmatter.date || note.lastModified}"
category: "${note.category || "Uncategorized"}"
tags: [${note.tags.map((tag) => `"${tag}"`).join(", ")}]
---

${note.content}`

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${note.slug}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const estimateReadTime = (content: string): string => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Alert className="border-red-400 bg-red-400/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">{error || "Note not found"}</AlertDescription>
              </Alert>
              <div className="mt-6">
                <Button
                  onClick={() => router.push("/notes")}
                  variant="outline"
                  className="border-green-400 text-green-400 hover:bg-green-400/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Notes
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixRain />

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-green-400/20 border-2 border-green-400/60 text-green-400 hover:bg-green-400/30 hover:border-green-400 hover:text-green-300 transition-all duration-300 shadow-lg shadow-green-400/20 backdrop-blur-sm"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      <div className="relative z-10">
        <Navigation />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Button
                onClick={() => router.push("/notes")}
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Table of Contents - Sidebar */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="sticky top-8">
                  <TableOfContents items={note.tableOfContents} />
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                {/* Article Header */}
                <Card className="bg-black/80 border-green-400 mb-8">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-3xl md:text-4xl font-bold text-green-400 mb-4">
                          {note.title}
                        </CardTitle>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-green-300 mb-4">
                          {note.frontmatter.author && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{note.frontmatter.author}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(note.lastModified).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{estimateReadTime(note.content)}</span>
                          </div>
                          {note.images.length > 0 && (
                            <div className="flex items-center gap-1">
                              <ImageIcon className="w-4 h-4" />
                              <span>
                                {note.images.length} image{note.images.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Categories and Tags */}
                        <div className="flex flex-wrap gap-2 items-center mb-4">
                          {note.category && (
                            <Badge className="bg-green-400/20 text-green-400 border-green-400">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {note.category}
                            </Badge>
                          )}
                          {note.subfolder && (
                            <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">
                              <Folder className="w-3 h-3 mr-1" />
                              {note.subfolder}
                            </Badge>
                          )}
                        </div>

                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {note.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/20 transition-colors"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Excerpt */}
                        {note.excerpt && (
                          <p className="text-green-300 text-lg leading-relaxed italic border-l-4 border-green-400 pl-4">
                            {note.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          size="sm"
                          className="border-green-400 text-green-400 hover:bg-green-400/20 bg-transparent"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          size="sm"
                          className="border-green-400 text-green-400 hover:bg-green-400/20 bg-transparent"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Article Content */}
                <Card className="bg-black/80 border-green-400 mb-8">
                  <CardContent className="p-8">
                    <MarkdownRenderer content={note.content} />
                  </CardContent>
                </Card>

                {/* Related Notes */}
                {relatedNotes.length > 0 && (
                  <Card className="bg-black/80 border-green-400">
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Related Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedNotes.map((relatedNote) => (
                          <Card
                            key={relatedNote.id}
                            className="bg-black/60 border-green-400/50 hover:border-green-400 transition-colors"
                          >
                            <CardContent className="p-4">
                              <Link
                                href={`/notes/${relatedNote.slug}`}
                                className="text-green-400 hover:text-green-300 font-medium text-lg block mb-2"
                              >
                                {relatedNote.title}
                              </Link>
                              <div className="flex items-center gap-2 text-xs text-green-300 mb-2">
                                <Calendar className="w-3 h-3" />
                                {new Date(relatedNote.lastModified).toLocaleDateString()}
                                {relatedNote.category && (
                                  <>
                                    <Separator orientation="vertical" className="h-3" />
                                    <Badge className="bg-green-400/20 text-green-400 border-green-400 text-xs">
                                      {relatedNote.category}
                                    </Badge>
                                  </>
                                )}
                              </div>
                              {relatedNote.excerpt && (
                                <p className="text-green-300 text-sm line-clamp-2">{relatedNote.excerpt}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
