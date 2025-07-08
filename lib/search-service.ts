// Search service with Medium integration and local notes
import { fetchMediumPosts } from "./medium-rss"

export interface SearchableContent {
  id: string
  title: string
  content: string
  type: "experience" | "skills" | "certifications" | "blog" | "notes" | "about"
  url: string
  category?: string
  tags: string[]
  lastModified?: string
  publishedDate?: string
  author?: string
}

export class SearchService {
  private static instance: SearchService
  private searchIndex: SearchableContent[] = []
  private lastUpdated: Date | null = null
  private updateInterval = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService()
    }
    return SearchService.instance
  }

  async buildSearchIndex(forceRefresh = false): Promise<SearchableContent[]> {
    const now = new Date()

    // Check if we need to refresh the index
    if (!forceRefresh && this.lastUpdated && now.getTime() - this.lastUpdated.getTime() < this.updateInterval) {
      return this.searchIndex
    }

    console.log("Building search index...")
    const searchIndex: SearchableContent[] = []

    // Static content (experience, skills, certifications)
    searchIndex.push(...this.getStaticContent())

    try {
      // Fetch Medium blog posts
      const mediumPosts = await fetchMediumPosts("angganvryn")
      const blogContent = mediumPosts.map((post) => ({
        id: `blog-${post.guid}`,
        title: post.title,
        content: post.description,
        type: "blog" as const,
        url: post.link,
        tags: post.categories.map((cat) => cat.toLowerCase().replace(/\s+/g, "-")),
        lastModified: post.pubDate,
        publishedDate: post.pubDate,
        author: post.author,
      }))
      searchIndex.push(...blogContent)
      console.log(`Added ${blogContent.length} Medium posts to search index`)
    } catch (error) {
      console.warn("Failed to fetch Medium posts for search index:", error)
    }

    this.searchIndex = searchIndex
    this.lastUpdated = now
    console.log(`Search index built with ${searchIndex.length} items`)

    return searchIndex
  }

  async searchContent(query: string): Promise<SearchableContent[]> {
    if (!query.trim()) return []

    const searchIndex = await this.buildSearchIndex()
    const searchTerm = query.toLowerCase()

    const results = searchIndex.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(searchTerm)
      const contentMatch = item.content.toLowerCase().includes(searchTerm)
      const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      const categoryMatch = item.category?.toLowerCase().includes(searchTerm)
      const typeMatch = item.type.toLowerCase().includes(searchTerm)

      return titleMatch || contentMatch || tagMatch || categoryMatch || typeMatch
    })

    // Sort by relevance (title matches first, then content matches)
    return results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchTerm) ? 1 : 0
      const bTitle = b.title.toLowerCase().includes(searchTerm) ? 1 : 0

      if (aTitle !== bTitle) return bTitle - aTitle

      const aTagMatch = a.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ? 1 : 0
      const bTagMatch = b.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ? 1 : 0

      if (aTagMatch !== bTagMatch) return bTagMatch - aTagMatch

      // Sort by publication date (newest first)
      const aDate = new Date(a.publishedDate || a.lastModified || 0)
      const bDate = new Date(b.publishedDate || b.lastModified || 0)
      return bDate.getTime() - aDate.getTime()
    })
  }

  private getStaticContent(): SearchableContent[] {
    return [
      // Experience
      {
        id: "exp-security-engineer",
        title: "Security Engineer at PT. Cynnex Integrasi Solusi",
        content:
          "Leading security engineering initiatives and implementing comprehensive security solutions. Responsible for security architecture design, threat modeling, and security controls implementation across enterprise infrastructure. Working with SIEM platforms, security automation, and incident response procedures.",
        type: "experience",
        url: "/experience",
        tags: ["security-engineer", "siem", "security-architecture", "threat-modeling", "incident-response", "cynnex"],
        lastModified: "2025-02-01",
      },
      {
        id: "exp-pentest-leader",
        title: "Penetration Tester Leader at PT. Cynnex Integrasi Solusi",
        content:
          "Led penetration testing team and conducted comprehensive security assessments for enterprise clients. Specialized in vulnerability assessment, cyber threat hunting, and advanced persistent threat detection. Managed team of security professionals and client relationships.",
        type: "experience",
        url: "/experience",
        tags: ["penetration-testing", "vulnerability-assessment", "threat-hunting", "team-leadership", "cynnex"],
        lastModified: "2025-02-01",
      },
      {
        id: "exp-soc-analyst",
        title: "Security Operations Center Analyst L2",
        content:
          "Performed advanced security monitoring and incident response as L2 analyst. Managed SIEM platforms, developed custom detection rules, and conducted threat hunting activities to identify and mitigate security threats. Specialized in log analysis and forensic investigation.",
        type: "experience",
        url: "/experience",
        tags: ["soc-analyst", "siem", "incident-response", "threat-detection", "forensics", "cynnex"],
        lastModified: "2023-08-01",
      },

      // Skills
      {
        id: "skill-siem",
        title: "SIEM Management",
        content:
          "Expert in Security Information and Event Management platforms including QRadar, Splunk, and Wazuh. Experience in log correlation, custom rule development, and threat detection.",
        type: "skills",
        url: "/skills",
        category: "Security Operations",
        tags: ["siem", "qradar", "splunk", "wazuh", "log-analysis", "threat-detection"],
      },
      {
        id: "skill-threat-hunting",
        title: "Threat Hunting",
        content:
          "Advanced threat hunting using MITRE ATT&CK framework, Sigma rules, and YARA. Proactive threat detection and hunting methodologies for enterprise environments.",
        type: "skills",
        url: "/skills",
        category: "Security Operations",
        tags: ["threat-hunting", "mitre-attack", "sigma", "yara", "proactive-defense"],
      },
      {
        id: "skill-penetration-testing",
        title: "Penetration Testing",
        content:
          "Comprehensive penetration testing using Burp Suite, OWASP ZAP, SQLMap, Nmap, and Metasploit. Web application testing, network penetration, and vulnerability assessment.",
        type: "skills",
        url: "/skills",
        category: "Penetration Testing",
        tags: ["penetration-testing", "burp-suite", "owasp", "sqlmap", "nmap", "metasploit"],
      },

      // Certifications
      {
        id: "cert-chfi",
        title: "Certified Hacking Forensic Investigator (CHFI)",
        content:
          "EC-Council digital forensics certification focusing on forensic investigation techniques, evidence handling, and cyber crime analysis. Advanced incident response and digital forensics skills.",
        type: "certifications",
        url: "/certifications",
        tags: ["chfi", "ec-council", "digital-forensics", "incident-response", "cyber-crime"],
      },
      {
        id: "cert-pentest-plus",
        title: "CompTIA PenTest+ ce Certification",
        content:
          "Comprehensive penetration testing certification covering planning, scoping, vulnerability identification, and reporting of penetration test activities.",
        type: "certifications",
        url: "/certifications",
        tags: ["comptia", "pentest-plus", "penetration-testing", "vulnerability-assessment"],
      },
    ]
  }
}
