import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { siteConfig } from "@/lib/site-config"

interface ValidationIssue {
  file: string
  message: string
  severity: "error" | "warning"
}

const notesDir = path.join(process.cwd(), "notes")
const publicImagesDir = path.join(process.cwd(), "public", "images")

const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
const internalLinkRegex = /\[[^\]]+\]\((\/[^)#]+)(?:#[^)]*)?\)/g

const isUrl = (value: string) => /^https?:\/\//i.test(value)

function walkNotes(dir: string, relative = ""): string[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const entryPath = path.join(dir, entry.name)
    const relPath = path.join(relative, entry.name)

    if (entry.isDirectory()) {
      files.push(...walkNotes(entryPath, relPath))
    } else if (entry.isFile() && /\.(md|markdown)$/i.test(entry.name)) {
      files.push(relPath)
    }
  }

  return files
}

function validateFrontmatter(file: string, data: Record<string, any>, issues: ValidationIssue[]) {
  const requiredFields: Array<{ key: string; check: (value: unknown) => boolean; message: string }> = [
    {
      key: "title",
      check: (value) => typeof value === "string" && value.trim().length > 0,
      message: "Frontmatter 'title' is required",
    },
    {
      key: "date",
      check: (value) => value === undefined || !Number.isNaN(new Date(value as string).getTime()),
      message: "Frontmatter 'date' should be a valid date string",
    },
    {
      key: "tags",
      check: (value) => Array.isArray(value) && value.every((tag) => typeof tag === "string" && tag.trim().length > 0),
      message: "Frontmatter 'tags' should be an array of non-empty strings",
    },
  ]

  for (const field of requiredFields) {
    if (!field.check(data[field.key])) {
      issues.push({ file, message: field.message, severity: "error" })
    }
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length === 0) {
    issues.push({
      file,
      message: "Frontmatter 'description' should be defined for SEO",
      severity: "warning",
    })
  } else {
    const descriptionLength = data.description.trim().length
    if (descriptionLength < 40) {
      issues.push({
        file,
        message: "Frontmatter 'description' is very short (< 40 chars)",
        severity: "warning",
      })
    }
    if (descriptionLength > 180) {
      issues.push({
        file,
        message: "Frontmatter 'description' is quite long (> 180 chars)",
        severity: "warning",
      })
    }
  }

  if (data.cover && typeof data.cover === "string" && !isUrl(data.cover) && !data.cover.startsWith("/")) {
    issues.push({
      file,
      message: "Frontmatter 'cover' should be an absolute path (/images/...) or full URL",
      severity: "warning",
    })
  }

  if (Array.isArray(data.tags)) {
    const normalizedTags = data.tags
      .filter((tag) => typeof tag === "string")
      .map((tag: string) => tag.trim().toLowerCase())
      .filter(Boolean)

    const uniqueTags = new Set(normalizedTags)
    if (uniqueTags.size !== normalizedTags.length) {
      issues.push({
        file,
        message: "Frontmatter 'tags' contains duplicates (case-insensitive)",
        severity: "warning",
      })
    }
  }
}

function validateImages(file: string, content: string, issues: ValidationIssue[]) {
  let match: RegExpExecArray | null

  while ((match = markdownImageRegex.exec(content)) !== null) {
    const [, alt, src] = match
    if (!alt || alt.trim().length === 0) {
      issues.push({ file, message: "Image alt text should not be empty", severity: "warning" })
    }

    if (isUrl(src)) continue

    if (!src.startsWith("/")) {
      issues.push({
        file,
        message: `Image source '${src}' should start with '/' or be an absolute URL`,
        severity: "warning",
      })
      continue
    }

    const imagePath = path.join(publicImagesDir, src.replace(/^\//, ""))
    if (!fs.existsSync(imagePath)) {
      issues.push({ file, message: `Image '${src}' does not exist under /public`, severity: "error" })
    }
  }
}

function validateLinks(file: string, content: string, issues: ValidationIssue[]) {
  let match: RegExpExecArray | null
  while ((match = internalLinkRegex.exec(content)) !== null) {
    const href = match[1]
    if (!href.startsWith("/")) continue

    // Only check pages under site base path
    if (href.startsWith(siteConfig.content.notesBasePath)) {
      const slug = href.replace(siteConfig.content.notesBasePath, "").replace(/^\/+/, "")
      const targetPath = path.join(notesDir, `${slug}.md`)
      if (!fs.existsSync(targetPath)) {
        issues.push({ file, message: `Internal link target '${href}' not found`, severity: "warning" })
      }
    }
  }
}

function main() {
  const issues: ValidationIssue[] = []
  const files = walkNotes(notesDir)

  if (files.length === 0) {
    console.warn("No markdown notes found to validate")
    return
  }

  for (const relPath of files) {
    const absolute = path.join(notesDir, relPath)
    const raw = fs.readFileSync(absolute, "utf8")
    const { data, content } = matter(raw)

    validateFrontmatter(relPath, data, issues)
    validateImages(relPath, content, issues)
    validateLinks(relPath, content, issues)
  }

  if (issues.length === 0) {
    console.log(`✓ Content validation passed for ${files.length} files.`)
    return
  }

  const errors = issues.filter((issue) => issue.severity === "error")
  const warnings = issues.filter((issue) => issue.severity === "warning")

  warnings.forEach((issue) => console.warn(`⚠ [${issue.file}] ${issue.message}`))
  errors.forEach((issue) => console.error(`✗ [${issue.file}] ${issue.message}`))

  console.log(`Validation finished with ${errors.length} error(s) and ${warnings.length} warning(s).`)

  if (errors.length > 0) {
    process.exit(1)
  }
}

main()
