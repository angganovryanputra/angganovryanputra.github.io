import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';

import { MAX_RELATED_NOTES } from './constants';

const notesDirectory = path.join(process.cwd(), 'notes');

interface BaseNote {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  [key: string]: any;
}

export interface NoteData extends BaseNote {
  contentHtml: string;
  content: string;
  toc: { level: number; text: string; slug: string }[];
  relatedNotes?: NoteSummary[];
}

export type NoteSummary = BaseNote;

// Custom Rehype plugin to extract Table of Contents after slugs are added
function extractToc() {
  return (tree: any, file: any) => {
    const toc: { level: number; text: string; slug: string }[] = [];
    visit(tree, 'element', (node: any) => {
      if (node.tagName && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        const level = parseInt(node.tagName.charAt(1), 10);
        const id = node.properties && node.properties.id;
        let text = '';
        // Extract text content from heading node
        visit(node, 'text', (textNode: any) => {
          text += textNode.value;
        });
        if (id && text) {
          toc.push({ level, text, slug: id });
        }
      }
    });
    file.data.toc = toc;
  };
}

// This function will recursively get all notes from all subdirectories
function getAllNotesRecursively(dir: string, relativePath: string = ""): NoteSummary[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let notes: NoteSummary[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const newRelativePath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      notes = notes.concat(getAllNotesRecursively(fullPath, newRelativePath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      const id = newRelativePath.replace(/\\/g, '/').replace(/\.md$/, '');
      const category = path.dirname(id) === '.' ? 'Uncategorized' : path.dirname(id);

      notes.push({
        id,
        slug: id,
        title: matterResult.data.title || 'Untitled Note',
        date: matterResult.data.date || fs.statSync(fullPath).mtime.toISOString(),
        category: matterResult.data.category || category,
        tags: matterResult.data.tags || [],
        ...matterResult.data,
      });
    }
  }
  return notes;
}

export const getNotesMetadata = () => {
  const notes = getAllNotesRecursively(notesDirectory)
  return notes.map((note) => ({
    ...note,
    slugSegments: note.slug.split("/"),
  }))
}

const parseDate = (value: string | undefined) => {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) {
    return new Date(0)
  }
  return date
}

export const getRelatedNotes = (
  slug: string,
  tags: string[] = [],
  category = "",
  limit = MAX_RELATED_NOTES,
) => {
  const normalizedSlug = Array.isArray(slug) ? slug.join('/') : slug
  const allNotes = getAllNotesRecursively(notesDirectory)
  const candidates = allNotes.filter((note) => note.slug !== normalizedSlug)

  const tagSet = new Set(tags.map((tag: string) => tag.toLowerCase()))
  const scored = candidates.map((note) => {
    const sharedTags = note.tags
      ?.map((tag: string) => tag.toLowerCase())
      .filter((tag: string) => tagSet.has(tag)) ?? []
    const tagScore = sharedTags.length * 3
    const categoryScore = category && note.category === category ? 2 : 0
    const recencyScore = Math.max(0, 1 - Math.min(1, (Date.now() - parseDate(note.date).getTime()) / (1000 * 60 * 60 * 24 * 365)))
    const score = tagScore + categoryScore + recencyScore

    return {
      note,
      score,
      sharedTagsCount: sharedTags.length,
    }
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (b.sharedTagsCount !== a.sharedTagsCount) return b.sharedTagsCount - a.sharedTagsCount
    return parseDate(b.note.date).getTime() - parseDate(a.note.date).getTime()
  })

  return scored.slice(0, limit).map(({ note }) => note)
}

export function getAllNotes(): NoteSummary[] {
  const allNotes = getAllNotesRecursively(notesDirectory);
  // Sort notes by date
  return allNotes.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllNoteSlugs() {
  const notes = getAllNotesRecursively(notesDirectory);
  return notes.map((note) => ({
    slug: note.slug.split('/'), // Split slug into an array for catch-all routes
  }));
}

export async function getNoteData(slug: string | string[]): Promise<NoteData> {
  const slugPath = Array.isArray(slug) ? path.join(...slug) : slug;
  const fullPath = path.join(notesDirectory, `${slugPath}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Note not found: ${slugPath}`);
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // The single, correct pipeline for processing markdown
  const file = await unified()
    .use(remarkParse) // 1. Parse markdown to a syntax tree
    .use(remarkGfm) // 2. Use GitHub Flavored Markdown for tables, etc.
    .use(remarkRehype, { allowDangerousHtml: true }) // 3. Convert to HTML syntax tree
    .use(rehypeSlug) // 4. Add 'id' attributes to headings
    .use(rehypeAutolinkHeadings, { behavior: 'append' }) // 5. Add links to headings
    .use(extractToc) // 6. Extract TOC from the tree with IDs
    .use(rehypeStringify, { allowDangerousHtml: true }) // 7. Convert tree to HTML string
    .process(matterResult.content);

  const toc = (file.data.toc || []) as { level: number; text: string; slug: string }[];
  const contentHtml = ''; // No longer needed, renderer handles it.
  const category = path.dirname(slugPath) === '.' ? 'Uncategorized' : path.dirname(slugPath);
  const noteTags = Array.isArray(matterResult.data.tags) ? matterResult.data.tags : []
  const relatedNotes = getRelatedNotes(slugPath, noteTags, category)

  return {
    id: slugPath,
    slug: slugPath,
    contentHtml,
    toc,
    content: matterResult.content,
    title: matterResult.data.title || 'Untitled Note',
    date: matterResult.data.date || fs.statSync(fullPath).mtime.toISOString(),
    category: matterResult.data.category || category,
    tags: noteTags,
    relatedNotes,
    ...matterResult.data,
  };
}
