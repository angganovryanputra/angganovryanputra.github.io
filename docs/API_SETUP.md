# 🔌 External API Setup Guide

This guide explains how to configure the `NEXT_PUBLIC_ENDPOINT` environment variable for external data integration.

## Overview

The cybersecurity portfolio can integrate with external APIs to fetch additional notes, categories, and tags. This enhances the local markdown-based notes system with dynamic content.

## Required API Format

Your external API should return data in the following format:

### Health Check Endpoint
\`\`\`
GET /health
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

### Notes Endpoint
\`\`\`
GET /notes?format=json&include=metadata
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "note-1",
        "title": "Advanced Penetration Testing Techniques",
        "content": "Full markdown content...",
        "excerpt": "Brief description...",
        "category": "Penetration Testing",
        "tags": ["pentest", "security", "methodology"],
        "author": "Security Expert",
        "publishedAt": "2024-01-15T10:30:00Z",
        "lastModified": "2024-01-15T10:30:00Z",
        "readingTime": 5,
        "featured": true
      }
    ],
    "categories": [
      "Penetration Testing",
      "Network Security",
      "Web Application Security",
      "Malware Analysis"
    ],
    "tags": [
      "pentest",
      "vulnerability-assessment",
      "network-security",
      "web-security"
    ],
    "total": 1,
    "page": 1,
    "limit": 50
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

### Status Endpoint
\`\`\`
GET /status
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "uptime": 86400,
    "endpoints": ["/health", "/notes", "/status"],
    "rateLimit": {
      "requests": 1000,
      "window": 3600
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

### Search Endpoint
\`\`\`
POST /search
\`\`\`

**Request Body:**
\`\`\`json
{
  "query": "search term"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "note-1",
        "title": "Advanced Penetration Testing Techniques",
        "content": "Full markdown content...",
        "excerpt": "Brief description...",
        "category": "Penetration Testing",
        "tags": ["pentest", "security", "methodology"],
        "author": "Security Expert",
        "publishedAt": "2024-01-15T10:30:00Z",
        "lastModified": "2024-01-15T10:30:00Z",
        "readingTime": 5,
        "featured": true
      }
    ],
    "total": 1
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

## Setup Options

### Option 1: Mock API for Development

For testing and development, you can use a simple mock API:

\`\`\`javascript
// Create a simple Express.js server
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const mockNotes = [
  {
    id: "mock-1",
    title: "Sample Security Note",
    content: "# Sample Security Note\n\nThis is a sample note from the external API.",
    excerpt: "This is a sample note from the external API.",
    category: "Security",
    tags: ["sample", "api", "security"],
    author: "API User",
    publishedAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    readingTime: 2,
    featured: false
  }
];

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

app.get('/notes', (req, res) => {
  res.json({
    success: true,
    data: {
      items: mockNotes,
      categories: ["Security", "Networking"],
      tags: ["sample", "api", "security", "networking"],
      total: mockNotes.length,
      page: 1,
      limit: 50
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      version: "1.0.0",
      uptime: process.uptime(),
      endpoints: ["/health", "/notes", "/status"]
    },
    timestamp: new Date().toISOString()
  });
});

app.post('/search', (req, res) => {
  const { query } = req.body;
  const filteredNotes = mockNotes.filter(note => note.title.includes(query));
  res.json({
    success: true,
    data: {
      items: filteredNotes,
      total: filteredNotes.length
    },
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Mock API running on port ${PORT}`);
});
\`\`\`

Deploy this to Vercel, Netlify, or Heroku and use the URL as your `NEXT_PUBLIC_ENDPOINT`.

### Option 2: Headless CMS Integration

#### Strapi Setup

1. **Create a Strapi project:**
\`\`\`bash
npx create-strapi-app@latest my-cybersec-api --quickstart
\`\`\`

2. **Create a Note content type with fields:**
   - title (Text)
   - content (Rich Text)
   - excerpt (Text)
   - category (Text)
   - tags (JSON)
   - author (Text)
   - featured (Boolean)

3. **Configure API endpoints:**
\`\`\`javascript
// config/api.js
module.exports = {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
  },
};
\`\`\`

4. **Set permissions for public access to Notes**

5. **Use Strapi API URL:**
\`\`\`env
NEXT_PUBLIC_ENDPOINT=https://your-strapi-app.herokuapp.com/api
\`\`\`

#### Contentful Setup

1. **Create a Contentful space**
2. **Create a "Note" content model with fields:**
   - Title (Short text)
   - Content (Long text)
   - Excerpt (Short text)
   - Category (Short text)
   - Tags (Short text, list)
   - Author (Short text)
   - Featured (Boolean)

3. **Get your Space ID and Access Token**
4. **Create an API wrapper:**

\`\`\`javascript
// Create a Netlify/Vercel function
const contentful = require('contentful');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

exports.handler = async (event, context) => {
  const { path } = event;
  
  if (path === '/health') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "API is healthy",
        timestamp: new Date().toISOString()
      })
    };
  }
  
  if (path === '/notes') {
    try {
      const entries = await client.getEntries({
        content_type: 'note',
        limit: 50
      });
      
      const notes = entries.items.map(item => ({
        id: item.sys.id,
        title: item.fields.title,
        content: item.fields.content,
        excerpt: item.fields.excerpt,
        category: item.fields.category,
        tags: item.fields.tags || [],
        author: item.fields.author,
        publishedAt: item.sys.createdAt,
        lastModified: item.sys.updatedAt,
        readingTime: Math.ceil(item.fields.content.length / 1000),
        featured: item.fields.featured || false
      }));
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: {
            items: notes,
            categories: [...new Set(notes.map(n => n.category))],
            tags: [...new Set(notes.flatMap(n => n.tags))],
            total: notes.length
          },
          timestamp: new Date().toISOString()
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: error.message
        })
      };
    }
  }
  
  if (path === '/search') {
    const { query } = JSON.parse(event.body);
    const entries = await client.getEntries({
      content_type: 'note',
      fields: {
        title: {
          'contains': query
        }
      }
    });
    
    const notes = entries.items.map(item => ({
      id: item.sys.id,
      title: item.fields.title,
      content: item.fields.content,
      excerpt: item.fields.excerpt,
      category: item.fields.category,
      tags: item.fields.tags || [],
      author: item.fields.author,
      publishedAt: item.sys.createdAt,
      lastModified: item.sys.updatedAt,
      readingTime: Math.ceil(item.fields.content.length / 1000),
      featured: item.fields.featured || false
    }));
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          items: notes,
          total: notes.length
        },
        timestamp: new Date().toISOString()
      })
    };
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({
      success: false,
      message: "Endpoint not found"
    })
  };
};
\`\`\`

### Option 3: Custom Database API

Create a custom API with your preferred database:

\`\`\`javascript
// Example with MongoDB and Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Note schema
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  excerpt: String,
  category: String,
  tags: [String],
  author: String,
  featured: Boolean,
  publishedAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ lastModified: -1 });
    const categories = [...new Set(notes.map(n => n.category))];
    const tags = [...new Set(notes.flatMap(n => n.tags))];
    
    res.json({
      success: true,
      data: {
        items: notes.map(note => ({
          ...note.toObject(),
          readingTime: Math.ceil(note.content.length / 1000)
        })),
        categories,
        tags,
        total: notes.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/search', async (req, res) => {
  const { query } = req.body;
  try {
    const notes = await Note.find({ title: { $regex: query, $options: 'i' } });
    res.json({
      success: true,
      data: {
        items: notes.map(note => ({
          ...note.toObject(),
          readingTime: Math.ceil(note.content.length / 1000)
        })),
        total: notes.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(process.env.PORT || 3000);
\`\`\`

## Environment Configuration

### Development Setup

1. Create a `.env.local` file in your project root:
\`\`\`bash
NEXT_PUBLIC_ENDPOINT=https://your-api-endpoint.com
\`\`\`

2. For testing purposes, you can use a mock API:
\`\`\`bash
NEXT_PUBLIC_ENDPOINT=https://jsonplaceholder.typicode.com
\`\`\`

### Production Setup (GitHub Pages)

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add a new repository secret:
   - Name: `NEXT_PUBLIC_ENDPOINT`
   - Value: `https://your-production-api.com`

## API Requirements

Your external API should follow this response format:

\`\`\`json
{
  "data": {
    // Your actual data here
  },
  "success": true,
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`

## Supported Endpoints

The application expects these endpoints to be available:

- `GET /health` - Health check endpoint
- `GET /status` - API status and information
- `GET /notes` - Retrieve notes data
- `POST /search` - Search functionality

## Mock API Example

For development, you can create a simple mock API using JSON Server:

1. Install JSON Server:
\`\`\`bash
npm install -g json-server
\`\`\`

2. Create a `db.json` file:
\`\`\`json
{
  "notes": [
    {
      "id": "1",
      "title": "Sample Note",
      "content": "This is a sample note",
      "category": "General"
    }
  ],
  "health": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

3. Start the mock server:
\`\`\`bash
json-server --watch db.json --port 3001
\`\`\`

4. Set your environment variable:
\`\`\`bash
NEXT_PUBLIC_ENDPOINT=http://localhost:3001
\`\`\`

## Error Handling

The application includes built-in error handling for:
- Network timeouts (10 seconds)
- Invalid responses
- Rate limiting
- CORS issues

## Security Considerations

- Always use HTTPS in production
- Implement proper authentication if needed
- Consider rate limiting on your API
- Validate all incoming data

## Testing the Integration

1. Check if the API is configured:
\`\`\`javascript
console.log(process.env.NEXT_PUBLIC_ENDPOINT)
\`\`\`

2. Test the connection in your browser's developer console:
\`\`\`javascript
fetch(process.env.NEXT_PUBLIC_ENDPOINT + '/health')
  .then(response => response.json())
  .then(data => console.log(data))
\`\`\`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your API allows requests from your domain
2. **404 Errors**: Verify the endpoint URL is correct
3. **Timeout Errors**: Check if your API is responding within 10 seconds
4. **Invalid JSON**: Ensure your API returns valid JSON responses

### Debug Mode

Enable debug mode by setting:
\`\`\`bash
NODE_ENV=development
\`\`\`

This will show detailed error messages in the console.
