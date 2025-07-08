// Static Site Generation Utilities for GitHub Pages
import { fetchMediumPosts } from "./medium-rss"
import { fetchNotionNotes } from "./notion-api"

export async function generateStaticData() {
  try {
    // Fetch data at build time for static generation
    const [mediumPosts, notionNotes] = await Promise.all([
      fetchMediumPosts("angga.cybersec"),
      fetchNotionNotes(process.env.NOTION_DATABASE_ID || ""),
    ])

    return {
      mediumPosts,
      notionNotes,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error generating static data:", error)
    return {
      mediumPosts: [],
      notionNotes: [],
      lastUpdated: new Date().toISOString(),
    }
  }
}

// Environment variables validation
export function validateEnvironment() {
  const requiredVars = ["NOTION_API_KEY", "NOTION_DATABASE_ID", "RSS2JSON_API_KEY"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`)
    console.warn("Using fallback data for development")
  }

  return missing.length === 0
}
