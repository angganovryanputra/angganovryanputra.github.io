export class SecurityValidator {
  private static readonly DANGEROUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
  ]

  private static readonly PATH_TRAVERSAL_PATTERNS = [/\.\./g, /\/\.\./g, /\.\.\//g, /~\//g]

  static validateFilePath(filePath: string): boolean {
    if (!filePath || typeof filePath !== "string") {
      return false
    }

    // Check for path traversal attempts
    for (const pattern of this.PATH_TRAVERSAL_PATTERNS) {
      if (pattern.test(filePath)) {
        return false
      }
    }

    // Only allow alphanumeric, hyphens, underscores, dots, and forward slashes
    const allowedPathPattern = /^[a-zA-Z0-9\-_./]+$/
    return allowedPathPattern.test(filePath)
  }

  static validateMarkdownContent(content: string): boolean {
    if (!content || typeof content !== "string") {
      return false
    }

    // Check for dangerous patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(content)) {
        return false
      }
    }

    return true
  }

  static sanitizeHtml(html: string): string {
    if (!html || typeof html !== "string") {
      return ""
    }

    // Remove dangerous patterns
    let sanitized = html
    for (const pattern of this.DANGEROUS_PATTERNS) {
      sanitized = sanitized.replace(pattern, "")
    }

    return sanitized
  }

  static sanitizeSearchQuery(query: string): string {
    if (!query || typeof query !== "string") {
      return ""
    }

    // Remove special characters that could be used for injection
    return query
      .replace(/[<>'"&]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 100) // Limit length
  }

  static validateFrontmatter(frontmatter: any): boolean {
    if (!frontmatter || typeof frontmatter !== "object") {
      return false
    }

    // Check if title exists and is a string
    if (!frontmatter.title || typeof frontmatter.title !== "string") {
      return false
    }

    // Validate tags if present
    if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
      return false
    }

    // Validate category if present
    if (frontmatter.category && typeof frontmatter.category !== "string") {
      return false
    }

    return true
  }
}
