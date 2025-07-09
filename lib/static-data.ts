// Static data generation for build time
import { fetchMediumPosts } from "./medium-rss"

export interface StaticData {
  mediumPosts: any[]
  lastUpdated: string
}

export async function generateStaticData(): Promise<StaticData> {
  try {
    console.log("Generating static data for build...")

    // Fetch data at build time
    const mediumPosts = await fetchMediumPosts("angganvryn").catch((err) => {
      console.warn("Medium fetch failed, using fallback:", err.message)
      return []
    })

    const staticData = {
      mediumPosts,
      lastUpdated: new Date().toISOString(),
    }

    console.log(`Generated static data: ${mediumPosts.length} blog posts`)

    return staticData
  } catch (error) {
    console.error("Error generating static data:", error)
    return {
      mediumPosts: [],
      lastUpdated: new Date().toISOString(),
    }
  }
}
