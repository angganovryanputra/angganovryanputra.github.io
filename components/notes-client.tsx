"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { NotesLoading } from "@/components/notes-loading"
import { type NoteSummary } from "@/lib/notes"
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
  ChevronLeft,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface FolderStructure {
  [key: string]: {
    notes: NoteSummary[]
    subfolders: FolderStructure
  }
}

export function NotesClient({ initialNotes }: { initialNotes: NoteSummary[] }) {
  const [notes] = useState<NoteSummary[]>(initialNotes)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [subfolders, setSubfolders] = useState<string[]>([])
  const [loading, setLoading] = useState(false) // Data is pre-loaded
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [selectedSubfolder, setSelectedSubfolder] = useState<string>("all")
  const [viewMode, setViewMode] = useState<string>(VIEW_MODES.GRID)
  const [sortBy, setSortBy] = useState<"date" | "title" | "category">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const NOTES_PER_PAGE = 10;

  useEffect(() => {
    if (initialNotes) {
      const allCategories = ["all", ...Array.from(new Set(initialNotes.map((note) => note.category)))];
      const allTags = ["all", ...Array.from(new Set(initialNotes.flatMap((note) => note.tags)))];
      const allSubfolders = ["all", ...Array.from(new Set(initialNotes.map((note) => note.slug.split('/')[0])))];

      setCategories(allCategories);
      setTags(allTags);
      setSubfolders(allSubfolders);
    }
  }, [initialNotes]);

  const filteredNotes = useMemo(() => {
    let filtered = notes

    // 1. Apply dropdown filters first
    filtered = filtered.filter((note: NoteSummary) => {
      const categoryMatch = selectedCategory === "all" || note.category === selectedCategory
      const tagMatch = selectedTag === "all" || note.tags.includes(selectedTag)
      const subfolderMatch =
        selectedSubfolder === "all" || note.slug.startsWith(`${selectedSubfolder}/`)
      return categoryMatch && tagMatch && subfolderMatch
    })

    // 2. Then, apply search query filter on the result
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((note: NoteSummary) => {
        if (!note) return false
        const inTitle = note.title.toLowerCase().includes(query)
        const inTags = note.tags.some((tag: string) => tag.toLowerCase().includes(query))
        const inCategory = note.category.toLowerCase().includes(query)
        return inTitle || inTags || inCategory
      })
    }

    // 3. Finally, sort the results
    return filtered.sort((a: NoteSummary, b: NoteSummary) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }, [notes, selectedCategory, selectedTag, selectedSubfolder, searchQuery, sortBy, sortOrder])

  const folderStructure = useMemo(() => {
    const structure: FolderStructure = {}
    filteredNotes.forEach((note: NoteSummary) => {
      const pathParts = note.slug.split("/")
      let currentLevel: FolderStructure = structure
      pathParts.forEach((part: string, index: number) => {
        if (index === pathParts.length - 1) {
          // This is the note file itself
          if (!currentLevel["__notes__"]) {
            currentLevel["__notes__"] = { notes: [], subfolders: {} }
          }
          currentLevel["__notes__"].notes.push(note)
        } else {
          if (!currentLevel[part]) {
            currentLevel[part] = { notes: [], subfolders: {} }
          }
          currentLevel = currentLevel[part].subfolders
        }
      })
    })
    return structure
  }, [filteredNotes])

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath)
      } else {
        newSet.add(folderPath)
      }
      return newSet
    })
  }

  const indexOfLastNote = currentPage * NOTES_PER_PAGE;
  const indexOfFirstNote = indexOfLastNote - NOTES_PER_PAGE;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-8 flex justify-center items-center gap-4 font-mono">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-black/80 border border-green-500/50 hover:bg-green-500/20 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <span className="text-green-300">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-black/80 border border-green-500/50 hover:bg-green-500/20 disabled:opacity-50"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentNotes.map((note: NoteSummary) => (
        <Card key={note.id} className="bg-black/80 border-green-400/50 hover:border-green-400 transition-all duration-300 transform hover:-translate-y-1">
          <Link href={`/notes/${note.slug}`} passHref>
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center">
                <BookOpen className="w-5 h-5 mr-3" /> {note.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-green-300/70 mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(note.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-xs text-green-300/70 mb-4">
                <Folder className="w-4 h-4 mr-2" />
                {note.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-green-800/50 text-green-300">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Link>
          </Card>
        ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {currentNotes.map((note: NoteSummary) => (
        <Card key={note.id} className="bg-black/80 border-green-400/50 hover:border-green-400 transition-all duration-300">
          <Link href={`/notes/${note.slug}`} passHref>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-400">{note.title}</h3>
                <div className="flex items-center text-xs text-green-300/70 mt-2 space-x-4">
                  <span><Calendar className="w-3 h-3 inline mr-1" />{new Date(note.date).toLocaleDateString()}</span>
                  <span><Folder className="w-3 h-3 inline mr-1" />{note.category}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-green-400" />
            </div>
          </Link>
        </Card>
      ))}
    </div>
  )

  const renderFolderTreeView = (structure: FolderStructure, path = "") => {
    return Object.entries(structure).map(([name, content]: [string, { notes: NoteSummary[], subfolders: FolderStructure }]) => {
      const currentPath = path ? `${path}/${name}` : name
      const isExpanded = expandedFolders.has(currentPath)

      if (name === "__notes__") {
        return content.notes.map((note: NoteSummary) => (
            <Link key={note.id} href={`/notes/${note.slug}`} className="flex items-center p-2 ml-4 rounded-md hover:bg-green-900/50">
                <FileText className="w-4 h-4 mr-2 text-green-400" />
                <span className="text-green-300">{note.title}</span>
            </Link>
        ));
      }

      return (
        <div key={currentPath}>
          <div onClick={() => toggleFolder(currentPath)} className="flex items-center p-2 rounded-md cursor-pointer hover:bg-green-900/50">
            {isExpanded ? <ChevronDown className="w-4 h-4 mr-2 text-green-400" /> : <ChevronRight className="w-4 h-4 mr-2 text-green-400" />}
            <Folder className="w-4 h-4 mr-2 text-yellow-400" />
            <h3 className="text-green-300 font-semibold">{name}</h3>
          </div>
          {isExpanded && (
            <div className="pl-4 border-l-2 border-green-800/50 ml-2">
              {renderFolderTreeView(content.subfolders, currentPath)}
              {content.notes.map((note: NoteSummary) => (
                <Link key={note.id} href={`/notes/${note.slug}`} className="flex items-center p-2 ml-4 rounded-md hover:bg-green-900/50">
                    <FileText className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-green-300">{note.title.split('/').pop()}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    })
  }

  const renderFolderView = () => (
    <div className="bg-black/80 p-4 rounded-lg border border-green-400/50">
      {renderFolderTreeView(folderStructure)}
    </div>
  )

  const renderTimelineView = () => {
    const groupedByYear = filteredNotes.reduce((acc: Record<string, NoteSummary[]>, note: NoteSummary) => {
      const year = new Date(note.date).getFullYear().toString()
      if (!acc[year]) acc[year] = []
      acc[year].push(note)
      return acc
    }, {})

    return Object.entries(groupedByYear).map(([year, notesInYear]: [string, NoteSummary[]]) => (
      <div key={year}>
        <h3 className="text-2xl font-bold text-green-400 my-4">{year}</h3>
        <div className="border-l-2 border-green-500/50 pl-6 relative">
          {notesInYear.map((note: NoteSummary) => (
            <div key={note.id} className="mb-8 relative">
              <div className="absolute -left-[34px] top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-black"></div>
              <p className="text-sm text-green-300/70 mb-1">{new Date(note.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
              <Link href={`/notes/${note.slug}`} className="text-lg font-semibold text-green-400 hover:underline">{note.title}</Link>
              <p className="text-sm text-green-300 mt-1">Category: {note.category}</p>
            </div>
          ))}
        </div>
      </div>
    ))
  }

  if (loading) return <NotesLoading />
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <div className="min-h-screen bg-black text-green-300 font-mono relative">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <header className="relative mb-12 overflow-hidden rounded-lg border border-green-500/30 bg-black/50 p-8 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/40 to-transparent opacity-50"></div>
          <div className="absolute top-2 left-2 text-green-500/50 font-mono text-xs">[</div>
          <div className="absolute top-2 right-2 text-green-500/50 font-mono text-xs">]</div>
          <div className="absolute bottom-2 left-2 text-green-500/50 font-mono text-xs">]</div>
          <div className="absolute bottom-2 right-2 text-green-500/50 font-mono text-xs">[</div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-green-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] flex items-center justify-center gap-4">
              <BookOpen className="h-10 w-10" />
              <span>Cybersecurity Notes & Research</span>
            </h1>
            <p className="mt-4 text-lg text-green-300/80 font-mono">
              $ A collection of findings from the digital trenches.
            </p>
          </div>
        </header>

        <main>
          {/* Filters and Controls */}
          <div className="relative mb-8 rounded-lg border border-green-500/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Search Section */}
              <div className="w-full md:w-1/3">
                <label htmlFor="search-notes" className="text-cyan-400 text-sm font-bold mb-2 block">
                  Search Notes
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300/70" />
                  <Input
                    id="search-notes"
                    type="text"
                    placeholder="Search by title or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-black/80 border-green-500/50 rounded-md placeholder:text-green-300/40 focus:border-green-400 focus:ring-green-400"
                    aria-label="Search notes by title or keyword"
                  />
                </div>
              </div>

              {/* Dropdown Filters Section */}
              <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category-select" className="text-cyan-400 text-sm font-bold mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-select" className="w-full bg-black/80 border-green-500/50 rounded-md focus:border-green-400 focus:ring-green-400"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent className="bg-black border-green-600 text-green-300 rounded-md"><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="tag-select" className="text-cyan-400 text-sm font-bold mb-2 block">Tag</label>
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger id="tag-select" className="w-full bg-black/80 border-green-500/50 rounded-md focus:border-green-400 focus:ring-green-400"><SelectValue placeholder="Select tag" /></SelectTrigger>
                    <SelectContent className="bg-black border-green-600 text-green-300 rounded-md"><SelectContent>{tags.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="sort-select" className="text-cyan-400 text-sm font-bold mb-2 block">Sort By</label>
                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [newSortBy, newSortOrder] = value.split('-')
                    setSortBy(newSortBy as any)
                    setSortOrder(newSortOrder as any)
                  }}>
                    <SelectTrigger id="sort-select" className="w-full bg-black/80 border-green-500/50 rounded-md focus:border-green-400 focus:ring-green-400"><SelectValue placeholder="Sort by" /></SelectTrigger>
                    <SelectContent className="bg-black border-green-600 text-green-300 rounded-md">
                      <SelectItem value="date-desc">Newest</SelectItem>
                      <SelectItem value="date-asc">Oldest</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="relative">
            <Tabs defaultValue={viewMode} onValueChange={setViewMode} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-black/80 border border-green-400/50 mb-6">
                <TabsTrigger value={VIEW_MODES.GRID} className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                  <Grid className="w-4 h-4 mr-2" /> Grid
                </TabsTrigger>
                <TabsTrigger value={VIEW_MODES.LIST} className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                  <List className="w-4 h-4 mr-2" /> List
                </TabsTrigger>
                <TabsTrigger value={VIEW_MODES.FOLDER} className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                  <Folder className="w-4 h-4 mr-2" /> Folder
                </TabsTrigger>
                <TabsTrigger value={VIEW_MODES.TIMELINE} className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                  <Clock className="w-4 h-4 mr-2" /> Timeline
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
                    <TabsContent value={VIEW_MODES.GRID}>
                      {renderGridView()}
                      {renderPagination()}
                    </TabsContent>
                    <TabsContent value={VIEW_MODES.LIST}>
                      {renderListView()}
                      {renderPagination()}
                    </TabsContent>
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
                Showing {currentNotes.length} of {filteredNotes.length} notes
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
