// Search Index for Static Site Generation
export interface SearchableContent {
  id: string
  title: string
  content: string
  type: "experience" | "skills" | "certifications" | "blog" | "notes" | "about"
  url: string
  category?: string
  tags: string[]
  lastModified?: string
}

export async function buildSearchIndex(): Promise<SearchableContent[]> {
  const searchIndex: SearchableContent[] = []

  // Experience data
  const experienceData = [
    {
      id: "exp-security-engineer",
      title: "Security Engineer at PT. Cynnex Integrasi Solusi",
      content:
        "Leading security engineering initiatives and implementing comprehensive security solutions. Responsible for security architecture design, threat modeling, and security controls implementation across enterprise infrastructure. Working with SIEM platforms, security automation, and incident response procedures.",
      type: "experience" as const,
      url: "/experience",
      tags: ["security-engineer", "siem", "security-architecture", "threat-modeling", "incident-response", "cynnex"],
      lastModified: "2025-02-01",
    },
    {
      id: "exp-pentest-leader",
      title: "Penetration Tester Leader at PT. Cynnex Integrasi Solusi",
      content:
        "Led penetration testing team and conducted comprehensive security assessments for enterprise clients. Specialized in vulnerability assessment, cyber threat hunting, and advanced persistent threat detection. Managed team of security professionals and client relationships.",
      type: "experience" as const,
      url: "/experience",
      tags: ["penetration-testing", "vulnerability-assessment", "threat-hunting", "team-leadership", "cynnex"],
      lastModified: "2025-02-01",
    },
    {
      id: "exp-soc-analyst",
      title: "Security Operations Center Analyst L2",
      content:
        "Performed advanced security monitoring and incident response as L2 analyst. Managed SIEM platforms, developed custom detection rules, and conducted threat hunting activities to identify and mitigate security threats. Specialized in log analysis and forensic investigation.",
      type: "experience" as const,
      url: "/experience",
      tags: ["soc-analyst", "siem", "incident-response", "threat-detection", "forensics", "cynnex"],
      lastModified: "2023-08-01",
    },
  ]

  // Skills data
  const skillsData = [
    {
      id: "skill-siem",
      title: "SIEM Management",
      content:
        "Expert in Security Information and Event Management platforms including QRadar, Splunk, and Wazuh. Experience in log correlation, custom rule development, and threat detection.",
      type: "skills" as const,
      url: "/skills",
      category: "Security Operations",
      tags: ["siem", "qradar", "splunk", "wazuh", "log-analysis", "threat-detection"],
    },
    {
      id: "skill-threat-hunting",
      title: "Threat Hunting",
      content:
        "Advanced threat hunting using MITRE ATT&CK framework, Sigma rules, and YARA. Proactive threat detection and hunting methodologies for enterprise environments.",
      type: "skills" as const,
      url: "/skills",
      category: "Security Operations",
      tags: ["threat-hunting", "mitre-attack", "sigma", "yara", "proactive-defense"],
    },
    {
      id: "skill-penetration-testing",
      title: "Penetration Testing",
      content:
        "Comprehensive penetration testing using Burp Suite, OWASP ZAP, SQLMap, Nmap, and Metasploit. Web application testing, network penetration, and vulnerability assessment.",
      type: "skills" as const,
      url: "/skills",
      category: "Penetration Testing",
      tags: ["penetration-testing", "burp-suite", "owasp", "sqlmap", "nmap", "metasploit"],
    },
    {
      id: "skill-forensics",
      title: "Digital Forensics",
      content:
        "Memory forensics with Volatility, malware analysis, network forensics with Wireshark, and reverse engineering using IDA Pro and Ghidra.",
      type: "skills" as const,
      url: "/skills",
      category: "Forensics & Analysis",
      tags: ["digital-forensics", "volatility", "malware-analysis", "wireshark", "ida-pro", "ghidra"],
    },
  ]

  // Certifications data
  const certificationsData = [
    {
      id: "cert-chfi",
      title: "Certified Hacking Forensic Investigator (CHFI)",
      content:
        "EC-Council digital forensics certification focusing on forensic investigation techniques, evidence handling, and cyber crime analysis. Advanced incident response and digital forensics skills.",
      type: "certifications" as const,
      url: "/certifications",
      tags: ["chfi", "ec-council", "digital-forensics", "incident-response", "cyber-crime"],
    },
    {
      id: "cert-pentest-plus",
      title: "CompTIA PenTest+ ce Certification",
      content:
        "Comprehensive penetration testing certification covering planning, scoping, vulnerability identification, and reporting of penetration test activities.",
      type: "certifications" as const,
      url: "/certifications",
      tags: ["comptia", "pentest-plus", "penetration-testing", "vulnerability-assessment"],
    },
    {
      id: "cert-security-plus",
      title: "CompTIA Security+ ce Certification",
      content:
        "Foundation-level cybersecurity certification covering core security concepts, risk management, and security technologies.",
      type: "certifications" as const,
      url: "/certifications",
      tags: ["comptia", "security-plus", "cybersecurity", "risk-management"],
    },
    {
      id: "cert-cnsp",
      title: "Certified Network Security Practitioner",
      content:
        "SecOps Group network security certification focusing on network defense, monitoring, and intrusion detection systems.",
      type: "certifications" as const,
      url: "/certifications",
      tags: ["cnsp", "secops-group", "network-security", "intrusion-detection"],
    },
  ]

  // Add all data to search index
  searchIndex.push(...experienceData, ...skillsData, ...certificationsData)

  return searchIndex
}

export function searchContent(query: string, content: SearchableContent[]): SearchableContent[] {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase()
  const results = content.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchTerm) ||
      item.content.toLowerCase().includes(searchTerm) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      item.category?.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm)
    )
  })

  // Sort by relevance (title matches first, then content matches)
  return results.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(searchTerm) ? 1 : 0
    const bTitle = b.title.toLowerCase().includes(searchTerm) ? 1 : 0

    if (aTitle !== bTitle) return bTitle - aTitle

    const aTagMatch = a.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ? 1 : 0
    const bTagMatch = b.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ? 1 : 0

    return bTagMatch - aTagMatch
  })
}
