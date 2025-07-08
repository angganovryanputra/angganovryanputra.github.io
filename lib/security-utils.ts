// Enhanced security utilities and validation
import DOMPurify from "isomorphic-dompurify"

// Content Security Policy headers
export const CSP_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.notion.com https://api.rss2json.com https://medium.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

// Enhanced input validation and sanitization
export class SecurityValidator {
  // Sanitize HTML content with strict rules
  static sanitizeHtml(content: string): string {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "code",
        "pre",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "blockquote",
        "a",
        "img",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    })
  }

  // Enhanced search query sanitization
  static sanitizeSearchQuery(query: string): string {
    if (!query || typeof query !== "string") return ""

    return query
      .replace(/[<>"'&]/g, "") // Remove potentially dangerous characters
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/data:/gi, "") // Remove data: protocol
      .replace(/vbscript:/gi, "") // Remove vbscript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
      .substring(0, 200) // Limit length
  }

  // Validate file paths to prevent directory traversal
  static validateFilePath(filePath: string): boolean {
    if (!filePath || typeof filePath !== "string") return false

    // Check for directory traversal attempts
    const dangerousPatterns = [
      "../",
      "..\\",
      "./",
      ".\\",
      "%2e%2e%2f",
      "%2e%2e%5c",
      "..%2f",
      "..%5c",
      "%2e%2e/",
      "%2e%2e\\",
    ]

    const lowerPath = filePath.toLowerCase()
    return !dangerousPatterns.some((pattern) => lowerPath.includes(pattern))
  }

  // Validate markdown content
  static validateMarkdownContent(content: string): boolean {
    if (!content || typeof content !== "string") return false

    // Check for suspicious patterns
    const suspiciousPatterns = [/<script/i, /javascript:/i, /data:text\/html/i, /vbscript:/i, /on\w+\s*=/i]

    return !suspiciousPatterns.some((pattern) => pattern.test(content))
  }

  // Rate limiting for search queries
  private static searchAttempts = new Map<string, { count: number; lastAttempt: number }>()

  static checkSearchRateLimit(identifier: string, maxAttempts = 100, windowMs = 60000): boolean {
    const now = Date.now()
    const attempts = this.searchAttempts.get(identifier)

    if (!attempts) {
      this.searchAttempts.set(identifier, { count: 1, lastAttempt: now })
      return true
    }

    // Reset if window has passed
    if (now - attempts.lastAttempt > windowMs) {
      this.searchAttempts.set(identifier, { count: 1, lastAttempt: now })
      return true
    }

    // Check if limit exceeded
    if (attempts.count >= maxAttempts) {
      return false
    }

    // Increment counter
    attempts.count++
    attempts.lastAttempt = now
    return true
  }

  // Clean up old rate limit entries
  static cleanupRateLimit(): void {
    const now = Date.now()
    const windowMs = 60000

    for (const [key, value] of this.searchAttempts.entries()) {
      if (now - value.lastAttempt > windowMs) {
        this.searchAttempts.delete(key)
      }
    }
  }
}

// Secure error handling
export class SecureError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, code: string, statusCode = 500) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.isOperational = true
    this.name = "SecureError"
  }

  // Return safe error message for client
  toClientError(): { message: string; code: string } {
    const safeMessages: Record<string, string> = {
      RATE_LIMIT_EXCEEDED: "Too many requests. Please try again later.",
      INVALID_INPUT: "Invalid input provided.",
      FILE_NOT_FOUND: "Requested file not found.",
      VALIDATION_ERROR: "Input validation failed.",
      UNAUTHORIZED: "Access denied.",
      NETWORK_ERROR: "Network connection failed.",
    }

    return {
      message: safeMessages[this.code] || "An error occurred.",
      code: this.code,
    }
  }
}

// Secure logging utility
export class SecurityLogger {
  private static sensitiveFields = ["password", "token", "key", "secret", "auth"]

  static log(level: "info" | "warn" | "error", message: string, data?: any): void {
    const sanitizedData = data ? this.sanitizeLogData(data) : undefined
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: this.sanitizeLogMessage(message),
      data: sanitizedData,
    }

    if (typeof window === "undefined") {
      console[level](JSON.stringify(logEntry))
    } else if (level === "error") {
      console.error(logEntry.message, sanitizedData)
    }
  }

  private static sanitizeLogData(data: any): any {
    if (typeof data !== "object" || data === null) {
      return data
    }

    const sanitized = { ...data }
    for (const field of this.sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = "[REDACTED]"
      }
    }

    return sanitized
  }

  private static sanitizeLogMessage(message: string): string {
    return message.replace(/[<>"'&]/g, "").substring(0, 500)
  }
}

// Request timeout utility with security considerations
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new SecureError("Request timeout", "TIMEOUT", 408)), timeoutMs),
    ),
  ])
}
