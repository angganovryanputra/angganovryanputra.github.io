// Browser-compatible path utilities shim
export default {
  join: (...paths: string[]): string => {
    return paths.filter(Boolean).join("/").replace(/\/+/g, "/")
  },

  basename: (path: string, ext?: string): string => {
    const base = path.split("/").pop() || ""
    if (ext && base.endsWith(ext)) {
      return base.slice(0, -ext.length)
    }
    return base
  },

  dirname: (path: string): string => {
    const parts = path.split("/")
    parts.pop()
    return parts.join("/") || "."
  },

  extname: (path: string): string => {
    const base = path.split("/").pop() || ""
    const dotIndex = base.lastIndexOf(".")
    return dotIndex > 0 ? base.slice(dotIndex) : ""
  },
}
