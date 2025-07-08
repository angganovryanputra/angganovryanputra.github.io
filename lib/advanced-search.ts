// Advanced search engine with keyword detection and semantic analysis
export interface KeywordData {
  term: string
  category: "tool" | "technique" | "technology" | "framework" | "vulnerability" | "general"
  weight: number
  synonyms: string[]
}

export interface SearchIntent {
  type: "technical" | "educational" | "news" | "tutorial" | "reference"
  confidence: number
}

export interface SearchResult {
  id: string
  title: string
  content: string
  url: string
  type: "medium" | "notes" | "static"
  relevanceScore: number
  matchedKeywords: string[]
  intent: SearchIntent
  snippet: string
  publishedDate?: string
  author?: string
  tags: string[]
}

// Comprehensive cybersecurity keyword database
export const CYBERSECURITY_KEYWORDS: KeywordData[] = [
  // Security Tools
  { term: "burp suite", category: "tool", weight: 0.9, synonyms: ["burp", "burpsuite"] },
  { term: "nmap", category: "tool", weight: 0.9, synonyms: ["network mapper"] },
  { term: "metasploit", category: "tool", weight: 0.9, synonyms: ["msf", "msfconsole"] },
  { term: "wireshark", category: "tool", weight: 0.9, synonyms: ["packet analyzer"] },
  { term: "sqlmap", category: "tool", weight: 0.8, synonyms: ["sql injection tool"] },
  { term: "owasp zap", category: "tool", weight: 0.8, synonyms: ["zap", "zaproxy"] },
  { term: "volatility", category: "tool", weight: 0.8, synonyms: ["memory forensics"] },
  { term: "ida pro", category: "tool", weight: 0.8, synonyms: ["ida", "disassembler"] },
  { term: "ghidra", category: "tool", weight: 0.8, synonyms: ["reverse engineering"] },
  { term: "splunk", category: "tool", weight: 0.9, synonyms: ["siem platform"] },
  { term: "qradar", category: "tool", weight: 0.9, synonyms: ["ibm qradar"] },
  { term: "wazuh", category: "tool", weight: 0.8, synonyms: ["open source siem"] },
  { term: "elastic", category: "tool", weight: 0.8, synonyms: ["elasticsearch", "elk stack"] },
  { term: "yara", category: "tool", weight: 0.8, synonyms: ["malware detection"] },
  { term: "sigma", category: "tool", weight: 0.8, synonyms: ["detection rules"] },

  // Techniques
  {
    term: "penetration testing",
    category: "technique",
    weight: 1.0,
    synonyms: ["pentest", "pen test", "ethical hacking"],
  },
  {
    term: "vulnerability assessment",
    category: "technique",
    weight: 0.9,
    synonyms: ["vuln assessment", "security assessment"],
  },
  { term: "threat hunting", category: "technique", weight: 0.9, synonyms: ["proactive hunting", "cyber hunting"] },
  { term: "incident response", category: "technique", weight: 0.9, synonyms: ["ir", "security incident"] },
  {
    term: "digital forensics",
    category: "technique",
    weight: 0.9,
    synonyms: ["computer forensics", "cyber forensics"],
  },
  {
    term: "malware analysis",
    category: "technique",
    weight: 0.9,
    synonyms: ["malware research", "reverse engineering"],
  },
  { term: "social engineering", category: "technique", weight: 0.8, synonyms: ["phishing", "human hacking"] },
  { term: "red teaming", category: "technique", weight: 0.8, synonyms: ["adversary simulation"] },
  { term: "blue teaming", category: "technique", weight: 0.8, synonyms: ["defensive security"] },
  { term: "purple teaming", category: "technique", weight: 0.7, synonyms: ["collaborative security"] },

  // Technologies
  { term: "siem", category: "technology", weight: 1.0, synonyms: ["security information event management"] },
  { term: "soar", category: "technology", weight: 0.9, synonyms: ["security orchestration automation"] },
  { term: "edr", category: "technology", weight: 0.9, synonyms: ["endpoint detection response"] },
  { term: "xdr", category: "technology", weight: 0.8, synonyms: ["extended detection response"] },
  { term: "zero trust", category: "technology", weight: 0.9, synonyms: ["zero trust architecture"] },
  { term: "devsecops", category: "technology", weight: 0.8, synonyms: ["secure development"] },
  { term: "cloud security", category: "technology", weight: 0.9, synonyms: ["aws security", "azure security"] },
  {
    term: "container security",
    category: "technology",
    weight: 0.8,
    synonyms: ["docker security", "kubernetes security"],
  },
  { term: "api security", category: "technology", weight: 0.8, synonyms: ["rest api security"] },
  { term: "iot security", category: "technology", weight: 0.7, synonyms: ["internet of things security"] },

  // Frameworks
  { term: "mitre attack", category: "framework", weight: 1.0, synonyms: ["mitre att&ck", "attack framework"] },
  { term: "owasp", category: "framework", weight: 0.9, synonyms: ["owasp top 10"] },
  { term: "nist", category: "framework", weight: 0.9, synonyms: ["nist framework", "cybersecurity framework"] },
  { term: "iso 27001", category: "framework", weight: 0.8, synonyms: ["information security management"] },
  { term: "pci dss", category: "framework", weight: 0.8, synonyms: ["payment card industry"] },
  { term: "gdpr", category: "framework", weight: 0.7, synonyms: ["data protection regulation"] },
  { term: "hipaa", category: "framework", weight: 0.7, synonyms: ["health insurance portability"] },

  // Vulnerabilities
  { term: "cve", category: "vulnerability", weight: 0.9, synonyms: ["common vulnerabilities exposures"] },
  { term: "sql injection", category: "vulnerability", weight: 0.9, synonyms: ["sqli", "database injection"] },
  { term: "xss", category: "vulnerability", weight: 0.9, synonyms: ["cross site scripting"] },
  { term: "csrf", category: "vulnerability", weight: 0.8, synonyms: ["cross site request forgery"] },
  { term: "buffer overflow", category: "vulnerability", weight: 0.8, synonyms: ["memory corruption"] },
  { term: "privilege escalation", category: "vulnerability", weight: 0.8, synonyms: ["privesc", "elevation"] },
  { term: "rce", category: "vulnerability", weight: 0.9, synonyms: ["remote code execution"] },
  { term: "lfi", category: "vulnerability", weight: 0.7, synonyms: ["local file inclusion"] },
  { term: "rfi", category: "vulnerability", weight: 0.7, synonyms: ["remote file inclusion"] },
  { term: "directory traversal", category: "vulnerability", weight: 0.7, synonyms: ["path traversal"] },

  // General Security Terms
  { term: "cybersecurity", category: "general", weight: 1.0, synonyms: ["cyber security", "information security"] },
  { term: "infosec", category: "general", weight: 0.9, synonyms: ["information security"] },
  { term: "appsec", category: "general", weight: 0.8, synonyms: ["application security"] },
  { term: "netsec", category: "general", weight: 0.8, synonyms: ["network security"] },
  { term: "opsec", category: "general", weight: 0.7, synonyms: ["operational security"] },
  { term: "threat intelligence", category: "general", weight: 0.9, synonyms: ["cyber intelligence"] },
  { term: "security awareness", category: "general", weight: 0.7, synonyms: ["security training"] },
  { term: "compliance", category: "general", weight: 0.8, synonyms: ["regulatory compliance"] },
  { term: "risk assessment", category: "general", weight: 0.8, synonyms: ["security risk"] },
  { term: "security audit", category: "general", weight: 0.8, synonyms: ["security review"] },
]

export class AdvancedSearchEngine {
  private keywordMap: Map<string, KeywordData>
  private synonymMap: Map<string, string>

  constructor() {
    this.keywordMap = new Map()
    this.synonymMap = new Map()
    this.buildKeywordMaps()
  }

  private buildKeywordMaps(): void {
    CYBERSECURITY_KEYWORDS.forEach((keyword) => {
      this.keywordMap.set(keyword.term.toLowerCase(), keyword)

      // Map synonyms to main term
      keyword.synonyms.forEach((synonym) => {
        this.synonymMap.set(synonym.toLowerCase(), keyword.term.toLowerCase())
      })
    })
  }

  public extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/)
    const extractedKeywords: string[] = []

    // Check for multi-word keywords first
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= Math.min(i + 4, words.length); j++) {
        const phrase = words.slice(i, j).join(" ")

        if (this.keywordMap.has(phrase)) {
          extractedKeywords.push(phrase)
        } else if (this.synonymMap.has(phrase)) {
          const mainTerm = this.synonymMap.get(phrase)!
          extractedKeywords.push(mainTerm)
        }
      }
    }

    // Check for single-word keywords
    words.forEach((word) => {
      if (this.keywordMap.has(word)) {
        extractedKeywords.push(word)
      } else if (this.synonymMap.has(word)) {
        const mainTerm = this.synonymMap.get(word)!
        extractedKeywords.push(mainTerm)
      }
    })

    return [...new Set(extractedKeywords)]
  }

  public analyzeIntent(query: string): SearchIntent {
    const lowerQuery = query.toLowerCase()

    // Technical intent indicators
    const technicalIndicators = ["how to", "configure", "setup", "install", "command", "script", "code"]
    const technicalScore = technicalIndicators.filter((indicator) => lowerQuery.includes(indicator)).length

    // Educational intent indicators
    const educationalIndicators = ["what is", "explain", "learn", "understand", "basics", "introduction"]
    const educationalScore = educationalIndicators.filter((indicator) => lowerQuery.includes(indicator)).length

    // News intent indicators
    const newsIndicators = ["latest", "new", "update", "vulnerability", "breach", "alert"]
    const newsScore = newsIndicators.filter((indicator) => lowerQuery.includes(indicator)).length

    // Tutorial intent indicators
    const tutorialIndicators = ["tutorial", "guide", "step by step", "walkthrough", "example"]
    const tutorialScore = tutorialIndicators.filter((indicator) => lowerQuery.includes(indicator)).length

    // Determine primary intent
    const scores = {
      technical: technicalScore,
      educational: educationalScore,
      news: newsScore,
      tutorial: tutorialScore,
    }

    const maxScore = Math.max(...Object.values(scores))
    if (maxScore === 0) {
      return { type: "reference", confidence: 0.5 }
    }

    const primaryIntent = Object.entries(scores).find(([_, score]) => score === maxScore)![0] as SearchIntent["type"]
    const confidence = Math.min(maxScore / 3, 1.0)

    return { type: primaryIntent, confidence }
  }

  public calculateRelevanceScore(content: string, query: string, matchedKeywords: string[]): number {
    const lowerContent = content.toLowerCase()
    const lowerQuery = query.toLowerCase()

    let score = 0

    // Exact query match in title (highest weight)
    if (lowerContent.includes(lowerQuery)) {
      score += 10
    }

    // Keyword matches
    matchedKeywords.forEach((keyword) => {
      const keywordData = this.keywordMap.get(keyword)
      if (keywordData) {
        score += keywordData.weight * 5
      }
    })

    // Word proximity bonus
    const queryWords = lowerQuery.split(/\s+/)
    const contentWords = lowerContent.split(/\s+/)

    for (let i = 0; i < contentWords.length - queryWords.length + 1; i++) {
      const window = contentWords.slice(i, i + queryWords.length).join(" ")
      if (window === lowerQuery) {
        score += 8
      }
    }

    // Partial word matches
    queryWords.forEach((word) => {
      if (lowerContent.includes(word)) {
        score += 1
      }
    })

    return Math.min(score, 100) // Cap at 100
  }

  public generateSnippet(content: string, query: string, maxLength = 200): string {
    const lowerContent = content.toLowerCase()
    const lowerQuery = query.toLowerCase()

    // Find the best match position
    let bestPosition = lowerContent.indexOf(lowerQuery)

    if (bestPosition === -1) {
      // If no exact match, find first keyword match
      const queryWords = lowerQuery.split(/\s+/)
      for (const word of queryWords) {
        const position = lowerContent.indexOf(word)
        if (position !== -1) {
          bestPosition = position
          break
        }
      }
    }

    if (bestPosition === -1) {
      // If no matches, return beginning of content
      bestPosition = 0
    }

    // Calculate snippet boundaries
    const start = Math.max(0, bestPosition - maxLength / 4)
    const end = Math.min(content.length, start + maxLength)

    let snippet = content.substring(start, end)

    // Clean up snippet boundaries
    if (start > 0) {
      const firstSpace = snippet.indexOf(" ")
      if (firstSpace !== -1) {
        snippet = "..." + snippet.substring(firstSpace)
      }
    }

    if (end < content.length) {
      const lastSpace = snippet.lastIndexOf(" ")
      if (lastSpace !== -1) {
        snippet = snippet.substring(0, lastSpace) + "..."
      }
    }

    return snippet.trim()
  }

  public searchContent(contents: any[], query: string): SearchResult[] {
    if (!query.trim()) return []

    const extractedKeywords = this.extractKeywords(query)
    const intent = this.analyzeIntent(query)
    const results: SearchResult[] = []

    contents.forEach((item) => {
      const searchableText = `${item.title} ${item.content}`.toLowerCase()
      const matchedKeywords = extractedKeywords.filter((keyword) => searchableText.includes(keyword.toLowerCase()))

      // Check if content matches query or keywords
      const queryMatch = searchableText.includes(query.toLowerCase())
      const hasKeywordMatch = matchedKeywords.length > 0

      if (queryMatch || hasKeywordMatch) {
        const relevanceScore = this.calculateRelevanceScore(searchableText, query, matchedKeywords)

        const snippet = this.generateSnippet(item.content, query)

        results.push({
          id: item.id,
          title: item.title,
          content: item.content,
          url: item.url,
          type: item.type,
          relevanceScore,
          matchedKeywords,
          intent,
          snippet,
          publishedDate: item.publishedDate,
          author: item.author,
          tags: item.tags || [],
        })
      }
    })

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }
}

import { fetchMediumPosts, MediumPost } from './medium';

// Helper function to generate a relevant snippet from content
function generateSnippet(content: string, query: string): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) {
    return content.substring(0, 150) + '...';
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + lowerQuery.length + 50);
  const snippet = content.substring(start, end);

  return (start > 0 ? '...' : '') + snippet.replace(new RegExp(query, 'gi'), (match) => `**${match}**`) + (end < content.length ? '...' : '');
}
