// Enhanced Medium RSS Feed Integration with environment variables
export interface MediumPost {
  title: string
  link: string
  pubDate: string
  description: string
  categories: string[]
  guid: string
  author: string
  thumbnail?: string
  readTime?: string
}

export async function fetchMediumPosts(username?: string): Promise<MediumPost[]> {
  try {
    // Use environment variables with fallback
    const mediumUsername =
      username || process.env.MEDIUM_USERNAME || process.env.NEXT_PUBLIC_MEDIUM_USERNAME || "angganvryn"

    const rss2jsonApiKey =
      process.env.RSS2JSON_API_KEY ||
      process.env.NEXT_PUBLIC_RSS2JSON_API_KEY ||
      "b4a3mywyljh1tu4escwpzzqnnvei4txpnixkmcxz"

    const rss2jsonUrl =
      process.env.RSS2JSON_URL || process.env.NEXT_PUBLIC_RSS2JSON_URL || "https://api.rss2json.com/v1/api.json"

    console.log("Fetching Medium posts for:", mediumUsername)

    const rssUrl = `https://medium.com/feed/@${mediumUsername}`
    const apiUrl = `${rss2jsonUrl}?rss_url=${encodeURIComponent(rssUrl)}&api_key=${rss2jsonApiKey}&count=10&order_dir=desc`

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RSS Reader)",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Medium posts: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== "ok") {
      throw new Error(`RSS feed parsing failed: ${data.message || "Unknown error"}`)
    }

    if (!data.items || data.items.length === 0) {
      console.warn("No posts found in RSS feed")
      return []
    }

    console.log(`Successfully fetched ${data.items.length} Medium posts`)

    return data.items.map((item: any) => ({
      title: item.title || "Untitled",
      link: item.link || "",
      pubDate: item.pubDate || new Date().toISOString(),
      description: stripHtml(item.description || "").substring(0, 300) + "...",
      categories: item.categories || [],
      guid: item.guid || item.link || Math.random().toString(),
      author: item.author || "Angga Novryan Putra F.",
      thumbnail: extractThumbnail(item.description || ""),
      readTime: estimateReadTime(item.description || ""),
    }))
  } catch (error) {
    console.error("Error fetching Medium posts:", error)
    throw error
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function extractThumbnail(description: string): string | undefined {
  const imgMatch = description.match(/<img[^>]+src="([^">]+)"/)
  return imgMatch ? imgMatch[1] : undefined
}

function estimateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = stripHtml(content).split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}
