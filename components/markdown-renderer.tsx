"use client"

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { visit } from "unist-util-visit"
import { cn } from "@/lib/utils"
import "highlight.js/styles/github-dark.css"
import { Info, AlertTriangle, Flame, Lightbulb, CheckCircle2, StickyNote, Copy, Check } from "lucide-react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

const CALLOUT_CONFIG = {
  note: {
    icon: StickyNote,
    label: "Note",
    styles: "border-green-400/40 bg-green-400/10 text-green-100",
  },
  info: {
    icon: Info,
    label: "Info",
    styles: "border-cyan-400/40 bg-cyan-400/10 text-cyan-100",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    styles: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
  },
  success: {
    icon: CheckCircle2,
    label: "Success",
    styles: "border-green-500/40 bg-green-500/10 text-green-100",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    styles: "border-yellow-400/40 bg-yellow-400/10 text-yellow-100",
  },
  danger: {
    icon: Flame,
    label: "Danger",
    styles: "border-red-500/40 bg-red-500/10 text-red-100",
  },
} as const

const normalizeObsidianSyntax = (markdown: string) => {
  let normalized = markdown.replace(/^[ \t]*'''([^\n]*)$/gm, (_, raw = "") => {
    const language = raw.trim()
    return language ? `\u0060\u0060\u0060${language}` : "\u0060\u0060\u0060"
  })

  normalized = normalized.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, rawPath: string, rawAlt?: string) => {
    const path = rawPath.trim()
    const alt = (rawAlt ?? rawPath).trim()
    return `![${alt}](${path})`
  })

  return normalized
}

const remarkCallouts = () => (tree: any) => {
  visit(tree, "blockquote", (node: any) => {
    const firstChild = node.children?.[0]
    const textNode = firstChild?.children?.[0]
    if (!textNode || textNode.type !== "text") return

    const match = /^\[!(\w+)\]\s*(.*)$/i.exec(textNode.value)
    if (!match) return

    const type = match[1].toLowerCase()
    const title = match[2].trim()

    textNode.value = textNode.value.slice(match[0].length).trimStart()
    if (!textNode.value) {
      firstChild.children.shift()
    }
    if (firstChild.children?.length === 0) {
      node.children.shift()
    }

    const data = (node.data || (node.data = {})) as Record<string, unknown>
    const hProps = (data.hProperties || (data.hProperties = {})) as Record<string, unknown>
    hProps["data-callout"] = type
    if (title) {
      hProps["data-callout-title"] = title
    }
  })
}

const parseCodeMeta = (meta?: string) => {
  const details = { title: "", showLineNumbers: false }
  if (!meta) return details
  const titleMatch = meta.match(/title\s*=\s*"([^"]+)"/)
  if (titleMatch) details.title = titleMatch[1]
  if (/\b(lineNumbers|numberLines|showLineNumbers)\b/i.test(meta)) {
    details.showLineNumbers = true
  }
  return details
}

const Blockquote: Components["blockquote"] = ({ node, children, ...props }) => {
  const calloutData = (node as { data?: { hProperties?: Record<string, unknown> } } | undefined)?.data
  const hProps = calloutData?.hProperties as Record<string, unknown> | undefined
  const calloutType = hProps?.["data-callout"] as keyof typeof CALLOUT_CONFIG | undefined

  if (calloutType && CALLOUT_CONFIG[calloutType]) {
    const { icon: Icon, label, styles } = CALLOUT_CONFIG[calloutType]
    const title = hProps?.["data-callout-title"] as string | undefined
    return (
      <div className={cn("my-6 rounded-lg border px-4 py-3 shadow-sm", styles)}>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
          <Icon className="h-4 w-4" />
          <span>{title || label}</span>
        </div>
        <div className="space-y-2 text-sm text-inherit">{children}</div>
      </div>
    )
  }

  return (
    <blockquote className="border-l-4 border-green-400 pl-4 py-2 my-4 bg-green-400/5 text-green-300 italic" {...props}>
      {children}
    </blockquote>
  )
}

type CodeComponentProps = ComponentPropsWithoutRef<"code"> & {
  node?: any
  inline?: boolean
}

const CodeBlock: Components["code"] = ({ node, inline, className = "", children, ...props }: CodeComponentProps) => {
  const [copied, setCopied] = useState(false)

  if (inline) {
    return (
      <code
        className="bg-green-400/10 text-green-300 px-1.5 py-0.5 rounded text-sm font-mono border border-green-400/20"
        {...props}
      >
        {children}
      </code>
    )
  }

  const meta = parseCodeMeta(node?.data?.meta)
  const languageMatch = /language-([\w-]+)/.exec(className ?? "")
  const language = languageMatch?.[1]?.toUpperCase() ?? "CODE"

  const extractText = (value: unknown): string => {
    if (typeof value === "string") return value
    if (Array.isArray(value)) return value.map(extractText).join("")
    if (value && typeof value === "object") {
      const maybeChildren = (value as { props?: { children?: unknown } }).props?.children
      if (maybeChildren !== undefined) {
        return extractText(maybeChildren)
      }
    }
    return value != null ? String(value) : ""
  }

  const codeText = extractText(children)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch (error) {
      console.warn("Unable to copy code block", error)
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-green-400/20 bg-black/70 shadow-[0_0_12px_rgba(52,211,153,0.15)]">
      <div className="flex items-center justify-between border-b border-green-400/20 bg-black/80 px-4 py-2 text-xs uppercase tracking-wide text-green-300/70">
        <span>{meta.title || language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-green-300/70 transition hover:bg-green-400/10 hover:text-green-100"
          aria-label="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre
        {...props}
        data-language={language.toLowerCase()}
        data-line-numbers={meta.showLineNumbers || undefined}
        className={cn(
          "scrollbar-thin overflow-x-auto bg-black/40 p-4 text-sm leading-relaxed",
          meta.showLineNumbers && "pl-12",
        )}
      >
        <code className={cn("block min-w-full font-mono text-green-200", className)}>{children}</code>
      </pre>
    </div>
  )
}

const markdownComponents: Components = {
  h1: ({ children, id, ...props }) => (
    <h1 id={id} className="text-3xl font-bold text-green-400 mb-6 mt-8 first:mt-0 scroll-mt-20 group" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2 id={id} className="text-2xl font-bold text-green-400 mb-4 mt-8 scroll-mt-20 group" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} className="text-xl font-bold text-green-400 mb-3 mt-6 scroll-mt-20 group" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }) => (
    <h4 id={id} className="text-lg font-bold text-green-400 mb-2 mt-4 scroll-mt-20 group" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, id, ...props }) => (
    <h5 id={id} className="text-base font-bold text-green-400 mb-2 mt-4 scroll-mt-20 group" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, id, ...props }) => (
    <h6 id={id} className="text-sm font-bold text-green-400 mb-2 mt-4 scroll-mt-20 group" {...props}>
      {children}
    </h6>
  ),
  p: ({ children, ...props }) => (
    <p className="text-green-300 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="text-green-300 mb-4 ml-6 space-y-2 list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="text-green-300 mb-4 ml-6 space-y-2 list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-green-300 leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: Blockquote,
  code: CodeBlock,
  pre: ({ children, ...props }) => (
    <pre className="bg-black/50 border border-green-400/20 rounded-lg overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="rounded-lg border border-green-400/20 my-6 max-w-full h-auto mx-auto shadow-lg"
      {...props}
    />
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border border-green-400/30 rounded-lg overflow-hidden" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-green-400/10" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, id, ...props }) => (
    <th id={id} className="px-4 py-2 text-left text-green-400 font-semibold border-b border-green-400/30" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2 text-green-300 border-b border-green-400/20" {...props}>
      {children}
    </td>
  ),
  hr: ({ ...props }) => <hr className="border-green-400/30 my-8" {...props} />,
  strong: ({ children, ...props }) => (
    <strong className="text-green-400 font-semibold" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="text-green-300 italic" {...props}>
      {children}
    </em>
  ),
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const normalizedContent = normalizeObsidianSyntax(content)

  // Add smooth scrolling behavior to generated heading links
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault()
        const id = target.getAttribute("href")?.slice(1)
        if (id) {
          const element = document.getElementById(id)
          if (element) {
            const headerOffset = 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            })

            // Update URL hash
            history.replaceState(null, "", `#${id}`)
          }
        }
      }
    }

    container.addEventListener("click", handleClick)
    return () => container.removeEventListener("click", handleClick)
  }, [normalizedContent])

  return (
    <div ref={containerRef} className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkCallouts]}
        rehypePlugins={[
          rehypeHighlight,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["heading-link"],
                ariaLabel: "Link to heading",
              },
            },
          ],
        ]}
        components={markdownComponents}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  )
}
