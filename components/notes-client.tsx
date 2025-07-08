"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { NotesLoading } from "@/components/notes-loading"
import { type NoteData } from "@/lib/notes" // Updated import
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
    notes: NoteData[]
    subfolders: FolderStructure
  }
}

export function NotesClient({ initialNotes }: { initialNotes: NoteData[] }) {
  const [notes] = useState<NoteData[]>(initialNotes)
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
    return notes
      .filter((note) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const inTitle = note.title.toLowerCase().includes(query);
          const inContent = note.content?.toLowerCase().includes(query) || false;
          const inTags = note.tags.some(tag => tag.toLowerCase().includes(query));
          const inCategory = note.category.toLowerCase().includes(query);
          return inTitle || inContent || inTags || inCategory;
        }
        const categoryMatch = selectedCategory === "all" || note.category === selectedCategory
        const tagMatch = selectedTag === "all" || note.tags.includes(selectedTag)
        const subfolderMatch = selectedSubfolder === "all" || note.slug.startsWith(`${selectedSubfolder}/`)
        return categoryMatch && tagMatch && subfolderMatch
      })
      .sort((a, b) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
        return 0
      })
  }, [notes, selectedCategory, selectedTag, selectedSubfolder, searchQuery, sortBy, sortOrder])

  const folderStructure = useMemo(() => {
    const structure: FolderStructure = {}
    filteredNotes.forEach((note) => {
      const pathParts = note.slug.split('/')
      let currentLevel = structure
      pathParts.forEach((part, index) => {
        if (index === pathParts.length - 1) {
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

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNotes.map((note) => (
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
                {note.tags.map((tag) => (
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
      {filteredNotes.map((note) => (
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
    return Object.entries(structure).map(([name, content]) => {
      const currentPath = path ? `${path}/${name}` : name
      const isExpanded = expandedFolders.has(currentPath)

      if (name === "__notes__") {
        return content.notes.map(note => (
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
            <span className="text-green-300 font-semibold">{name}</span>
          </div>
          {isExpanded && (
            <div className="pl-4 border-l-2 border-green-800/50 ml-2">
              {renderFolderTreeView(content.subfolders, currentPath)}
              {content.notes.map(note => (
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
    const groupedByYear = filteredNotes.reduce((acc, note) => {
      const year = new Date(note.date).getFullYear()
      if (!acc[year]) acc[year] = []
      acc[year].push(note)
      return acc
    }, {} as Record<string, NoteData[]>)

    return Object.entries(groupedByYear)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .map(([year, notesInYear]) => (
        <div key={year}>
          <h3 className="text-2xl font-bold text-green-400 my-4">{year}</h3>
          <div className="border-l-2 border-green-500/50 pl-6 relative">
            {notesInYear.map((note, index) => (
              <div key={note.id} className="mb-8 relative">
                <div className="absolute -left-[34px] top-1 w-4 h-4 bg-green-500 rounded-full border-4 border-black"></div>
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
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-400 tracking-widest">NOTES ARCHIVE</h1>
          <p className="text-green-300/80 mt-2">A collection of thoughts, research, and findings.</p>
        </header>

        <main>
          {/* Filters and Controls */}
          <Card className="bg-black/80 border border-green-400/50 p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black border-green-600 focus:ring-green-500 focus:border-green-500"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-black border-green-600"> <SelectValue placeholder="Select category" /> </SelectTrigger>
                <SelectContent className="bg-black border-green-600 text-green-300"> {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)} </SelectContent>
              </Select>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="bg-black border-green-600"> <SelectValue placeholder="Select tag" /> </SelectTrigger>
                <SelectContent className="bg-black border-green-600 text-green-300"> {tags.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)} </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [newSortBy, newSortOrder] = value.split('-')
                  setSortBy(newSortBy as any)
                  setSortOrder(newSortOrder as any)
                }}>
                  <SelectTrigger className="bg-black border-green-600 w-full"> <SelectValue placeholder="Sort by" /> </SelectTrigger>
                  <SelectContent className="bg-black border-green-600 text-green-300">
                    <SelectItem value="date-desc">Newest</SelectItem>
                    <SelectItem value="date-asc">Oldest</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

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
