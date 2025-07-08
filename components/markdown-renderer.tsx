"use client"

import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { cn } from "@/lib/utils"
import "highlight.js/styles/github-dark.css"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

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
  }, [content])

  return (
    <div ref={containerRef} className={cn("markdown-content", className)}>
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
                className: ["heading-link"],
                ariaLabel: "Link to heading",
              },
            },
          ],
        ]}
        components={{
          h1: ({ children, id, ...props }) => (
            <h1
              id={id}
              className="text-3xl font-bold text-green-400 mb-6 mt-8 first:mt-0 scroll-mt-20 group"
              {...props}
            >
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
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-green-400 pl-4 py-2 my-4 bg-green-400/5 text-green-300 italic"
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ inline, className, children, ...props }) => {
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
            return (
              <code
                className={cn(
                  "block bg-black/50 text-green-300 p-4 rounded-lg overflow-x-auto font-mono text-sm border border-green-400/20",
                  className,
                )}
                {...props}
              >
                {children}
              </code>
            )
          },
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
              className="rounded-lg border border-green-400/20 my-6 max-w-full h-auto mx-auto shadow-lg"
              {...props} 
            />
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-green-400/30 rounded-lg overflow-hidden" {...props}>{
                children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-green-400/10" {...props}>{
              children}
            </thead>
          ),
          th: ({ children, id, ...props }) => (
            <th
              id={id}
              className="px-4 py-2 text-left text-green-400 font-semibold border-b border-green-400/30"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-2 text-green-300 border-b border-green-400/20" {...props}>{
              children}
            </td>
          ),
          hr: ({ ...props }) => <hr className="border-green-400/30 my-8" {...props} />,
          strong: ({ children, ...props }) => (
            <strong className="text-green-400 font-semibold" {...props}>{
              children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="text-green-300 italic" {...props}>{
              children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
