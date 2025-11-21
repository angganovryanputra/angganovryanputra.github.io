import fs from "fs"
import path from "path"
import { siteConfig } from "@/lib/site-config"
import { getAllNotes } from "@/lib/notes"

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: number
}

function formatEntry(entry: SitemapEntry): string {
  const parts = [`  <loc>${entry.loc}</loc>`]
  if (entry.lastmod) {
    parts.push(`  <lastmod>${entry.lastmod}</lastmod>`)
  }
  if (entry.changefreq) {
    parts.push(`  <changefreq>${entry.changefreq}</changefreq>`)
  }
  if (typeof entry.priority === "number") {
    parts.push(`  <priority>${entry.priority.toFixed(1)}</priority>`)
  }
  return `<url>\n${parts.join("\n")}\n</url>`
}

function normalizeUrl(baseUrl: string, pathname: string): string {
  const cleanBase = baseUrl.replace(/\/$/, "")
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `${cleanBase}${cleanPath}`
}

async function generateSitemap() {
  const publicDir = path.join(process.cwd(), "public")

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const baseUrl = siteConfig.url.replace(/\/$/, "")
  const staticRoutes: SitemapEntry[] = [
    { loc: normalizeUrl(baseUrl, "/"), changefreq: "weekly", priority: 1.0 },
    { loc: normalizeUrl(baseUrl, "/notes"), changefreq: "weekly", priority: 0.9 },
  ]

  const notes = getAllNotes()
  const noteEntries: SitemapEntry[] = notes.map((note) => ({
    loc: normalizeUrl(baseUrl, `${siteConfig.content.notesBasePath}/${note.slug}`),
    lastmod: new Date(note.date).toISOString(),
    changefreq: "monthly",
    priority: 0.8,
  }))

  const entries = [...staticRoutes, ...noteEntries]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries.map(formatEntry).join("\n")}\n` +
    `</urlset>\n`

  const outputPath = path.join(publicDir, "sitemap.xml")
  fs.writeFileSync(outputPath, xml)
  console.log(`Sitemap generated at ${outputPath}`)
}

generateSitemap().catch((error) => {
  console.error("Failed to generate sitemap", error)
  process.exit(1)
})
