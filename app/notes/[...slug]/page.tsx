import { getNoteData, getAllNoteSlugs } from '@/lib/notes';
import { notFound } from 'next/navigation';
import { MatrixRain } from '@/components/matrix-rain';
import { Navigation } from '@/components/navigation';
import { NoteViewerClient } from '@/components/note-viewer-client';

// This function tells Next.js which pages to build at build time
export async function generateStaticParams() {
  const notes = getAllNoteSlugs();
  return notes.map((note) => ({ slug: note.slug }));
}

// This function generates metadata for the page
export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  try {
    const note = await getNoteData(params.slug);
    return {
      title: note.title,
      description: `A note on ${note.title}`,
    };
  } catch (error) {
    return {
      title: 'Note Not Found',
      description: 'The requested note could not be found.',
    };
  }
}

export default async function NotePage({ params }: { params: { slug: string[] } }) {
  const note = await getNoteData(params.slug).catch(() => {
    notFound();
  });

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10">
        <Navigation />
        <NoteViewerClient note={note} />
      </div>
    </div>
  );
}
