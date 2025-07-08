"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import Image from "next/image"
import { Copy, Check, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import "highlight.js/styles/github-dark.css"
import type { JSX } from "react"

/**
 * MarkdownRenderer
 * ----------------
 * • Supports GFM, tables, strikethrough, emoji, fenced code blocks
 * • Syntax–highlighting provided by highlight.js via rehype-highlight
 * • Adds smooth-scroll heading links
 * • Handles local image references (`/images/**`) + remote images
 * • Copy-to-clipboard button on fenced code blocks
 * • Fully static -- works on GitHub Pages
 */

interface MarkdownRendererProps {
  content: string
  className?: string
}

/* -------------------------------------------------------------------------- */
/*                               Code block UI                                */
/* -------------------------------------------------------------------------- */

function CodeBlock({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  // `className` will look like "language-ts" or undefined
  const language = className?.replace("language-", "") ?? "txt"
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(children).trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 1_800)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative group my-4">
      {/* copy button */}
      <Button
        aria-label="Copy code"
        size="icon"
        variant="ghost"
        onClick={handleCopy}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-green-400 hover:text-green-300"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>

      <pre
        className={cn(
          "overflow-x-auto rounded-lg border border-green-400/20 bg-black/50 !p-4 font-mono text-sm",
          className,
        )}
        {...props}
      >
        <code className={className}>{children}</code>
      </pre>
      {/* language label */}
      <span className="absolute bottom-1 right-3 select-none text-[10px] uppercase tracking-widest text-green-500/60">
        {language}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                            Image component UI                              */
/* -------------------------------------------------------------------------- */

function MarkdownImage({
  alt,
  src,
}: {
  alt?: string
  src?: string
}): JSX.Element {
  const [isError, setIsError] = useState(false)

  // Normalise image paths
  const resolvedSrc = (() => {
    if (!src) return "/placeholder.svg"
    if (src.startsWith("http")) return src
    if (src.startsWith("/")) return src
    return `/images/${src}`
  })()

  if (isError)
    return (
      <div className="my-6 flex flex-col items-center justify-center gap-2 rounded-lg border border-green-400/30 bg-black/50 p-6 text-center">
        <ImageIcon className="h-10 w-10 text-green-400/60" />
        <p className="text-sm text-green-300/80">Image failed to load</p>
        <code className="break-all text-xs text-green-400/70">{src}</code>
      </div>
    )

  return (
    <figure className="my-8">
      <Image
        src={resolvedSrc || "/placeholder.svg"}
        alt={alt ?? ""}
        width={900}
        height={600}
        className="mx-auto rounded-md border border-green-400/20"
        unoptimized /* required for static export */
        onError={() => setIsError(true)}
      />
      {alt && <figcaption className="mt-2 text-center text-sm italic text-green-300/70">{alt}</figcaption>}
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*                            Main MarkdownRenderer                           */
/* -------------------------------------------------------------------------- */

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  /* Smooth-scroll for autolinked headings */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement
      if (target.tagName === "A" && target.hash && target.getAttribute("aria-label") === "heading-link") {
        e.preventDefault()
        const id = target.hash.replace("#", "")
        const header = document.getElementById(id)
        if (header) {
          const offset = header.getBoundingClientRect().top + window.scrollY - 80
          window.scrollTo({ top: offset, behavior: "smooth" })
          history.replaceState(null, "", target.hash)
        }
      }
    }
    el.addEventListener("click", onClick)
    return () => el.removeEventListener("click", onClick)
  }, [])

  return (
    <div ref={containerRef} className={cn("prose prose-invert prose-green max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          rehypeHighlight,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: "heading-link",
                ariaLabel: "heading-link",
              },
            },
          ],
        ]}
        components={{
          code: CodeBlock,
          img: MarkdownImage,
          /* tweak heading colours */
          h1: ({ node, ...props }) => <h1 {...props} className="text-3xl font-bold text-green-400" />,
          h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold text-green-400" />,
          h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-bold text-green-400" />,
          p: ({ node, ...props }) => <p {...props} className="text-green-300 leading-relaxed" />,
          a: ({ node, href, ...props }) => (
            /* external links open in new tab */
            <a
              {...props}
              href={href}
              className="text-cyan-400 underline hover:text-cyan-300"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
