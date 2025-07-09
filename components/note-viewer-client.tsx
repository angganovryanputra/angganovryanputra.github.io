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

// Helper component for the TOC itself, to avoid repetition
function TocContent({ tocTree }: { tocTree: TocItemData[] }) {
  return (
    <ul className="space-y-1">
      {tocTree.map((item) => (
        <TocItem key={item.slug} item={item} />
      ))}
    </ul>
  );
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
        <span className="flex-1 truncate group-hover:text-shadow-green">{item.text}</span>
      </a>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen && hasChildren ? 'max-h-screen' : 'max-h-0'}`}>
        <ul className="space-y-1 mt-1">
          {item.children.map((child) => (
            <TocItem key={child.slug} item={child} />
          ))}
        </ul>
      </div>
    </li>
  );
}

export function NoteViewerClient({ note }: NoteViewerClientProps) {
  const router = useRouter()
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const tocTree = note.toc ? buildTocTree(note.toc) : [];

  useEffect(() => {
    const handleScroll = () => {
      // Scroll-to-top button visibility
      if (window.pageYOffset > 300) {
        setIsScrollTopVisible(true);
      } else {
        setIsScrollTopVisible(false);
      }

      // Reading progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.pageYOffset / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setReadingProgress(100);
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

  // Calculate metadata on the client to avoid hydration issues
  const wordCount = note.content.split(/\s+/).filter(Boolean).length
  const readTime = Math.ceil(wordCount / 200) // 200 words per minute

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-black/20">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-150 ease-linear"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 xl:gap-12">
          {/* Main Content Area */}
          <div className="xl:col-span-3 w-full max-w-full overflow-x-hidden">
            {/* Mobile-only Collapsible TOC */}
            {tocTree.length > 0 && (
              <div className="xl:hidden mb-8 bg-black/80 border border-green-400/30 rounded-lg backdrop-blur-sm">
                <button
                  onClick={() => setIsTocOpen(!isTocOpen)}
                  className="w-full flex justify-between items-center p-4 font-bold text-green-300"
                >
                  <span className="flex items-center"><ListTree size={18} className="mr-2" />Table of Contents</span>
                  {isTocOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isTocOpen ? 'max-h-screen' : 'max-h-0'}`}>
                  <div className="p-4 border-t border-green-400/30">
                    <TocContent tocTree={tocTree} />
                  </div>
                </div>
              </div>
            )}

            <article className="bg-black/90 border border-green-400/50 rounded-lg overflow-hidden">
              {/* Header with metadata */}
              <header className="border-b border-green-400/30 p-6 md:p-8 space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-green-300 leading-tight">{note.title}</h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-green-300/80">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {note.date}</span>
                  {note.author && (
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{note.author}</span>
                    </span>
                  )}
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{readTime} min read</span>
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{wordCount} words</span>
                  </span>
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

          {/* Sidebar (Desktop-only) */}
          <aside className="hidden xl:block xl:col-span-1 space-y-6">
            {tocTree.length > 0 && (
              <div className="sticky top-24">
                <div className="bg-black/80 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
                  <h2 className="font-bold text-green-300 mb-4 flex items-center"><ListTree size={18} className="mr-2" />Table of Contents</h2>
                  <TocContent tocTree={tocTree} />
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
