// Static data generation for build time
import { fetchMediumPosts } from "./medium-rss"
import { fetchNotionNotes } from "./notion-api"

export interface StaticData {
  mediumPosts: any[]
  notionNotes: any[]
  lastUpdated: string
}

export async function generateStaticData(): Promise<StaticData> {
  try {
    console.log("Generating static data for build...")

    // Fetch data at build time
    const [mediumPosts, notionNotes] = await Promise.all([
      fetchMediumPosts("angga.cybersec").catch((err) => {
        console.warn("Medium fetch failed, using fallback:", err.message)
        return []
      }),
      fetchNotionNotes().catch((err) => {
        console.warn("Notion fetch failed, using fallback:", err.message)
        return []
      }),
    ])

    const staticData = {
      mediumPosts,
      notionNotes,
      lastUpdated: new Date().toISOString(),
    }

    console.log(`Generated static data: ${mediumPosts.length} blog posts, ${notionNotes.length} notes`)

    return staticData
  } catch (error) {
    console.error("Error generating static data:", error)
    return {
      mediumPosts: [],
      notionNotes: [],
      lastUpdated: new Date().toISOString(),
    }
  }
}

// Environment validation for build time
export function validateBuildEnvironment(): boolean {
  const requiredVars = ["NOTION_API_KEY", "NOTION_DATABASE_ID"]
  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(", ")}`)
    console.warn("Using fallback data for static generation")
    return false
  }

  console.log("✅ All required environment variables are present")
  return true
}
