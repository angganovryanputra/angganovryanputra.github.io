"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import type { NoteData } from "@/lib/notes"
import { ArrowLeft, Calendar, User, Tag, Clock, BookOpen, Hash, ListTree, ArrowUp, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TocItemData {
  slug: string;
  text: string;
  level: number;
  children: TocItemData[];
}

interface NoteViewerClientProps {
  note: NoteData
}

function buildTocTree(items: NoteData['toc']): TocItemData[] {
  const tocTree: TocItemData[] = [];
  const parentStack: TocItemData[] = [];

  items.forEach(item => {
    const node: TocItemData = { ...item, children: [] };
    
    while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= node.level) {
      parentStack.pop();
    }

    if (parentStack.length === 0) {
      tocTree.push(node);
    } else {
      parentStack[parentStack.length - 1].children.push(node);
    }

    parentStack.push(node);
  });

  return tocTree;
}

function TocItem({ item }: { item: TocItemData }) {
  const [isOpen, setIsOpen] = useState(item.level <= 1);
  const hasChildren = item.children.length > 0;

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <li style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}>
      <a
        href={`#${item.slug}`}
        className="flex items-center text-green-400/70 hover:text-green-300 transition-colors text-sm p-1 rounded-md hover:bg-green-400/10 group"
      >
        {hasChildren ? (
          <button onClick={toggleOpen} className="mr-1 p-0.5 rounded-sm hover:bg-green-400/20">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <Hash size={14} className="mr-2 text-green-400/50" />
        )}
        <span className="flex-1 group-hover:translate-x-1 transition-transform duration-200">{item.text}</span>
      </a>
      {hasChildren && isOpen && (
        <ul className="mt-1 space-y-1">
          {item.children.map(child => <TocItem key={child.slug} item={child} />)}
        </ul>
      )}
    </li>
  );
}

export function NoteViewerClient({ note }: NoteViewerClientProps) {
  const router = useRouter()
  const [readingProgress, setReadingProgress] = useState(0)
  const [isScrollTopVisible, setScrollTopVisible] = useState(false);

  const tocTree = buildTocTree(note.toc);

  // Calculate metadata on the client to avoid hydration issues
  const wordCount = note.content.split(/\s+/).filter(Boolean).length
  const readTime = Math.ceil(wordCount / 200) // 200 words per minute

  // Track reading progress and scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      // Reading progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.pageYOffset / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setReadingProgress(100);
      }

      // Scroll-to-top button visibility
      if (window.pageYOffset > 300) {
        setScrollTopVisible(true);
      } else {
        setScrollTopVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    router.back()
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-black/50">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-150 ease-linear"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-green-400 hover:text-green-300 hover:bg-green-400/10 mb-4 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            <article className="bg-black/80 border border-green-400/30 rounded-lg overflow-hidden backdrop-blur-sm">
              {/* Header */}
              <header className="p-6 md:p-8 border-b border-green-400/30">
                <h1 className="text-green-300 text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {note.title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-green-300/80 mb-4">
                  {note.author && (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{note.author}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(note.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{readTime} min read</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{wordCount} words</span>
                  </div>
                </div>

                {/* Category and Tags */}
                <div className="flex flex-wrap items-center gap-3">
                  {note.category && note.category !== 'Uncategorized' && (
                    <Badge className="bg-green-400/20 text-green-300 border-green-400/40 hover:bg-green-400/30 transition-colors">
                      {note.category}
                    </Badge>
                  )}
                  {note.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-cyan-400/10 text-cyan-300 border-cyan-400/30 hover:bg-cyan-400/20 transition-colors cursor-pointer"
                    >
                      <Tag className="w-3 h-3 mr-1.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </header>

              {/* Content */}
              <div className="p-6 md:p-8">
                <MarkdownRenderer content={note.content} />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="xl:col-span-1 space-y-6">
            {note.toc && note.toc.length > 0 && (
              <div className="sticky top-24">
                <div className="bg-black/80 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-bold text-green-300 mb-4 flex items-center"><ListTree size={18} className="mr-2" />Table of Contents</h3>
                  <ul className="space-y-1">
                    {tocTree.map((item) => (
                      <TocItem key={item.slug} item={item} />
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {isScrollTopVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-500/80 hover:bg-green-500 text-black p-3 rounded-full shadow-lg transition-opacity duration-300 z-50 animate-bounce"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </>
  )
}

