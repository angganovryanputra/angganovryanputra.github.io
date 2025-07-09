// Static Site Generation Utilities for GitHub Pages
import { fetchMediumPosts } from "./medium-rss"

export async function generateStaticData() {
  try {
    // Fetch data at build time for static generation
    const mediumPosts = await fetchMediumPosts("angganvryn")

    return {
      mediumPosts,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error generating static data:", error)
    return {
      mediumPosts: [],
      lastUpdated: new Date().toISOString(),
    }
  }
}

// Environment variables validation
export function validateEnvironment() {
  const requiredVars = ["RSS2JSON_API_KEY"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`)
    console.warn("Using fallback data for development")
  }

  return missing.length === 0
}
