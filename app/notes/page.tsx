import { getAllNotes } from '@/lib/notes';
import { NotesClient } from '@/components/notes-client';


// This is now a Server Component, running only at build time.
export default function NotesPage() {
  // 1. Fetch data on the server at build time.
  const allNotes = getAllNotes();

  // 2. Pass the data to the Client Component to render.
  return <NotesClient initialNotes={allNotes} />;
}
