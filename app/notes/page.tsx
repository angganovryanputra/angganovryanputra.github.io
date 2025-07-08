"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { Navigation } from "@/components/navigation"
import { NotesLoading } from "@/components/notes-loading"
import { localNotesManager, type LocalNote } from "@/lib/local-notes"
import { VIEW_MODES } from "@/lib/constants"
import {
  Calendar,
  User,
  FileText,
  Search,
  Grid,
  List,
  Folder,
  Clock,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  BookOpen,
  ImageIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import type { JSX } from "react/jsx-runtime"

interface FolderStructure {
  [key: string]: {
    notes: LocalNote[]
    subfolders: FolderStructure
  }
}

export default function NotesPage() {
  const [notes, setNotes] = useState<LocalNote[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [subfolders, setSubfolders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [selectedSubfolder, setSelectedSubfolder] = useState<string>("all")
  const [viewMode, setViewMode] = useState<string>(VIEW_MODES.GRID)
  const [sortBy, setSortBy] = useState<"date" | "title" | "category">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Optimized search with debouncing and memoization
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return notes.filter((note) => {
      // Search in title, content, category, tags, and excerpt
      const searchableText = [note.title, note.content, note.category || "", note.excerpt || "", ...note.tags]
        .join(" ")
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [searchQuery, notes])

  // Optimized filtering and sorting with memoization
  const filteredNotes = useMemo(() => {
    let filtered = searchQuery.trim() ? searchResults : notes

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((note) => note.category === selectedCategory)
    }

    // Apply tag filter
    if (selectedTag !== "all") {
      filtered = filtered.filter((note) => note.tags.includes(selectedTag))
    }

    // Apply subfolder filter
    if (selectedSubfolder !== "all") {
      filtered = filtered.filter((note) => note.subfolder === selectedSubfolder)
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "")
          break
        case "date":
        default:
          comparison = new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return sorted
  }, [searchQuery, searchResults, notes, selectedCategory, selectedTag, selectedSubfolder, sortBy, sortOrder])

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [notesData, categoriesData, tagsData, subfoldersData] = await Promise.all([
        localNotesManager.getAllNotes(),
        localNotesManager.getCategories(),
        localNotesManager.getTags(),
        localNotesManager.getSubfolders(),
      ])

      setNotes(notesData)
      setCategories(categoriesData)
      setTags(tagsData)
      setSubfolders(subfoldersData)
    } catch (err) {
      const errorMessage =
        "Failed to load notes. Please check if the notes directory exists and contains valid markdown files."
      setError(errorMessage)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }, [])

  const buildFolderStructure = useCallback((notes: LocalNote[]): FolderStructure => {
    const structure: FolderStructure = {}

    notes.forEach((note) => {
      const category = note.category || "Uncategorized"

      if (!structure[category]) {
        structure[category] = {
          notes: [],
          subfolders: {},
        }
      }

      structure[category].notes.push(note)
    })

    return structure
  }, [])

  const toggleFolder = useCallback((folderName: string) => {
    setExpandedFolders((prev) => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(folderName)) {
        newExpanded.delete(folderName)
      } else {
        newExpanded.add(folderName)
      }
      return newExpanded
    })
  }, [])

  const renderNoteCard = useCallback(
    (note: LocalNote) => (
      <Card
        key={note.id}
        className="bg-black/80 border-green-400 hover:border-green-300 transition-all duration-200 group hover:shadow-lg hover:shadow-green-400/20"
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-green-400 text-lg mb-2">
                <Link
                  href={`/notes/${note.slug}`}
                  className="hover:text-green-300 transition-colors group-hover:text-green-300"
                >
                  {note.title}
                </Link>
              </CardTitle>
              <div className="flex items-center gap-4 text-xs text-green-300">
                {note.frontmatter.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {note.frontmatter.author}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(note.lastModified).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.ceil(note.content.split(" ").length / 200)} min read
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {note.excerpt && <p className="text-green-300 text-sm leading-relaxed mb-4 line-clamp-3">{note.excerpt}</p>}

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              {note.category && (
                <Badge className="bg-green-400/20 text-green-400 border-green-400">{note.category}</Badge>
              )}
              {note.subfolder && (
                <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">
                  <Folder className="w-3 h-3 mr-1" />
                  {note.subfolder}
                </Badge>
              )}
              {note.images.length > 0 && (
                <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  {note.images.length} image{note.images.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 4).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
                {note.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400/30">
                    +{note.tags.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-green-400/30 mt-4">
            <Link
              href={`/notes/${note.slug}`}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors inline-flex items-center gap-1"
            >
              Read full note →
            </Link>
          </div>
        </CardContent>
      </Card>
    ),
    [],
  )

  const renderFolderView = useCallback(() => {
    const folderStructure = buildFolderStructure(filteredNotes)

    return (
      <div className="space-y-4">
        {Object.entries(folderStructure).map(([folderName, folder]) => (
          <Card key={folderName} className="bg-black/80 border-green-400">
            <CardHeader
              className="cursor-pointer hover:bg-green-400/10 transition-colors"
              onClick={() => toggleFolder(folderName)}
            >
              <CardTitle className="flex items-center justify-between text-green-400">
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  <span>{folderName}</span>
                  <Badge variant="outline" className="text-green-300 border-green-400">
                    {folder.notes.length}
                  </Badge>
                </div>
                {expandedFolders.has(folderName) ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </CardTitle>
            </CardHeader>

            {expandedFolders.has(folderName) && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {folder.notes.map((note) => renderNoteCard(note))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    )
  }, [filteredNotes, buildFolderStructure, expandedFolders, toggleFolder, renderNoteCard])

  const renderGridView = useCallback(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredNotes.map((note) => renderNoteCard(note))}
      </div>
    ),
    [filteredNotes, renderNoteCard],
  )

  const renderListView = useCallback(
    () => (
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="bg-black/80 border-green-400 hover:border-green-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/notes/${note.slug}`}
                    className="text-green-400 hover:text-green-300 font-medium text-lg"
                  >
                    {note.title}
                  </Link>
                  <div className="flex items-center gap-4 text-xs text-green-300 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(note.lastModified).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.ceil(note.content.split(" ").length / 200)} min read
                    </div>
                    {note.category && (
                      <Badge className="bg-green-400/20 text-green-400 border-green-400 text-xs">{note.category}</Badge>
                    )}
                    {note.subfolder && (
                      <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30 text-xs">
                        <Folder className="w-3 h-3 mr-1" />
                        {note.subfolder}
                      </Badge>
                    )}
                  </div>
                  {note.excerpt && <p className="text-green-300 text-sm mt-2 line-clamp-2">{note.excerpt}</p>}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {note.images.length > 0 && (
                    <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 text-xs">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      {note.images.length}
                    </Badge>
                  )}
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-cyan-400 border-cyan-400/30">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && <span className="text-xs text-cyan-400">+{note.tags.length - 3}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    [filteredNotes],
  )

  const renderTimelineView = useCallback(
    () =>
      filteredNotes.reduce((acc, note, index) => {
        const noteDate = new Date(note.lastModified).toDateString()
        const prevDate = index > 0 ? new Date(filteredNotes[index - 1].lastModified).toDateString() : null

        if (noteDate !== prevDate) {
          acc.push(
            <div key={`date-${noteDate}`} className="flex items-center gap-4 my-6">
              <div className="text-green-400 font-semibold text-lg">{noteDate}</div>
              <div className="flex-1 h-px bg-green-400/30"></div>
            </div>,
          )
        }

        acc.push(
          <div key={note.id} className="ml-8 relative">
            <div className="absolute -left-6 top-4 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
            {renderNoteCard(note)}
          </div>,
        )

        return acc
      }, [] as JSX.Element[]),
    [filteredNotes, renderNoteCard],
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <NotesLoading message="Loading cybersecurity knowledge base..." variant="data" size="md" />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10">
        <Navigation />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
                <BookOpen className="inline-block w-10 h-10 mr-3 mb-1" />
                Cybersecurity Notes
              </h1>
              <p className="text-green-300 text-lg max-w-2xl mx-auto">
                A comprehensive collection of cybersecurity knowledge, methodologies, and best practices.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-400 bg-red-400/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-black/80 border-green-400">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{notes.length}</div>
                  <div className="text-green-300 text-sm">Total Notes</div>
                </CardContent>
              </Card>
              <Card className="bg-black/80 border-green-400">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{categories.length}</div>
                  <div className="text-green-300 text-sm">Categories</div>
                </CardContent>
              </Card>
              <Card className="bg-black/80 border-green-400">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{tags.length}</div>
                  <div className="text-green-300 text-sm">Tags</div>
                </CardContent>
              </Card>
              <Card className="bg-black/80 border-green-400">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{subfolders.length}</div>
                  <div className="text-green-300 text-sm">Subfolders</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="bg-black/80 border-green-400 mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                  <div className="lg:col-span-2">
                    <label className="block text-green-300 text-sm mb-2">Search Notes</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                      <Input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-black/50 border-green-400 text-green-300 placeholder-green-400/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-green-300 text-sm mb-2">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-black/50 border-green-400 text-green-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-green-400">
                        <SelectItem value="all" className="text-green-300">
                          All Categories
                        </SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-green-300">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-green-300 text-sm mb-2">Tag</label>
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="bg-black/50 border-green-400 text-green-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-green-400">
                        <SelectItem value="all" className="text-green-300">
                          All Tags
                        </SelectItem>
                        {tags.map((tag) => (
                          <SelectItem key={tag} value={tag} className="text-green-300">
                            #{tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-green-300 text-sm mb-2">Sort By</label>
                    <Select
                      value={`${sortBy}-${sortOrder}`}
                      onValueChange={(value) => {
                        const [newSortBy, newSortOrder] = value.split("-") as [typeof sortBy, typeof sortOrder]
                        setSortBy(newSortBy)
                        setSortOrder(newSortOrder)
                      }}
                    >
                      <SelectTrigger className="bg-black/50 border-green-400 text-green-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-green-400">
                        <SelectItem value="date-desc" className="text-green-300">
                          Date (Newest)
                        </SelectItem>
                        <SelectItem value="date-asc" className="text-green-300">
                          Date (Oldest)
                        </SelectItem>
                        <SelectItem value="title-asc" className="text-green-300">
                          Title (A-Z)
                        </SelectItem>
                        <SelectItem value="title-desc" className="text-green-300">
                          Title (Z-A)
                        </SelectItem>
                        <SelectItem value="category-asc" className="text-green-300">
                          Category (A-Z)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View Mode Tabs */}
            <Tabs value={viewMode} onValueChange={setViewMode} className="mb-8">
              <TabsList className="bg-black/80 border border-green-400">
                <TabsTrigger
                  value={VIEW_MODES.GRID}
                  className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value={VIEW_MODES.LIST}
                  className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400"
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger
                  value={VIEW_MODES.FOLDER}
                  className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400"
                >
                  <Folder className="w-4 h-4 mr-2" />
                  Folders
                </TabsTrigger>
                <TabsTrigger
                  value={VIEW_MODES.TIMELINE}
                  className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Timeline
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {filteredNotes.length === 0 ? (
                  <Card className="bg-black/80 border-green-400">
                    <CardContent className="p-8 text-center">
                      <FileText className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-400 mb-2">No Notes Found</h3>
                      <p className="text-green-300 mb-4">
                        {searchQuery
                          ? "No notes match your search criteria. Try adjusting your search terms or filters."
                          : "No notes are available. Add some markdown files to the notes directory to get started."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <TabsContent value={VIEW_MODES.GRID}>{renderGridView()}</TabsContent>
                    <TabsContent value={VIEW_MODES.LIST}>{renderListView()}</TabsContent>
                    <TabsContent value={VIEW_MODES.FOLDER}>{renderFolderView()}</TabsContent>
                    <TabsContent value={VIEW_MODES.TIMELINE}>
                      <div className="space-y-4">{renderTimelineView()}</div>
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>

            {/* Results Summary */}
            {filteredNotes.length > 0 && (
              <div className="text-center text-green-300 text-sm">
                Showing {filteredNotes.length} of {notes.length} notes
                {searchQuery && ` for "${searchQuery}"`}
                {(selectedCategory !== "all" || selectedTag !== "all" || selectedSubfolder !== "all") && " (filtered)"}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
