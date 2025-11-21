import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { siteConfig } from "@/lib/site-config"

const notesDirectory = path.join(process.cwd(), "notes")
const publicDirectory = path.join(process.cwd(), "public")
const feedPath = path.join(publicDirectory, "feed.xml")

const stripMarkdown = (markdown: string): string =>
  markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^\)]*\)/g, (match) => match.replace(/\[([^\]]*)\]\(([^)]*)\)/g, "$1"))
    .replace(/[#>*_~`>-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

const getNoteFiles = (dir: string, relativePath = ""): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    const entryRelative = path.join(relativePath, entry.name)

    if (entry.isDirectory()) {
      files.push(...getNoteFiles(entryPath, entryRelative))
    } else if (entry.isFile() && /\.(md|markdown)$/i.test(entry.name)) {
      files.push(entryRelative)
    }
  }

  return files
}

const buildFeedItem = (fileRelativePath: string) => {
  const absolutePath = path.join(notesDirectory, fileRelativePath)
  const fileContents = fs.readFileSync(absolutePath, "utf8")
  const { data, content } = matter(fileContents)

  const slug = fileRelativePath.replace(/\\/g, "/").replace(/\.(md|markdown)$/i, "")
  const url = `${siteConfig.url.replace(/\/$/, "")}${siteConfig.content.notesBasePath}/${slug}`
  const descriptionSource = data.description || stripMarkdown(content).slice(0, 320)

  return {
    title: data.title || slug,
    url,
    guid: url,
    description: descriptionSource,
    published: data.date ? new Date(data.date) : fs.statSync(absolutePath).mtime,
    updated: data.updated ? new Date(data.updated) : undefined,
    categories: Array.isArray(data.tags) ? data.tags : [],
    author: data.author || siteConfig.author.name,
  }
}

function buildRssFeed() {
  if (!fs.existsSync(publicDirectory)) {
    fs.mkdirSync(publicDirectory, { recursive: true })
  }

  const noteFiles = getNoteFiles(notesDirectory)
  const items = noteFiles.map(buildFeedItem).sort((a, b) => b.published.getTime() - a.published.getTime())

  const lastBuildDate = items.length > 0 ? items[0].published.toUTCString() : new Date().toUTCString()

  const rssItems = items
    .slice(0, siteConfig.content.maxFeedItems || 25)
    .map((item) => {
      const categories = item.categories
        .map((category) => `    <category>${escapeXml(category)}</category>`) 
        .join("\n")

      return [
        "  <item>",
        `    <title><![CDATA[${item.title}]]></title>`,
        `    <link>${item.url}</link>`,
        `    <guid>${item.guid}</guid>`,
        `    <pubDate>${item.published.toUTCString()}</pubDate>`,
        item.updated ? `    <lastBuildDate>${item.updated.toUTCString()}</lastBuildDate>` : null,
        categories || null,
        `    <description><![CDATA[${item.description}]]></description>`,
        "  </item>",
      ]
        .filter(Boolean)
        .join("\n")
    })
    .join("\n")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0">\n` +
    `<channel>\n` +
    `  <title>${escapeXml(siteConfig.name)}</title>\n` +
    `  <link>${siteConfig.url}</link>\n` +
    `  <description>${escapeXml(siteConfig.description)}</description>\n` +
    `  <language>${siteConfig.language}</language>\n` +
    `  <lastBuildDate>${lastBuildDate}</lastBuildDate>\n` +
    `${rssItems}\n` +
    `</channel>\n` +
    `</rss>\n`

  fs.writeFileSync(feedPath, rss)
  console.log(`RSS feed generated at ${feedPath}`)
}

buildRssFeed()
