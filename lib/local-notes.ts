import fs from "./fs-shim"
import path from "./path-shim"
import matter from "gray-matter"

export interface LocalNote {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  filePath: string
  relativePath: string
  lastModified: string
  category?: string
  tags: string[]
  subfolder?: string
  tableOfContents: TableOfContentsItem[]
  frontmatter: {
    title?: string
    author?: string
    date?: string
    category?: string
    tags?: string[]
    [key: string]: any
  }
  images: string[]
  wordCount: number
  readTime: number
}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  anchor: string
  children?: TableOfContentsItem[]
}

export interface NotesMetadata {
  totalNotes: number
  categories: string[]
  tags: string[]
  subfolders: string[]
  lastUpdated: string
}

class LocalNotesManager {
  private notesDirectory: string
  private imagesDirectory: string
  private cache: Map<string, LocalNote> = new Map()
  private lastScan = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.notesDirectory = path.join(process?.cwd?.() || "", "notes")
    this.imagesDirectory = path.join(process?.cwd?.() || "", "public", "images", "notes")
    this.ensureDirectories()
  }

  private ensureDirectories() {
    // In browser environment, we'll skip directory operations
    if (typeof window !== "undefined") {
      return
    }

    // Server-side directory creation
    if (!fs.existsSync(this.notesDirectory)) {
      fs.mkdirSync(this.notesDirectory, { recursive: true })
    }

    if (!fs.existsSync(this.imagesDirectory)) {
      fs.mkdirSync(this.imagesDirectory, { recursive: true })
    }
  }

  private isDirectoryEmpty(dirPath: string): boolean {
    try {
      const files = fs.readdirSync(dirPath)
      return files.filter((file) => !file.startsWith(".")).length === 0
    } catch {
      return true
    }
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastScan > this.CACHE_DURATION
  }

  private generateTableOfContents(content: string): TableOfContentsItem[] {
    const headings: TableOfContentsItem[] = []
    const lines = content.split("\n")

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const match = line.match(/^(#{1,6})\s+(.+)$/)

      if (match) {
        const level = match[1].length
        const title = match[2].trim()
        const anchor = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")

        headings.push({
          id: `heading-${i}`,
          title,
          level,
          anchor,
        })
      }
    }

    return this.buildTocHierarchy(headings)
  }

  private buildTocHierarchy(headings: TableOfContentsItem[]): TableOfContentsItem[] {
    const result: TableOfContentsItem[] = []
    const stack: TableOfContentsItem[] = []

    for (const heading of headings) {
      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop()
      }

      if (stack.length === 0) {
        result.push(heading)
      } else {
        const parent = stack[stack.length - 1]
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(heading)
      }

      stack.push(heading)
    }

    return result
  }

  private extractImages(content: string): string[] {
    const images: string[] = []
    const imageRegex = /!\[([^\]]*)\]$$([^)]+)$$/g
    let match

    while ((match = imageRegex.exec(content)) !== null) {
      images.push(match[2])
    }

    return images
  }

  private processImages(content: string, noteSlug: string): string {
    // Create note-specific image directory
    const noteImageDir = path.join(this.imagesDirectory, noteSlug)
    if (!fs.existsSync(noteImageDir)) {
      fs.mkdirSync(noteImageDir, { recursive: true })
    }

    // Process image references in content
    return content.replace(/!\[([^\]]*)\]$$([^)]+)$$/g, (match, alt, src) => {
      // Skip if already a web URL
      if (src.startsWith("http://") || src.startsWith("https://")) {
        return match
      }

      // Skip if already in correct format
      if (src.startsWith("/images/notes/")) {
        return match
      }

      // Convert relative paths to absolute paths
      const imageName = path.basename(src)
      const newImagePath = `/images/notes/${noteSlug}/${imageName}`

      return `![${alt}](${newImagePath})`
    })
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  private generateExcerpt(content: string, maxLength = 200): string {
    const plainText = content
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")
      .replace(/!\[([^\]]*)\]$$[^)]+$$/g, "")
      .replace(/\n+/g, " ")
      .trim()

    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
  }

  private scanNotesDirectory(): LocalNote[] {
    // In browser environment, return empty array since we don't have sample notes anymore
    if (typeof window !== "undefined") {
      return []
    }

    if (!this.shouldRefreshCache() && this.cache.size > 0) {
      return Array.from(this.cache.values())
    }

    const notes: LocalNote[] = []
    this.cache.clear()

    try {
      this.scanDirectoryRecursive(this.notesDirectory, "", notes)
      this.lastScan = Date.now()
    } catch (error) {
      console.error("Error scanning notes directory:", error)
    }

    return notes
  }

  private scanDirectoryRecursive(dirPath: string, relativePath: string, notes: LocalNote[]): void {
    if (!fs.existsSync(dirPath)) {
      return
    }

    const items = fs.readdirSync(dirPath)

    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      const itemRelativePath = relativePath ? path.join(relativePath, item) : item

      // Skip hidden files and directories
      if (item.startsWith(".")) {
        continue
      }

      const stats = fs.statSync(itemPath)

      if (stats.isDirectory()) {
        this.scanDirectoryRecursive(itemPath, itemRelativePath, notes)
      } else if (item.endsWith(".md") || item.endsWith(".markdown")) {
        try {
          const content = fs.readFileSync(itemPath, "utf8")
          const { data: frontmatter, content: markdownContent } = matter(content)
          const slug = path.basename(item, path.extname(item))
          const title = frontmatter.title || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          const subfolder = relativePath ? path.dirname(itemRelativePath) : undefined

          // Process images in content
          const processedContent = this.processImages(markdownContent, slug)
          const wordCount = processedContent.split(/\s+/).length

          const note: LocalNote = {
            id: itemRelativePath.replace(/\.(md|markdown)$/, "").replace(/[/\\]/g, "-"),
            title,
            slug,
            content: processedContent,
            excerpt: this.generateExcerpt(processedContent),
            filePath: item,
            relativePath: itemRelativePath,
            lastModified: stats.mtime.toISOString(),
            category: frontmatter.category,
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            subfolder,
            tableOfContents: this.generateTableOfContents(processedContent),
            frontmatter,
            images: this.extractImages(processedContent),
            wordCount,
            readTime: this.calculateReadTime(processedContent),
          }

          notes.push(note)
          this.cache.set(note.id, note)
        } catch (error) {
          console.error("Error processing markdown file:", itemRelativePath, error)
        }
      }
    }
  }

  // Public methods
  async getAllNotes(): Promise<LocalNote[]> {
    return this.scanNotesDirectory().sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
    )
  }

  async getNoteBySlug(slug: string): Promise<LocalNote | null> {
    const notes = this.scanNotesDirectory()
    return notes.find((note) => note.slug === slug || note.id === slug) || null
  }

  async searchNotes(query: string): Promise<LocalNote[]> {
    if (!query.trim()) return []

    const notes = this.scanNotesDirectory()
    const queryLower = query.toLowerCase()

    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(queryLower) ||
        note.content.toLowerCase().includes(queryLower) ||
        note.tags.some((tag) => tag.toLowerCase().includes(queryLower)) ||
        (note.category && note.category.toLowerCase().includes(queryLower)) ||
        (note.excerpt && note.excerpt.toLowerCase().includes(queryLower))
      )
    })
  }

  async getCategories(): Promise<string[]> {
    const notes = this.scanNotesDirectory()
    const categories = new Set<string>()

    notes.forEach((note) => {
      if (note.category) {
        categories.add(note.category)
      }
    })

    return Array.from(categories).sort()
  }

  async getTags(): Promise<string[]> {
    const notes = this.scanNotesDirectory()
    const tags = new Set<string>()

    notes.forEach((note) => {
      note.tags.forEach((tag) => tags.add(tag))
    })

    return Array.from(tags).sort()
  }

  async getSubfolders(): Promise<string[]> {
    const notes = this.scanNotesDirectory()
    const subfolders = new Set<string>()

    notes.forEach((note) => {
      if (note.subfolder) {
        subfolders.add(note.subfolder)
      }
    })

    return Array.from(subfolders).sort()
  }

  async getMetadata(): Promise<NotesMetadata> {
    const notes = this.scanNotesDirectory()
    const categories = await this.getCategories()
    const tags = await this.getTags()
    const subfolders = await this.getSubfolders()
    const lastUpdated = notes.length > 0 ? notes[0].lastModified : new Date().toISOString()

    return {
      totalNotes: notes.length,
      categories,
      tags,
      subfolders,
      lastUpdated,
    }
  }

  // Image processing utilities
  async processNoteImages(noteSlug: string, imageFiles: File[]): Promise<string[]> {
    const noteImageDir = path.join(this.imagesDirectory, noteSlug)
    if (!fs.existsSync(noteImageDir)) {
      fs.mkdirSync(noteImageDir, { recursive: true })
    }

    const processedImages: string[] = []

    for (const file of imageFiles) {
      try {
        const fileName = file.name
        const filePath = path.join(noteImageDir, fileName)

        // In a real implementation, you would save the file here
        // For now, we'll just track the expected path
        const webPath = `/images/notes/${noteSlug}/${fileName}`
        processedImages.push(webPath)
      } catch (error) {
        console.error(`Error processing image ${file.name}:`, error)
      }
    }

    return processedImages
  }
}

export const localNotesManager = new LocalNotesManager()
