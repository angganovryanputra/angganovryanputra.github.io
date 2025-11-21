import fs from "fs"
import path from "path"
import { createHash } from "crypto"
import imageSize from "image-size"

interface ImageProcessingOptions {
  sourceDir: string
  targetDir: string
  noteSlug: string
  allowedExtensions: string[]
  maxFileSize: number
}

export interface ProcessedImage {
  webPath: string
  filename: string
  size: number
  hash: string
  width?: number
  height?: number
  type?: string
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB"]
  if (bytes === 0) return "0 Bytes"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`
}

class ImageProcessor {
  private readonly defaultOptions: Partial<ImageProcessingOptions> = {
    allowedExtensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  }

  async processImages(options: ImageProcessingOptions): Promise<{
    processed: ProcessedImage[]
    errors: string[]
    summary: {
      totalFiles: number
      processedFiles: number
      errorFiles: number
      totalSize: number
    }
  }> {
    const config = { ...this.defaultOptions, ...options }
    const processed: ProcessedImage[] = []
    const errors: string[] = []
    let totalSize = 0

    try {
      // Ensure target directory exists
      const noteTargetDir = path.join(config.targetDir, config.noteSlug)
      if (!fs.existsSync(noteTargetDir)) {
        fs.mkdirSync(noteTargetDir, { recursive: true })
      }

      // Get all files from source directory
      const files = this.getImageFiles(config.sourceDir, config.allowedExtensions!)

      for (const file of files) {
        try {
          const stats = fs.statSync(file.path)

          // Check file size
          if (stats.size > config.maxFileSize!) {
            errors.push(`File too large: ${file.name} (${formatFileSize(stats.size)})`)
            continue
          }

          // Generate unique filename to avoid conflicts
          const uniqueFileName = this.generateUniqueFileName(file.name, noteTargetDir)
          const targetPath = path.join(noteTargetDir, uniqueFileName)

          // Copy file to target directory
          const buffer = fs.readFileSync(file.path)
          fs.writeFileSync(targetPath, buffer)

          // Generate web-accessible path
          const webPath = `/images/notes/${config.noteSlug}/${uniqueFileName}`

          const dimensions = this.getImageDimensions(buffer)
          const hash = createHash("sha1").update(buffer).digest("hex")

          processed.push({
            webPath,
            filename: uniqueFileName,
            size: stats.size,
            hash,
            width: dimensions?.width,
            height: dimensions?.height,
            type: dimensions?.type,
          })
          totalSize += stats.size

          console.log(`Processed: ${file.name} -> ${webPath}`)
        } catch (error) {
          errors.push(`Error processing ${file.name}: ${error}`)
        }
      }

      return {
        processed,
        errors,
        summary: {
          totalFiles: files.length,
          processedFiles: processed.length,
          errorFiles: errors.length,
          totalSize,
        },
      }
    } catch (error) {
      throw new Error(`Image processing failed: ${error}`)
    }
  }

  private getImageFiles(sourceDir: string, allowedExtensions: string[]): Array<{ name: string; path: string }> {
    const files: Array<{ name: string; path: string }> = []

    if (!fs.existsSync(sourceDir)) {
      return files
    }

    const items = fs.readdirSync(sourceDir)

    for (const item of items) {
      const itemPath = path.join(sourceDir, item)
      const stats = fs.statSync(itemPath)

      if (stats.isFile()) {
        const ext = path.extname(item).toLowerCase()
        if (allowedExtensions.includes(ext)) {
          files.push({ name: item, path: itemPath })
        }
      } else if (stats.isDirectory()) {
        // Recursively process subdirectories
        const subFiles = this.getImageFiles(itemPath, allowedExtensions)
        files.push(...subFiles)
      }
    }

    return files
  }

  private generateUniqueFileName(originalName: string, targetDir: string): string {
    const ext = path.extname(originalName)
    const baseName = path.basename(originalName, ext)
    let uniqueName = originalName
    let counter = 1

    while (fs.existsSync(path.join(targetDir, uniqueName))) {
      uniqueName = `${baseName}_${counter}${ext}`
      counter++
    }

    return uniqueName
  }

  async updateMarkdownImagePaths(markdownPath: string, imageMap: Map<string, string>): Promise<void> {
    try {
      let content = fs.readFileSync(markdownPath, "utf8")

      // Update image references in markdown
      for (const [oldPath, newPath] of imageMap.entries()) {
        const oldImageRegex = new RegExp(`!\\[([^\\]]*)\\]\$$${this.escapeRegExp(oldPath)}\$$`, "g")
        content = content.replace(oldImageRegex, `![$1](${newPath})`)
      }

      fs.writeFileSync(markdownPath, content, "utf8")
      console.log(`Updated image paths in: ${markdownPath}`)
    } catch (error) {
      throw new Error(`Failed to update markdown file: ${error}`)
    }
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  async generateImageManifest(noteSlug: string, images: ProcessedImage[]): Promise<void> {
    const manifestPath = path.join(process.cwd(), "public", "images", "notes", noteSlug, "manifest.json")

    const manifest = {
      noteSlug,
      generatedAt: new Date().toISOString(),
      images: images.map((image) => ({
        path: image.webPath,
        filename: image.filename,
        url: image.webPath,
        size: image.size,
        hash: image.hash,
        width: image.width,
        height: image.height,
        type: image.type,
      })),
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8")
    console.log(`Generated image manifest: ${manifestPath}`)
  }

  private getImageDimensions(buffer: Buffer) {
    try {
      const result = imageSize(buffer)
      if (!result.width || !result.height) {
        return undefined
      }
      return {
        width: result.width,
        height: result.height,
        type: result.type,
      }
    } catch (error) {
      console.warn("Failed to read image dimensions:", error)
      return undefined
    }
  }
}

// CLI interface for the image processor
export async function processNoteImages(noteSlug: string, sourceDir?: string): Promise<void> {
  const processor = new ImageProcessor()

  const options: ImageProcessingOptions = {
    sourceDir: sourceDir || path.join(process.cwd(), "temp", "images"),
    targetDir: path.join(process.cwd(), "public", "images", "notes"),
    noteSlug,
    allowedExtensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  }

  try {
    console.log(`Processing images for note: ${noteSlug}`)
    console.log(`Source directory: ${options.sourceDir}`)
    console.log(`Target directory: ${path.join(options.targetDir, noteSlug)}`)

    const result = await processor.processImages(options)

    console.log("\n--- Processing Summary ---")
    console.log(`Total files found: ${result.summary.totalFiles}`)
    console.log(`Successfully processed: ${result.summary.processedFiles}`)
    console.log(`Errors: ${result.summary.errorFiles}`)
    console.log(`Total size: ${formatFileSize(result.summary.totalSize)}`)

    if (result.processed.length > 0) {
      console.log("\n--- Processed Images ---")
      result.processed.forEach((image) => {
        const detail = [image.webPath]
        if (image.width && image.height) {
          detail.push(`${image.width}x${image.height}px`)
        }
        detail.push(formatFileSize(image.size))
        console.log(`✓ ${detail.join(" | ")}`)
      })

      // Generate manifest
      await processor.generateImageManifest(noteSlug, result.processed)
    }

    if (result.errors.length > 0) {
      console.log("\n--- Errors ---")
      result.errors.forEach((error) => console.log(`✗ ${error}`))
    }
  } catch (error) {
    console.error("Image processing failed:", error)
    process.exit(1)
  }
}

export const imageProcessor = new ImageProcessor()
