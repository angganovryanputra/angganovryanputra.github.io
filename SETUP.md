# 🛠️ Cybersecurity Portfolio Setup Guide

Complete setup guide for the Cybersecurity Portfolio with Medium integration, Obsidian notes, advanced search, and GitHub Pages deployment.

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: VS Code recommended
- **GitHub Account**: For deployment

### Verify Installation
\`\`\`bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 8.0.0 or higher
git --version   # Should show latest version
\`\`\`

## 🚀 Quick Start

### 1. Repository Setup
\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/yourusername.github.io.git

# Navigate to project directory
cd yourusername.github.io

# Install dependencies
npm install
\`\`\`

### 2. Environment Configuration
Create `.env.local` file in the root directory:

\`\`\`env
# Medium RSS Integration
MEDIUM_USERNAME=yourusername
NEXT_PUBLIC_MEDIUM_USERNAME=yourusername

# RSS2JSON API Configuration (Free Tier)
RSS2JSON_API_KEY=your_api_key_here
NEXT_PUBLIC_RSS2JSON_API_KEY=your_api_key_here
RSS2JSON_URL=https://api.rss2json.com/v1/api.json
NEXT_PUBLIC_RSS2JSON_URL=https://api.rss2json.com/v1/api.json
\`\`\`

### 3. Notes Directory Setup
\`\`\`bash
# Create notes directory structure
mkdir -p notes/penetration-testing
mkdir -p notes/incident-response/playbooks
mkdir -p notes/malware-analysis
mkdir -p notes/threat-hunting

# The system will automatically create sample notes on first run
\`\`\`

### 4. Development Server
\`\`\`bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
\`\`\`

## 📚 Content Management

### Personal Information
Update your details in `lib/static-data.ts`:

\`\`\`typescript
export const personalInfo = {
  name: "Your Name",
  title: "Cybersecurity Professional",
  email: "your.email@example.com",
  location: "Your Location",
  bio: "Your professional bio...",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    medium: "https://medium.com/@yourusername"
  }
}
\`\`\`

### Experience and Skills
\`\`\`typescript
export const experiences = [
  {
    title: "Senior Security Analyst",
    company: "Company Name",
    period: "2022 - Present",
    description: "Your role description...",
    technologies: ["SIEM", "EDR", "Threat Hunting", "Incident Response"],
    achievements: [
      "Reduced incident response time by 40%",
      "Implemented advanced threat detection rules"
    ]
  }
]

export const skills = {
  "Security Tools": [
    { name: "Splunk", level: "Expert" },
    { name: "Burp Suite", level: "Advanced" },
    { name: "Nmap", level: "Expert" }
  ],
  "Programming": [
    { name: "Python", level: "Advanced" },
    { name: "PowerShell", level: "Intermediate" }
  ]
}
\`\`\`

### Certifications
Add your certifications with images:

\`\`\`typescript
export const certifications = [
  {
    name: "CISSP",
    issuer: "ISC2",
    date: "2023",
    image: "/images/cert-cissp.png",
    credentialId: "123456"
  }
]
\`\`\`

## 📝 Obsidian Notes Integration

### Directory Structure
\`\`\`
notes/
├── cybersecurity.md                    # Fundamentals
├── penetration-testing/
│   ├── methodology.md                  # Testing methodology
│   ├── tools.md                       # Tool documentation
│   └── reports/
│       └── template.md                # Report templates
├── incident-response/
│   ├── playbooks/
│   │   ├── malware-incident.md        # Malware response
│   │   ├── data-breach.md             # Breach response
│   │   └── ddos-attack.md             # DDoS response
│   └── procedures/
│       └── evidence-collection.md     # Forensics procedures
├── threat-hunting/
│   ├── techniques.md                  # Hunting techniques
│   └── queries/
│       ├── splunk-queries.md          # Splunk searches
│       └── kql-queries.md             # KQL queries
└── malware-analysis/
    ├── static-analysis.md             # Static analysis
    ├── dynamic-analysis.md            # Dynamic analysis
    └── tools.md                       # Analysis tools
\`\`\`

### Note Format with Enhanced Frontmatter
\`\`\`markdown
---
title: "Advanced Threat Hunting Techniques"
author: "Your Name"
date: "2024-01-15"
category: "Threat Hunting"
tags: ["threat-hunting", "siem", "detection", "analytics"]
difficulty: "Advanced"
estimated_time: "30 minutes"
prerequisites: ["Basic SIEM knowledge", "Log analysis experience"]
tools: ["Splunk", "Elastic", "Sigma"]
mitre_tactics: ["TA0007", "TA0008"]
---

# Advanced Threat Hunting Techniques

## Table of Contents

1. [Introduction](#introduction)
2. [Hypothesis Development](#hypothesis-development)
3. [Data Collection](#data-collection)
4. [Analysis Techniques](#analysis-techniques)
5. [Detection Engineering](#detection-engineering)

## Introduction

Threat hunting is a proactive approach to identifying threats...

### Key Concepts

- **Hypothesis-driven hunting**: Starting with assumptions about attacker behavior
- **Data-driven hunting**: Using analytics to identify anomalies
- **Intelligence-driven hunting**: Leveraging threat intelligence

## Hypothesis Development

### MITRE ATT&CK Mapping

\`\`\`
Tactic: Lateral Movement (TA0008)
Technique: Remote Services (T1021)
Sub-technique: SMB/Windows Admin Shares (T1021.002)
\`\`\`

### Hunt Hypothesis
"Adversaries may use valid accounts to interact with a remote network share using Server Message Block (SMB)."

## Data Collection

### Required Data Sources
- Windows Security Event Logs (4624, 4625, 4648)
- Network traffic logs
- Process execution logs
- File access logs

### Splunk Query Example
\`\`\`spl
index=windows EventCode=4624 LogonType=3 
| eval src_category=case(
    cidrmatch("10.0.0.0/8", src_ip), "internal",
    cidrmatch("172.16.0.0/12", src_ip), "internal", 
    cidrmatch("192.168.0.0/16", src_ip), "internal",
    1=1, "external"
)
| where src_category="external"
| stats count by Account_Name, src_ip, dest_host
| where count > 5
\`\`\`

## Analysis Techniques

### Statistical Analysis
- Frequency analysis
- Time series analysis
- Behavioral baselines
- Anomaly detection

### Visualization
- Timeline analysis
- Network graphs
- Heat maps
- Correlation matrices

## Detection Engineering

### Sigma Rule Development
\`\`\`yaml
title: Suspicious SMB Logon from External IP
id: 12345678-1234-1234-1234-123456789012
status: experimental
description: Detects SMB logons from external IP addresses
author: Your Name
date: 2024/01/15
references:
    - https://attack.mitre.org/techniques/T1021/002/
tags:
    - attack.lateral_movement
    - attack.t1021.002
logsource:
    category: authentication
    product: windows
detection:
    selection:
        EventID: 4624
        LogonType: 3
    filter:
        IpAddress|startswith:
            - '10.'
            - '172.16.'
            - '192.168.'
    condition: selection and not filter
falsepositives:
    - Legitimate remote administration
    - VPN connections
level: medium
\`\`\`

## Best Practices

1. **Document Everything**: Keep detailed hunt logs
2. **Validate Findings**: Confirm true positives
3. **Share Intelligence**: Contribute to team knowledge
4. **Continuous Improvement**: Refine techniques based on results
5. **Automation**: Develop repeatable processes

## Tools and Resources

### Commercial Tools
- Splunk Enterprise Security
- IBM QRadar
- Microsoft Sentinel
- CrowdStrike Falcon

### Open Source Tools
- Elastic Security
- HELK (Hunting ELK)
- Sigma
- YARA

### Threat Intelligence
- MITRE ATT&CK
- Cyber Kill Chain
- Diamond Model
- Threat intelligence feeds

---

*This document provides advanced threat hunting techniques. Adapt the methods to your specific environment and use cases.*
\`\`\`

### Supported Frontmatter Fields
- **title**: Note title (required)
- **author**: Author name
- **date**: Creation/publication date
- **category**: Primary category for organization
- **tags**: Array of tags for filtering and search
- **difficulty**: Beginner, Intermediate, Advanced
- **estimated_time**: Reading/completion time
- **prerequisites**: Required knowledge or skills
- **tools**: Required tools or software
- **mitre_tactics**: MITRE ATT&CK tactic IDs
- **mitre_techniques**: MITRE ATT&CK technique IDs

## 🔧 Advanced Configuration

### Medium Integration

#### 1. Get RSS2JSON API Key
\`\`\`bash
# Visit https://rss2json.com/
# Sign up for free account (10,000 requests/day)
# Get your API key
# Update .env.local with your key
\`\`\`

#### 2. Test Medium Integration
\`\`\`bash
# Test RSS feed access
curl "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@yourusername&api_key=YOUR_API_KEY"

# Should return JSON with your articles
\`\`\`

### Search Configuration

#### 1. Customize Cybersecurity Keywords
Edit `lib/enhanced-medium-search.ts`:

\`\`\`typescript
// Add custom security tools
{ term: "custom-tool", category: "tool", weight: 0.9, synonyms: ["tool-alias"] },

// Add specific techniques
{ term: "custom-technique", category: "technique", weight: 0.8, synonyms: ["alt-name"] },
\`\`\`

#### 2. Search Performance Tuning
\`\`\`typescript
// Adjust cache timeout (default: 5 minutes)
private cacheTimeout = 10 * 60 * 1000 // 10 minutes

// Adjust result limits
.slice(0, 20) // Return top 20 results
\`\`\`

### Security Configuration

#### 1. Content Security Policy
The application includes comprehensive CSP headers:

\`\`\`typescript
// Customize allowed sources in lib/security-utils.ts
"connect-src 'self' https://api.rss2json.com https://medium.com",
"img-src 'self' data: https: blob:",
\`\`\`

#### 2. Rate Limiting
\`\`\`typescript
// Adjust search rate limits
static checkSearchRateLimit(identifier: string, maxAttempts = 50, windowMs = 60000)
\`\`\`

## 🚀 GitHub Pages Deployment

### 1. Repository Configuration

#### Repository Name
Your repository MUST be named: `yourusername.github.io`

\`\`\`bash
# Example for user "johndoe"
Repository name: johndoe.github.io
URL will be: https://johndoe.github.io
\`\`\`

#### Branch Structure
\`\`\`bash
main/master    # Source code
gh-pages       # Deployed static files (auto-generated)
\`\`\`

### 2. Next.js Configuration for Static Export

Update `next.config.mjs`:

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/yourusername.github.io' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/yourusername.github.io' : '',
}

export default nextConfig
\`\`\`

### 3. Package.json Scripts

Add deployment scripts:

\`\`\`json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export",
    "deploy": "npm run build && npm run export && touch out/.nojekyll",
    "gh-deploy": "npm run deploy && gh-pages -d out -t true"
  }
}
\`\`\`

### 4. GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      env:
        NODE_ENV: production
        NEXT_PUBLIC_MEDIUM_USERNAME: ${{ secrets.MEDIUM_USERNAME }}
        NEXT_PUBLIC_RSS2JSON_API_KEY: ${{ secrets.RSS2JSON_API_KEY }}
        NEXT_PUBLIC_RSS2JSON_URL: ${{ secrets.RSS2JSON_URL }}
        
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './out'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
\`\`\`

### 5. GitHub Repository Settings

#### Enable GitHub Pages
1. Go to repository Settings
2. Navigate to "Pages" section
3. Source: "GitHub Actions"
4. Save settings

#### Add Environment Secrets
1. Go to Settings → Secrets and variables → Actions
2. Add repository secrets:
   - `MEDIUM_USERNAME`: Your Medium username
   - `RSS2JSON_API_KEY`: Your RSS2JSON API key
   - `RSS2JSON_URL`: https://api.rss2json.com/v1/api.json

### 6. Manual Deployment

#### Using gh-pages package
\`\`\`bash
# Install gh-pages globally
npm install -g gh-pages

# Build and deploy
npm run build
npm run export
gh-pages -d out -t true
\`\`\`

#### Using Git commands
\`\`\`bash
# Build the application
npm run build
npm run export

# Navigate to output directory
cd out

# Initialize git and deploy
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -f origin gh-pages
\`\`\`

### 7. Custom Domain (Optional)

#### Add CNAME file
Create `public/CNAME` with your domain:
\`\`\`
yourdomain.com
\`\`\`

#### DNS Configuration
Add DNS records:
\`\`\`
Type: CNAME
Name: www
Value: yourusername.github.io

Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
\`\`\`

## 🔍 Testing and Optimization

### Performance Testing
\`\`\`bash
# Install Lighthouse CLI
npm install -g lighthouse

# Test performance
lighthouse https://yourusername.github.io --output html --output-path ./lighthouse-report.html

# Test mobile performance
lighthouse https://yourusername.github.io --preset=perf --form-factor=mobile
\`\`\`

### SEO Optimization
\`\`\`bash
# Test SEO
lighthouse https://yourusername.github.io --only-categories=seo

# Check meta tags
curl -s https://yourusername.github.io | grep -i "<meta"
\`\`\`

### Security Testing
\`\`\`bash
# Test security headers
curl -I https://yourusername.github.io

# Check CSP
curl -H "Accept: text/html" https://yourusername.github.io | grep -i "content-security-policy"
\`\`\`

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures
\`\`\`bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit
\`\`\`

#### 2. GitHub Pages Not Updating
\`\`\`bash
# Check GitHub Actions logs
# Verify branch protection rules
# Ensure proper permissions are set
# Check for CNAME conflicts
\`\`\`

#### 3. Medium Articles Not Loading
\`\`\`bash
# Test RSS feed directly
curl "https://medium.com/feed/@yourusername"

# Test RSS2JSON API
curl "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@yourusername&api_key=YOUR_KEY"

# Check API key validity
# Verify rate limits
\`\`\`

#### 4. Notes Not Appearing
\`\`\`bash
# Check notes directory exists
ls -la notes/

# Verify markdown format
head -20 notes/sample.md

# Check file permissions
chmod -R 644 notes/
\`\`\`

#### 5. Search Not Working
\`\`\`bash
# Check browser console for errors
# Verify search index is built
# Test with simple keywords
# Check rate limiting
\`\`\`

### Performance Issues

#### 1. Slow Loading
- Optimize images (use WebP format)
- Enable compression
- Minimize JavaScript bundles
- Use CDN for static assets

#### 2. Search Performance
- Implement search result pagination
- Add debouncing to search input
- Cache frequently searched terms
- Optimize keyword matching algorithms

### Security Issues

#### 1. CSP Violations
- Check browser console for CSP errors
- Update CSP headers as needed
- Validate external resource URLs

#### 2. XSS Prevention
- All user inputs are sanitized
- Markdown content is processed securely
- HTML output is escaped

## 📊 Analytics and Monitoring

### Google Analytics Setup
\`\`\`typescript
// Add to app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
      </body>
    </html>
  )
}
\`\`\`

### Performance Monitoring
\`\`\`typescript
// Add performance tracking
export function reportWebVitals(metric: any) {
  console.log(metric)
  // Send to analytics service
}
\`\`\`

## 🔄 Maintenance

### Regular Updates
\`\`\`bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit
npm audit fix

# Update Node.js version as needed
nvm install node
nvm use node
\`\`\`

### Content Updates
1. **Medium Articles**: Automatically updated via RSS feed
2. **Personal Notes**: Add/edit markdown files in notes directory
3. **Static Content**: Update files in lib/static-data.ts
4. **Certifications**: Add new certification images to public/images/

### Backup Strategy
\`\`\`bash
# Backup notes directory
tar -czf notes-backup-$(date +%Y%m%d).tar.gz notes/

# Backup configuration
cp .env.local .env.backup

# Version control everything
git add .
git commit -m "Regular backup"
git push origin main
\`\`\`

## 🆘 Support and Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [RSS2JSON API Documentation](https://rss2json.com/docs)

### Community
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [GitHub Pages Community](https://github.community/c/github-pages)

### Professional Services
- Custom development and consulting available
- Security review and penetration testing
- Performance optimization services

---

This setup guide provides comprehensive instructions for deploying a professional cybersecurity portfolio to GitHub Pages. The application is optimized for performance, security, and maintainability while providing advanced features for content management and search functionality.
