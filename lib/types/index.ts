// Core type definitions for the cybersecurity portfolio
export interface BlogPost {
  title: string
  link: string
  pubDate: string
  author: string
  content: string
  contentSnippet: string
  guid: string
  categories: string[]
  isoDate: string
  thumbnail?: string
  enclosure?: {
    url: string
    type: string
  }
}

export interface Note {
  slug: string
  title: string
  content: string
  excerpt: string
  frontmatter: NoteFrontmatter
  readingTime: number
  wordCount: number
  lastModified: string
}

export interface NoteFrontmatter {
  title: string
  category: string
  tags: string[]
  date: string
  author: string
  description?: string
  published?: boolean
  featured?: boolean
}

export interface SearchResult {
  id: string
  title: string
  content: string
  excerpt: string
  url: string
  type: "note" | "article" | "page"
  category: string
  tags: string[]
  score: number
  publishedAt: string
  thumbnail?: string
}

export interface SearchQuery {
  query: string
  filters?: {
    type?: string[]
    category?: string[]
    tags?: string[]
    dateRange?: {
      start: string
      end: string
    }
  }
  sort?: "relevance" | "date" | "title"
  limit?: number
  offset?: number
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  responsibilities: string[]
  technologies: string[]
  achievements: string[]
}

export interface Skill {
  id: string
  name: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  description: string
  yearsOfExperience: number
  certifications?: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId: string
  verificationUrl?: string
  description: string
  skills: string[]
  logo?: string
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
}

export interface SecurityConfig {
  maxRequestsPerMinute: number
  maxRequestsPerHour: number
  blockDuration: number
  trustedOrigins: string[]
  allowedFileTypes: string[]
  maxFileSize: number
}

export interface BuildConfig {
  staticExport: boolean
  trailingSlash: boolean
  basePath: string
  assetPrefix: string
  distDir: string
  generateBuildId: () => string
}

export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  author: string
  ogImage?: string
  twitterCard?: "summary" | "summary_large_image"
  canonicalUrl?: string
  structuredData?: Record<string, any>
}
