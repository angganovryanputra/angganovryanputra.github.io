// Browser-compatible filesystem shim
export default {
  existsSync: (path: string): boolean => {
    // In browser environment, we'll simulate file existence
    return false
  },

  mkdirSync: (path: string, options?: any): void => {
    // No-op in browser
    console.log(`[Browser] Would create directory: ${path}`)
  },

  readdirSync: (path: string): string[] => {
    // Return empty array in browser
    return []
  },

  readFileSync: (path: string, encoding?: string): string => {
    // Return empty string in browser
    return ""
  },

  writeFileSync: (path: string, data: string, encoding?: string): void => {
    // No-op in browser
    console.log(`[Browser] Would write file: ${path}`)
  },

  statSync: (path: string): any => {
    // Return mock stats object
    return {
      isDirectory: () => false,
      isFile: () => true,
      mtime: new Date(),
    }
  },
}
