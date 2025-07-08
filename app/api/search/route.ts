import { NextResponse } from 'next/server';
import { performAdvancedSearch } from '@/lib/advanced-search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (typeof query !== 'string') {
    return NextResponse.json({ error: 'Query parameter must be a string' }, { status: 400 });
  }

  const sanitizedQuery = query.trim();

  if (sanitizedQuery.length === 0 || sanitizedQuery.length > 100) {
    return NextResponse.json({ error: 'Invalid query length. Must be between 1 and 100 characters.' }, { status: 400 });
  }

  try {
    const results = await performAdvancedSearch(sanitizedQuery);
    return NextResponse.json(results);
  } catch (error) {
    console.error('[API/SEARCH] Error:', error);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}
