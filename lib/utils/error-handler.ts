export interface ErrorInfo {
  message: string
  code?: string
  timestamp: Date
  context?: Record<string, any>
}

export class ErrorHandler {
  private static errors: ErrorInfo[] = []
  private static readonly MAX_ERRORS = 100

  static handle(error: Error | string, context?: Record<string, any>): ErrorInfo {
    const errorInfo: ErrorInfo = {
      message: typeof error === "string" ? error : error.message,
      code: typeof error === "object" && "code" in error ? (error as any).code : undefined,
      timestamp: new Date(),
      context,
    }

    // Add to error log
    this.errors.unshift(errorInfo)

    // Keep only the most recent errors
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(0, this.MAX_ERRORS)
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error handled:", errorInfo)
    }

    return errorInfo
  }

  static getRecentErrors(limit = 10): ErrorInfo[] {
    return this.errors.slice(0, limit)
  }

  static clearErrors(): void {
    this.errors = []
  }

  static getErrorCount(): number {
    return this.errors.length
  }

  static formatError(error: ErrorInfo): string {
    const timestamp = error.timestamp.toISOString()
    const context = error.context ? ` | Context: ${JSON.stringify(error.context)}` : ""
    return `[${timestamp}] ${error.message}${context}`
  }

  static isNetworkError(error: Error): boolean {
    return error.message.includes("fetch") || error.message.includes("network") || error.message.includes("timeout")
  }

  static isValidationError(error: Error): boolean {
    return (
      error.message.includes("validation") || error.message.includes("invalid") || error.message.includes("required")
    )
  }

  static createUserFriendlyMessage(error: Error): string {
    if (this.isNetworkError(error)) {
      return "Network connection issue. Please check your internet connection and try again."
    }

    if (this.isValidationError(error)) {
      return "Invalid data provided. Please check your input and try again."
    }

    if (error.message.includes("not found")) {
      return "The requested resource was not found."
    }

    if (error.message.includes("permission") || error.message.includes("unauthorized")) {
      return "You do not have permission to perform this action."
    }

    return "An unexpected error occurred. Please try again later."
  }

  static createError(message: string, code?: string): Error {
    const error = new Error(message)
    if (code) {
      error.name = code
    }
    return error
  }
}

// Global error handler for unhandled promises
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    ErrorHandler.handle(event.reason, { type: "unhandledrejection" })
  })
}
