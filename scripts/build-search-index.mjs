import fs from "fs"
import path from "path"
import matter from "gray-matter"
import https from "https"

const notesDirectory = path.join(process.cwd(), "notes")
const outputDirectory = path.join(process.cwd(), "public")
const outputFile = path.join(outputDirectory, "search-index.json")
const DEFAULT_EXCERPT_LENGTH = 220
const MAX_KEYWORDS = 12

const stripMarkdown = (markdown = "") =>
  markdown
    .replace(/---[\s\S]*?---/g, "") // remove frontmatter
    .replace(/`{3}[\s\S]*?`{3}/g, "") // remove code fences
    .replace(/`([^`]+)`/g, "$1") // remove inline code ticks
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, "") // remove images
    .replace(/\[[^\]]*\]\([^\)]*\)/g, (match) => match.replace(/\[[^\]]*\]\(([^)]+)\)/g, "$1")) // links to text
    .replace(/[#>*_~`>-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const createExcerpt = (content = "", length = DEFAULT_EXCERPT_LENGTH) => {
  const clean = stripMarkdown(content)
  if (!clean) return ""
  return clean.length > length ? `${clean.slice(0, length).trim()}…` : clean
}

const tokenize = (value = "") =>
  Array.from(
    new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9+#]+/i)
        .map((token) => token.trim())
        .filter(Boolean),
    ),
  )

const deriveKeywords = (entry) => {
  const keywordSource = [entry.title, entry.category, ...(entry.tags || []), entry.excerpt, entry.content]
    .filter(Boolean)
    .join(" ")

  const tokens = tokenize(keywordSource)
  return tokens.slice(0, MAX_KEYWORDS)
}

const normalizeTags = (tags = []) =>
  Array.from(
    new Set(
      tags
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter(Boolean),
    ),
  )

const estimateReadTime = (content = "") => {
  const words = stripMarkdown(content).split(/\s+/).filter(Boolean)
  const minutes = Math.max(1, Math.round(words.length / 200))
  return minutes
}

// Helper to fetch Medium posts
function fetchMediumPosts(username) {
  return new Promise((resolve) => {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`
    https
      .get(url, (res) => {
        let data = ""
        res.on("data", (chunk) => {
          data += chunk
        })
        res.on("end", () => {
          try {
            const json = JSON.parse(data)
            if (json.status === "ok") {
              console.log(`Successfully fetched ${json.items.length} Medium posts.`)
              resolve(json.items)
            } else {
              console.error("Failed to fetch Medium posts:", json.message)
              resolve([])
            }
          } catch (e) {
            console.error("Error parsing Medium RSS JSON:", e)
            resolve([])
          }
        })
      })
      .on("error", (err) => {
        console.error("Error fetching Medium RSS feed:", err.message)
        resolve([])
      })
  })
}

function getAllNotesRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let notes = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      notes = notes.concat(getAllNotesRecursively(fullPath))
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)
      const slug = path.relative(notesDirectory, fullPath).replace(/\.md$/, "")
      const plainContent = stripMarkdown(content)
      const excerpt = data.excerpt || data.summary || createExcerpt(content)
      const publishedDate = data.date || fs.statSync(fullPath).mtime.toISOString()

      notes.push({
        id: slug,
        slug,
        title: data.title || slug,
        content: plainContent,
        excerpt,
        description: data.description || excerpt,
        tags: normalizeTags(data.tags),
        category: data.category || path.dirname(slug) || "General",
        type: "note",
        url: `/notes/${slug}`,
        publishedDate,
        updatedAt: data.updated || publishedDate,
        readingTime: estimateReadTime(content),
        cover: data.cover || null,
        keywords: deriveKeywords({
          title: data.title || slug,
          category: data.category || path.dirname(slug) || "General",
          tags: normalizeTags(data.tags),
          excerpt,
          content: plainContent,
        }),
      })
    }
  }
  return notes
}

const mapMediumPost = (post) => {
  const description = stripMarkdown(post.description || "")
  const excerpt = createExcerpt(description || post.title || "")
  const tags = normalizeTags(post.categories)
  const baseEntry = {
    id: post.guid,
    slug: post.guid,
    title: post.title,
    content: description,
    excerpt,
    description: description,
    tags,
    category: "Medium Article",
    type: "medium",
    url: post.link,
    publishedDate: post.pubDate || new Date().toISOString(),
    updatedAt: post.pubDate || new Date().toISOString(),
    readingTime: post.readingTime || estimateReadTime(description),
    cover: post.thumbnail || null,
  }

  return {
    ...baseEntry,
    keywords: deriveKeywords({
      title: baseEntry.title,
      category: baseEntry.category,
      tags,
      excerpt,
      content: description,
    }),
  }
}

async function buildSearchIndex() {
  console.log("Starting search index build…")

  const localNotes = getAllNotesRecursively(notesDirectory)
  console.log(`Found ${localNotes.length} local notes.`)

  const mediumPosts = await fetchMediumPosts("angganvryn")
  const formattedMediumPosts = mediumPosts.map(mapMediumPost)

  const searchIndex = [...localNotes, ...formattedMediumPosts]

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory)
  }
  fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2))
  console.log(`Search index successfully built with ${searchIndex.length} items at: ${outputFile}`)
}

buildSearchIndex()
