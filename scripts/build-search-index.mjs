import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import https from 'https';

const notesDirectory = path.join(process.cwd(), 'notes');
const outputDirectory = path.join(process.cwd(), 'public');
const outputFile = path.join(outputDirectory, 'search-index.json');

// Helper to fetch Medium posts
function fetchMediumPosts(username) {
  return new Promise((resolve, reject) => {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'ok') {
            console.log(`Successfully fetched ${json.items.length} Medium posts.`);
            resolve(json.items);
          } else {
            console.error('Failed to fetch Medium posts:', json.message);
            resolve([]); // Resolve with empty array on API error
          }
        } catch (e) {
          console.error('Error parsing Medium RSS JSON:', e);
          resolve([]); // Resolve with empty array on parsing error
        }
      });
    }).on('error', (err) => {
      console.error('Error fetching Medium RSS feed:', err.message);
      resolve([]); // Resolve with empty array on network error
    });
  });
}

function getAllNotesRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let notes = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      notes = notes.concat(getAllNotesRecursively(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const slug = path.relative(notesDirectory, fullPath).replace(/\.md$/, '');
      notes.push({
        id: slug,
        slug: slug,
        title: data.title || slug,
        content: content,
        tags: data.tags || [],
        category: data.category || 'General',
        type: 'notes',
        url: `/notes/${slug}`,
      });
    }
  }
  return notes;
}

async function buildSearchIndex() {
  console.log('Starting search index build...');

  // 1. Get all local notes
  const localNotes = getAllNotesRecursively(notesDirectory);
  console.log(`Found ${localNotes.length} local notes.`);

  // 2. Fetch all Medium posts
  const mediumPosts = await fetchMediumPosts('angganvryn');
  const formattedMediumPosts = mediumPosts.map(post => ({
    id: post.guid,
    slug: post.guid,
    title: post.title,
    content: post.description, // Use description as content for search
    tags: post.categories || [],
    category: 'Medium Article',
    type: 'medium',
    url: post.link,
  }));

  // 3. Combine and create index
  const searchIndex = [...localNotes, ...formattedMediumPosts];

  // 4. Write to file
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }
  fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));
  console.log(`Search index successfully built with ${searchIndex.length} items at: ${outputFile}`);
}

buildSearchIndex();
