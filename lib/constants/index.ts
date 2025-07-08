export const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
  FOLDER: "folder",
  TIMELINE: "timeline",
} as const

export const SORT_OPTIONS = {
  DATE_DESC: "date-desc",
  DATE_ASC: "date-asc",
  TITLE_ASC: "title-asc",
  TITLE_DESC: "title-desc",
  CATEGORY_ASC: "category-asc",
} as const

export const FILTER_ALL = "all"

export const SEARCH_DEBOUNCE_MS = 300
export const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes
export const WORDS_PER_MINUTE = 200

export const SUPPORTED_IMAGE_FORMATS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
export const SUPPORTED_MARKDOWN_FORMATS = [".md", ".markdown"]

export const DEFAULT_EXCERPT_LENGTH = 200
export const MAX_TAGS_DISPLAY = 4
export const MAX_RELATED_NOTES = 5

export const THEME_COLORS = {
  PRIMARY: "green-400",
  SECONDARY: "cyan-400",
  ACCENT: "blue-400",
  WARNING: "yellow-400",
  ERROR: "red-400",
  SUCCESS: "green-400",
} as const
