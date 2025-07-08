// API Rate Limiting Implementation
interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: any) => string
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private static instance: RateLimiter
  private requests: Map<string, RateLimitEntry> = new Map()
  private config: RateLimitConfig

  private constructor(config: RateLimitConfig) {
    this.config = config
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000)
  }

  static getInstance(config?: RateLimitConfig): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter(
        config || {
          windowMs: 15 * 60 * 1000, // 15 minutes
          maxRequests: 100, // 100 requests per window
        },
      )
    }
    return RateLimiter.instance
  }

  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const key = identifier
    const entry = this.requests.get(key)

    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      const resetTime = now + this.config.windowMs
      this.requests.set(key, { count: 1, resetTime })
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime,
      }
    }

    if (entry.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    }

    // Increment count
    entry.count++
    this.requests.set(key, entry)

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    }
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }

  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier)
    } else {
      this.requests.clear()
    }
  }
}

// Rate limiting middleware for API calls
export function createRateLimitedFetch(config?: RateLimitConfig) {
  const rateLimiter = RateLimiter.getInstance(config)

  return async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
    // Generate identifier based on URL and user context
    const identifier = `${url}_${typeof window !== "undefined" ? window.location.hostname : "server"}`

    const limitCheck = rateLimiter.checkLimit(identifier)

    if (!limitCheck.allowed) {
      const waitTime = limitCheck.resetTime - Date.now()
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds.`)
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          "X-RateLimit-Remaining": limitCheck.remaining.toString(),
          "X-RateLimit-Reset": limitCheck.resetTime.toString(),
        },
      })

      return response
    } catch (error) {
      console.error("Rate limited fetch error:", error)
      throw error
    }
  }
}

// Specific rate limiters for different APIs
export const notionRateLimiter = createRateLimitedFetch({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 3, // 3 requests per minute for Notion API
})

export const mediumRateLimiter = createRateLimitedFetch({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute for Medium RSS
})

export const searchRateLimiter = createRateLimitedFetch({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 searches per minute
})
