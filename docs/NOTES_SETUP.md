# Notes Setup Guide

This guide explains how to set up and manage the local notes system for your cybersecurity portfolio.

## Directory Structure

\`\`\`
notes/
├── cybersecurity-fundamentals.md
├── penetration-testing/
│   └── methodology.md
├── incident-response/
│   └── playbook.md
└── network-security/
    ├── basics.md
    └── advanced-topics.md
\`\`\`

## Markdown File Format

Each note should be a markdown file with YAML frontmatter:

\`\`\`markdown
---
title: "Your Note Title"
author: "Your Name"
date: "2024-01-15"
category: "Category Name"
tags: ["tag1", "tag2", "tag3"]
description: "Optional description"
---

# Your Note Title

Your note content goes here...

## Section 1

Content for section 1...

## Section 2

Content for section 2...
\`\`\`

## Required Frontmatter Fields

- `title`: The title of your note (required)
- `category`: Category for organization (recommended)
- `tags`: Array of tags for filtering (recommended)

## Optional Frontmatter Fields

- `author`: Author name
- `date`: Creation or update date
- `description`: Brief description
- `published`: Boolean to control visibility
- `featured`: Boolean to mark as featured

## Supported Categories

The system automatically organizes notes by category. Common categories include:

- Penetration Testing
- Network Security
- Web Application Security
- Malware Analysis
- Incident Response
- Compliance
- Risk Assessment
- Cryptography
- Cloud Security
- DevSecOps

## Manual Update Process

1. **Create/Edit Notes**: Add or modify markdown files in the `notes/` directory
2. **Commit Changes**: Use git to commit your changes
   \`\`\`bash
   git add notes/
   git commit -m "Add new cybersecurity notes"
   \`\`\`
3. **Push to GitHub**: Push changes to trigger deployment
   \`\`\`bash
   git push origin main
   \`\`\`
4. **Automatic Deployment**: GitHub Actions will automatically rebuild and deploy
5. **Live Updates**: Changes will be live within 2-3 minutes

## Best Practices

### File Naming
- Use kebab-case for file names: `penetration-testing-basics.md`
- Keep names descriptive but concise
- Use subdirectories for organization

### Content Structure
- Start with a clear title and introduction
- Use proper heading hierarchy (H1, H2, H3)
- Include code blocks with syntax highlighting
- Add relevant tags for discoverability

### Organization
- Group related notes in subdirectories
- Use consistent category names
- Tag notes with relevant keywords
- Keep frontmatter consistent

## Search and Filtering

The notes system includes:

- **Full-text search**: Searches title, content, tags, and categories
- **Category filtering**: Filter by specific categories
- **Tag filtering**: Filter by specific tags
- **Multiple view modes**: Grid, List, Folder, and Timeline views

## Export Functionality

- Click the download button to export all notes as JSON
- Includes note content, metadata, and statistics
- Useful for backup or migration purposes

## Troubleshooting

### Notes Not Appearing
1. Check that files have `.md` extension
2. Verify frontmatter syntax is correct
3. Ensure files are in the `notes/` directory
4. Check that the deployment completed successfully

### Search Not Working
1. Refresh the page to reload notes
2. Check that search terms are at least 2 characters
3. Try different search terms or clear filters

### Categories/Tags Missing
1. Verify frontmatter includes `category` and `tags` fields
2. Check YAML syntax is correct
3. Refresh the page to reload metadata

## Performance Considerations

- Notes are cached for 5 minutes to improve performance
- Large notes (>10MB) may affect loading times
- Consider splitting very long notes into multiple files
- Images should be optimized and placed in `public/images/`

## Security

- All markdown content is sanitized for security
- File paths are validated to prevent directory traversal
- No external scripts or iframes are allowed in notes
- Search queries are sanitized to prevent injection attacks
