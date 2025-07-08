// Enhanced Medium search with AI-powered relevance scoring
import { fetchMediumPosts, type MediumPost } from "./medium-rss"
import { SecurityValidator, SecurityLogger } from "./security-utils"

export interface SearchResult {
  id: string
  title: string
  excerpt: string
  url: string
  source: "medium" | "notes" | "static"
  relevanceScore: number
  confidence: number
  matchedKeywords: string[]
  intent: "technical" | "educational" | "news" | "tutorial"
  category?: string
  tags?: string[]
  lastModified?: string
}

export interface SearchStats {
  totalResults: number
  searchTime: number
  sources: string[]
  topKeywords: string[]
}

// Cybersecurity keyword database with weights and synonyms
const CYBERSECURITY_KEYWORDS = [
  // Security Tools
  { term: "burp suite", category: "tool", weight: 0.9, synonyms: ["burpsuite", "burp"] },
  { term: "nmap", category: "tool", weight: 0.9, synonyms: ["network mapper"] },
  { term: "metasploit", category: "tool", weight: 0.9, synonyms: ["msf", "msfconsole"] },
  { term: "wireshark", category: "tool", weight: 0.8, synonyms: ["packet analyzer"] },
  { term: "nessus", category: "tool", weight: 0.8, synonyms: ["vulnerability scanner"] },
  { term: "sqlmap", category: "tool", weight: 0.8, synonyms: ["sql injection"] },
  { term: "john the ripper", category: "tool", weight: 0.7, synonyms: ["john", "password cracker"] },
  { term: "hashcat", category: "tool", weight: 0.7, synonyms: ["hash cracker"] },
  { term: "aircrack-ng", category: "tool", weight: 0.7, synonyms: ["wifi cracking"] },
  { term: "nikto", category: "tool", weight: 0.7, synonyms: ["web scanner"] },

  // Attack Techniques
  {
    term: "penetration testing",
    category: "technique",
    weight: 1.0,
    synonyms: ["pentest", "pen test", "ethical hacking"],
  },
  { term: "social engineering", category: "technique", weight: 0.9, synonyms: ["phishing", "pretexting"] },
  { term: "sql injection", category: "technique", weight: 0.9, synonyms: ["sqli", "database attack"] },
  { term: "cross-site scripting", category: "technique", weight: 0.9, synonyms: ["xss", "script injection"] },
  { term: "buffer overflow", category: "technique", weight: 0.8, synonyms: ["stack overflow", "heap overflow"] },
  { term: "privilege escalation", category: "technique", weight: 0.8, synonyms: ["privesc", "elevation"] },
  { term: "lateral movement", category: "technique", weight: 0.8, synonyms: ["network traversal"] },
  { term: "man in the middle", category: "technique", weight: 0.8, synonyms: ["mitm", "interception"] },
  { term: "denial of service", category: "technique", weight: 0.7, synonyms: ["dos", "ddos"] },
  { term: "brute force", category: "technique", weight: 0.7, synonyms: ["password attack"] },

  // Security Concepts
  { term: "zero day", category: "concept", weight: 0.9, synonyms: ["0day", "zero-day"] },
  { term: "threat hunting", category: "concept", weight: 0.9, synonyms: ["proactive hunting"] },
  { term: "incident response", category: "concept", weight: 0.9, synonyms: ["ir", "cyber incident"] },
  { term: "digital forensics", category: "concept", weight: 0.8, synonyms: ["computer forensics"] },
  { term: "malware analysis", category: "concept", weight: 0.8, synonyms: ["reverse engineering"] },
  {
    term: "vulnerability assessment",
    category: "concept",
    weight: 0.8,
    synonyms: ["vuln scan", "security assessment"],
  },
  { term: "risk assessment", category: "concept", weight: 0.7, synonyms: ["risk analysis"] },
  { term: "compliance", category: "concept", weight: 0.6, synonyms: ["regulatory", "audit"] },

  // Technologies
  { term: "siem", category: "technology", weight: 0.9, synonyms: ["security information", "event management"] },
  { term: "soar", category: "technology", weight: 0.8, synonyms: ["security orchestration"] },
  { term: "edr", category: "technology", weight: 0.8, synonyms: ["endpoint detection"] },
  { term: "firewall", category: "technology", weight: 0.7, synonyms: ["network security"] },
  { term: "ids", category: "technology", weight: 0.7, synonyms: ["intrusion detection"] },
  { term: "ips", category: "technology", weight: 0.7, synonyms: ["intrusion prevention"] },
  { term: "waf", category: "technology", weight: 0.7, synonyms: ["web application firewall"] },
  { term: "vpn", category: "technology", weight: 0.6, synonyms: ["virtual private network"] },

  // Frameworks and Standards
  { term: "mitre attack", category: "framework", weight: 0.9, synonyms: ["att&ck", "mitre"] },
  { term: "owasp", category: "framework", weight: 0.8, synonyms: ["open web application"] },
  { term: "nist", category: "framework", weight: 0.8, synonyms: ["cybersecurity framework"] },
  { term: "iso 27001", category: "framework", weight: 0.7, synonyms: ["information security management"] },
  { term: "pci dss", category: "framework", weight: 0.6, synonyms: ["payment card industry"] },
  { term: "gdpr", category: "framework", weight: 0.6, synonyms: ["data protection"] },

  // Malware Types
  { term: "ransomware", category: "malware", weight: 0.9, synonyms: ["crypto-locker"] },
  { term: "trojan", category: "malware", weight: 0.8, synonyms: ["trojan horse"] },
  { term: "rootkit", category: "malware", weight: 0.8, synonyms: ["stealth malware"] },
  { term: "botnet", category: "malware", weight: 0.8, synonyms: ["zombie network"] },
  { term: "spyware", category: "malware", weight: 0.7, synonyms: ["surveillance software"] },
  { term: "adware", category: "malware", weight: 0.5, synonyms: ["advertising software"] },

  // Cryptography
  { term: "encryption", category: "crypto", weight: 0.8, synonyms: ["cryptography", "cipher"] },
  { term: "hashing", category: "crypto", weight: 0.7, synonyms: ["hash function", "digest"] },
  { term: "digital signature", category: "crypto", weight: 0.7, synonyms: ["signing"] },
  { term: "pki", category: "crypto", weight: 0.7, synonyms: ["public key infrastructure"] },
  { term: "ssl", category: "crypto", weight: 0.6, synonyms: ["tls", "secure socket"] },
]

class EnhancedMediumSearch {
  private cache = new Map<string, SearchResult[]>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  async searchArticles(query: string): Promise<SearchResult[]> {
    const sanitizedQuery = SecurityValidator.sanitizeSearchQuery(query)
    if (!sanitizedQuery) {
      SecurityLogger.log("warn", "Empty or invalid search query")
      return []
    }

    // Check cache first
    const cacheKey = sanitizedQuery.toLowerCase()
    const cached = this.cache.get(cacheKey)
    if (cached) {
      SecurityLogger.log("info", "Returning cached search results", { query: sanitizedQuery })
      return cached
    }

    try {
      const startTime = Date.now()

      // Fetch Medium posts
      const posts = await fetchMediumPosts("angganvryn")

      // Convert to search results with relevance scoring
      const results = posts
        .map((post) => this.convertToSearchResult(post, sanitizedQuery))
        .filter((result) => result.relevanceScore > 0.1)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 10)

      // Cache results
      this.cache.set(cacheKey, results)
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)

      const searchTime = Date.now() - startTime
      SecurityLogger.log("info", "Medium search completed", {
        query: sanitizedQuery,
        resultsCount: results.length,
        searchTime,
      })

      return results
    } catch (error) {
      SecurityLogger.log("error", "Medium search failed", { query: sanitizedQuery, error })
      return []
    }
  }

  private convertToSearchResult(post: MediumPost, query: string): SearchResult {
    const searchableText = `${post.title} ${post.description} ${post.categories.join(" ")}`.toLowerCase()
    const queryLower = query.toLowerCase()

    // Calculate relevance score
    let relevanceScore = 0
    const matchedKeywords: string[] = []

    // Direct text matching
    if (searchableText.includes(queryLower)) {
      relevanceScore += 0.5
    }

    // Title matching (higher weight)
    if (post.title.toLowerCase().includes(queryLower)) {
      relevanceScore += 0.8
    }

    // Keyword matching with cybersecurity terms
    for (const keyword of CYBERSECURITY_KEYWORDS) {
      if (searchableText.includes(keyword.term) || keyword.synonyms.some((syn) => searchableText.includes(syn))) {
        if (queryLower.includes(keyword.term) || keyword.synonyms.some((syn) => queryLower.includes(syn))) {
          relevanceScore += keyword.weight * 0.3
          matchedKeywords.push(keyword.term)
        }
      }
    }

    // Category matching
    const categories = post.categories.map((cat) => cat.toLowerCase())
    if (categories.some((cat) => queryLower.includes(cat))) {
      relevanceScore += 0.3
    }

    // Determine intent based on content
    const intent = this.determineIntent(searchableText, query)

    // Calculate confidence based on various factors
    const confidence = Math.min(1.0, relevanceScore + matchedKeywords.length * 0.1)

    return {
      id: post.guid || post.link,
      title: post.title,
      excerpt: post.description,
      url: post.link,
      source: "medium",
      relevanceScore: Math.min(1.0, relevanceScore),
      confidence,
      matchedKeywords,
      intent,
      category: this.categorizeContent(post.categories),
      tags: post.categories,
      lastModified: post.pubDate,
    }
  }

  private determineIntent(content: string, query: string): "technical" | "educational" | "news" | "tutorial" {
    const technicalKeywords = ["configuration", "setup", "install", "deploy", "implement"]
    const educationalKeywords = ["learn", "understand", "introduction", "basics", "fundamentals"]
    const newsKeywords = ["vulnerability", "breach", "attack", "threat", "security alert"]
    const tutorialKeywords = ["how to", "step by step", "guide", "tutorial", "walkthrough"]

    const combinedText = `${content} ${query}`.toLowerCase()

    if (tutorialKeywords.some((keyword) => combinedText.includes(keyword))) {
      return "tutorial"
    }
    if (technicalKeywords.some((keyword) => combinedText.includes(keyword))) {
      return "technical"
    }
    if (newsKeywords.some((keyword) => combinedText.includes(keyword))) {
      return "news"
    }
    if (educationalKeywords.some((keyword) => combinedText.includes(keyword))) {
      return "educational"
    }

    return "educational" // default
  }

  private categorizeContent(categories: string[]): string {
    const categoryMap: Record<string, string> = {
      cybersecurity: "Security",
      "penetration testing": "Pentesting",
      malware: "Malware Analysis",
      "incident response": "Incident Response",
      "digital forensics": "Forensics",
      "threat hunting": "Threat Hunting",
      vulnerability: "Vulnerability Management",
      compliance: "Compliance",
      privacy: "Privacy",
      encryption: "Cryptography",
    }

    for (const category of categories) {
      const lowerCategory = category.toLowerCase()
      for (const [key, value] of Object.entries(categoryMap)) {
        if (lowerCategory.includes(key)) {
          return value
        }
      }
    }

    return "General"
  }

  async getSuggestions(query: string): Promise<string[]> {
    const sanitizedQuery = SecurityValidator.sanitizeSearchQuery(query)
    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      return []
    }

    const queryLower = sanitizedQuery.toLowerCase()
    const suggestions: string[] = []

    // Find matching cybersecurity terms
    for (const keyword of CYBERSECURITY_KEYWORDS) {
      if (keyword.term.includes(queryLower) || keyword.synonyms.some((syn) => syn.includes(queryLower))) {
        suggestions.push(keyword.term)
      }
    }

    // Sort by relevance (weight) and return top 5
    return suggestions
      .sort((a, b) => {
        const aKeyword = CYBERSECURITY_KEYWORDS.find((k) => k.term === a)
        const bKeyword = CYBERSECURITY_KEYWORDS.find((k) => k.term === b)
        return (bKeyword?.weight || 0) - (aKeyword?.weight || 0)
      })
      .slice(0, 5)
  }

  clearCache(): void {
    this.cache.clear()
    SecurityLogger.log("info", "Search cache cleared")
  }
}

export const enhancedMediumSearch = new EnhancedMediumSearch()
