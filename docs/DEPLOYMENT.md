# 🚀 Deployment Guide for GitHub Pages

This guide provides step-by-step instructions for deploying your cybersecurity portfolio to GitHub Pages.

## 📋 Prerequisites

- Node.js 18+ installed locally
- Git configured with your GitHub account
- GitHub repository created for your portfolio
- Basic understanding of GitHub Actions

## 🔧 GitHub Pages Setup

### 1. Repository Configuration

1. **Navigate to your GitHub repository**
2. **Go to Settings → Pages**
3. **Configure the source:**
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. **Save the configuration**

### 2. Environment Variables

Set up the following repository secrets:

1. **Go to Settings → Secrets and variables → Actions**
2. **Add repository secrets:**

\`\`\`env
# Required for external API integration
NEXT_PUBLIC_ENDPOINT=https://your-api-endpoint.com

# Optional: Medium integration
MEDIUM_USERNAME=your_medium_username
RSS2JSON_API_KEY=your_rss2json_api_key
\`\`\`

#### How to Set Up NEXT_PUBLIC_ENDPOINT

**Option 1: Mock API (for testing)**
\`\`\`bash
NEXT_PUBLIC_ENDPOINT=https://jsonplaceholder.typicode.com
\`\`\`

**Option 2: Your own API**
\`\`\`bash
# Deploy a simple Express.js API to Vercel/Netlify
NEXT_PUBLIC_ENDPOINT=https://your-api.vercel.app
\`\`\`

**Option 3: Headless CMS**
\`\`\`bash
# Use Strapi, Contentful, or similar
NEXT_PUBLIC_ENDPOINT=https://your-cms.herokuapp.com/api
\`\`\`

### 3. GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
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
        NEXT_PUBLIC_ENDPOINT: ${{ secrets.NEXT_PUBLIC_ENDPOINT }}
        MEDIUM_USERNAME: ${{ secrets.MEDIUM_USERNAME }}
        RSS2JSON_API_KEY: ${{ secrets.RSS2JSON_API_KEY }}
        
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
\`\`\`

## 🏗️ Next.js Configuration

Ensure your `next.config.mjs` is optimized for GitHub Pages:

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { 
    unoptimized: true 
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '',
  distDir: 'out'
}

export default nextConfig
\`\`\`

## 🔍 Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] No console errors in browser
- [ ] All imports properly resolved

### Performance
- [ ] Images optimized and compressed
- [ ] Bundle size reasonable
- [ ] Matrix rain effect performs well
- [ ] Search functionality responsive

### Content
- [ ] All navigation links working
- [ ] Notes loading correctly
- [ ] All view modes functional (Grid, List, Folder, Timeline)
- [ ] External API integration working
- [ ] Mobile responsiveness verified

### Security
- [ ] Environment variables properly configured
- [ ] No sensitive data in client-side code
- [ ] Input validation working
- [ ] File path validation secure

## 🚀 Deployment Process

### Automatic Deployment

1. **Push to main branch:**
\`\`\`bash
git add .
git commit -m "feat: deploy cybersec portfolio"
git push origin main
\`\`\`

2. **Monitor deployment:**
   - Go to "Actions" tab in your repository
   - Watch the workflow progress
   - Check for any build or deployment errors

3. **Verify deployment:**
   - Visit your GitHub Pages URL
   - Test all functionality
   - Check browser console for errors

### Manual Testing

Test locally before deploying:

\`\`\`bash
# Install dependencies
npm install

# Build the application
npm run build

# Export static files
npm run export

# Test the exported files
npx serve out
\`\`\`

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
\`\`\`bash
# Clear cache and reinstall
rm -rf .next out node_modules
npm install
npm run build
\`\`\`

2. **404 Errors on Refresh**
   - Ensure `trailingSlash: true` in next.config.mjs
   - Check basePath configuration
   - Verify all routes are properly exported

3. **External API Not Working**
   - Verify NEXT_PUBLIC_ENDPOINT is set
   - Check API endpoint accessibility
   - Test with a simple mock API first

4. **Notes Not Loading**
   - Ensure notes directory exists
   - Check markdown file format
   - Verify frontmatter syntax

### Debug Steps

1. Check GitHub Actions logs for build errors
2. Test locally with `npm run dev`
3. Verify environment variables in repository secrets
4. Check browser developer tools for client-side errors
5. Test API endpoints manually

## 📊 Performance Optimization

### Bundle Size
- Use dynamic imports for large components
- Optimize images and assets
- Remove unused dependencies

### Loading Performance
- Implement proper caching strategies
- Use debounced search
- Lazy load non-critical components

### SEO Optimization
- Add proper meta tags
- Implement structured data
- Optimize for Core Web Vitals

## 🔒 Security Best Practices

- Never commit sensitive data to repository
- Use environment variables for API keys
- Implement proper input validation
- Regular dependency updates
- Monitor for security vulnerabilities

## 📈 Monitoring

### Performance Monitoring
- Use Lighthouse for audits
- Monitor Core Web Vitals
- Track loading times

### Error Tracking
- Monitor browser console errors
- Track failed API requests
- Review GitHub Actions logs

## 🔄 Maintenance

### Regular Updates
- Update dependencies monthly
- Monitor security advisories
- Test deployments in staging
- Review and update content

### Backup Strategy
- Export notes regularly
- Backup environment variables
- Keep deployment configuration in version control

This deployment guide ensures your cybersecurity portfolio is properly configured for GitHub Pages with optimal performance and security.
