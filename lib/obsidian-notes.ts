import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { SecurityValidator } from "./security-utils"

export interface ObsidianNote {
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

class ObsidianNotesManager {
  private notesDirectory: string
  private cache: Map<string, ObsidianNote> = new Map()
  private lastScan = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.notesDirectory = path.join(process.cwd(), "notes")
    this.ensureNotesDirectory()
  }

  private ensureNotesDirectory() {
    if (!fs.existsSync(this.notesDirectory)) {
      fs.mkdirSync(this.notesDirectory, { recursive: true })
      this.createSampleNotes()
    }
  }

  private createSampleNotes() {
    const sampleNotes = [
      {
        filename: "cybersecurity-fundamentals.md",
        content: `---
title: "Cybersecurity Fundamentals"
author: "Security Professional"
date: "2024-01-15"
category: "Fundamentals"
tags: ["cybersecurity", "fundamentals", "security", "basics"]
---

# Cybersecurity Fundamentals

## Introduction

Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information.

## The CIA Triad

The foundation of information security:

### Confidentiality
Ensuring that information is accessible only to those authorized to have access.

### Integrity
Safeguarding the accuracy and completeness of information and processing methods.

### Availability
Ensuring that authorized users have access to information when required.

## Common Threats

- Malware
- Phishing
- Social Engineering
- DDoS Attacks
- Insider Threats

## Best Practices

1. Use strong, unique passwords
2. Enable multi-factor authentication
3. Keep software updated
4. Regular security training
5. Implement defense in depth`,
      },
      {
        filename: "penetration-testing/methodology.md",
        content: `---
title: "Penetration Testing Methodology"
author: "Security Professional"
date: "2024-01-20"
category: "Penetration Testing"
tags: ["pentest", "methodology", "security-testing", "vulnerability"]
---

# Penetration Testing Methodology

## Overview

Penetration testing is a systematic approach to evaluating the security of an IT infrastructure by safely attempting to exploit vulnerabilities.

## Phases

### 1. Planning and Reconnaissance
- Define scope and goals
- Gather intelligence
- Identify potential attack vectors

### 2. Scanning
- Static analysis
- Dynamic analysis
- Network discovery

### 3. Gaining Access
- Exploit vulnerabilities
- Escalate privileges
- Maintain access

### 4. Analysis and Reporting
- Document findings
- Assess business impact
- Provide remediation recommendations

## Tools

- Nmap for network discovery
- Burp Suite for web application testing
- Metasploit for exploitation
- Wireshark for network analysis`,
      },
      {
        filename: "incident-response/playbook.md",
        content: `---
title: "Incident Response Playbook"
author: "CSIRT Team"
date: "2024-01-25"
category: "Incident Response"
tags: ["incident-response", "playbook", "containment", "forensics"]
---

# Incident Response Playbook

## Preparation

- Establish incident response team
- Create communication plans
- Prepare tools and resources
- Conduct regular training

## Detection and Analysis

- Monitor security events
- Analyze alerts and logs
- Determine incident scope
- Classify incident severity

## Containment, Eradication, and Recovery

### Short-term Containment
- Isolate affected systems
- Preserve evidence
- Prevent further damage

### Long-term Containment
- Apply temporary fixes
- Implement additional monitoring
- Prepare for eradication

### Eradication
- Remove malware
- Patch vulnerabilities
- Update security controls

### Recovery
- Restore systems from clean backups
- Monitor for signs of weakness
- Return to normal operations

## Post-Incident Activity

- Document lessons learned
- Update procedures
- Conduct post-mortem analysis
- Improve security posture`,
      },
    ]

    // Create subdirectories and files
    const subfolders = ["penetration-testing", "incident-response"]

    subfolders.forEach((subfolder) => {
      const subfolderPath = path.join(this.notesDirectory, subfolder)
      if (!fs.existsSync(subfolderPath)) {
        fs.mkdirSync(subfolderPath, { recursive: true })
      }
    })

    sampleNotes.forEach((note) => {
      const filePath = path.join(this.notesDirectory, note.filename)
      if (!fs.existsSync(filePath)) {
        const dir = path.dirname(filePath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(filePath, note.content, "utf8")
      }
    })
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

  private scanNotesDirectory(): ObsidianNote[] {
    if (!this.shouldRefreshCache() && this.cache.size > 0) {
      return Array.from(this.cache.values())
    }

    const notes: ObsidianNote[] = []

    try {
      this.scanDirectoryRecursive(this.notesDirectory, "", notes)
      this.lastScan = Date.now()
    } catch (error) {
      console.error("Error scanning notes directory:", error)
    }

    return notes
  }

  private scanDirectoryRecursive(dirPath: string, relativePath: string, notes: ObsidianNote[]): void {
    const items = fs.readdirSync(dirPath)

    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      const itemRelativePath = relativePath ? path.join(relativePath, item) : item
      const stats = fs.statSync(itemPath)

      if (!SecurityValidator.validateFilePath(itemRelativePath)) {
        continue
      }

      if (stats.isDirectory()) {
        this.scanDirectoryRecursive(itemPath, itemRelativePath, notes)
      } else if (item.endsWith(".md")) {
        try {
          const content = fs.readFileSync(itemPath, "utf8")

          if (!SecurityValidator.validateMarkdownContent(content)) {
            continue
          }

          const { data: frontmatter, content: markdownContent } = matter(content)
          const slug = path.basename(item, ".md")
          const title = frontmatter.title || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          const subfolder = relativePath ? path.dirname(itemRelativePath) : undefined

          const note: ObsidianNote = {
            id: itemRelativePath.replace(/\.md$/, "").replace(/[/\\]/g, "-"),
            title,
            slug,
            content: SecurityValidator.sanitizeHtml(markdownContent),
            excerpt: this.generateExcerpt(markdownContent),
            filePath: item,
            relativePath: itemRelativePath,
            lastModified: stats.mtime.toISOString(),
            category: frontmatter.category,
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            subfolder,
            tableOfContents: this.generateTableOfContents(markdownContent),
            frontmatter,
          }

          notes.push(note)
          this.cache.set(note.id, note)
        } catch (error) {
          console.error("Error processing markdown file:", itemRelativePath, error)
        }
      }
    }
  }

  private generateExcerpt(content: string, maxLength = 200): string {
    const plainText = content
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")
      .replace(/\n+/g, " ")
      .trim()

    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
  }

  async getAllNotes(): Promise<ObsidianNote[]> {
    return this.scanNotesDirectory().sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
    )
  }

  async getNoteBySlug(slug: string): Promise<ObsidianNote | null> {
    const notes = this.scanNotesDirectory()
    return notes.find((note) => note.slug === slug || note.id === slug) || null
  }

  async searchNotes(query: string): Promise<ObsidianNote[]> {
    const sanitizedQuery = SecurityValidator.sanitizeSearchQuery(query)
    if (!sanitizedQuery) return []

    const notes = this.scanNotesDirectory()
    const queryLower = sanitizedQuery.toLowerCase()

    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(queryLower) ||
        note.content.toLowerCase().includes(queryLower) ||
        note.tags.some((tag) => tag.toLowerCase().includes(queryLower)) ||
        (note.category && note.category.toLowerCase().includes(queryLower))
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

  async getMetadata(): Promise<NotesMetadata> {
    const notes = this.scanNotesDirectory()
    const categories = await this.getCategories()
    const tags = await this.getTags()
    const subfolders: string[] = []
    const lastUpdated = notes.length > 0 ? notes[0].lastModified : new Date().toISOString()

    return {
      totalNotes: notes.length,
      categories,
      tags,
      subfolders,
      lastUpdated,
    }
  }
}

export const obsidianNotesManager = new ObsidianNotesManager()
