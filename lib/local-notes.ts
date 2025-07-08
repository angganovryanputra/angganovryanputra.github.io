import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface LocalNote {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  filePath: string
  relativePath: string
  lastModified: string
  category?: string
  tags: string[]
  subfolder?: string
  tableOfContents: TableOfContentsItem[]
  frontmatter: {
    title?: string
    author?: string
    date?: string
    category?: string
    tags?: string[]
    [key: string]: any
  }
  images: string[]
  wordCount: number
  readTime: number
}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  anchor: string
  children?: TableOfContentsItem[]
}

export interface NotesMetadata {
  totalNotes: number
  categories: string[]
  tags: string[]
  subfolders: string[]
  lastUpdated: string
}

class LocalNotesManager {
  private notesDirectory: string
  private imagesDirectory: string
  private cache: Map<string, LocalNote> = new Map()
  private lastScan = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.notesDirectory = path.join(process.cwd(), "notes")
    this.imagesDirectory = path.join(process.cwd(), "public", "images", "notes")
    this.ensureDirectories()
  }

  private ensureDirectories() {
    // Ensure notes directory exists
    if (!fs.existsSync(this.notesDirectory)) {
      fs.mkdirSync(this.notesDirectory, { recursive: true })
    }

    // Ensure images directory exists
    if (!fs.existsSync(this.imagesDirectory)) {
      fs.mkdirSync(this.imagesDirectory, { recursive: true })
    }

    // Create sample notes if directory is empty
    if (this.isDirectoryEmpty(this.notesDirectory)) {
      this.createSampleNotes()
    }
  }

  private isDirectoryEmpty(dirPath: string): boolean {
    try {
      const files = fs.readdirSync(dirPath)
      return files.filter((file) => !file.startsWith(".")).length === 0
    } catch {
      return true
    }
  }

  private createSampleNotes() {
    const sampleNotes = [
      {
        filename: "cybersecurity-fundamentals.md",
        content: `---
title: "Cybersecurity Fundamentals"
author: "Security Professional"
date: "2024-01-15"
category: "Fundamentals"
tags: ["cybersecurity", "fundamentals", "security", "basics"]
---

# Cybersecurity Fundamentals

## Introduction

Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information.

## The CIA Triad

The foundation of information security consists of three core principles:

### Confidentiality
Ensuring that information is accessible only to those authorized to have access. This involves:
- Data encryption
- Access controls
- Authentication mechanisms
- Privacy protection

### Integrity
Safeguarding the accuracy and completeness of information and processing methods. Key aspects include:
- Data validation
- Digital signatures
- Version control
- Change management

### Availability
Ensuring that authorized users have access to information when required. This encompasses:
- System uptime
- Disaster recovery
- Redundancy
- Performance optimization

## Common Threats

### Malware
Malicious software designed to damage or disrupt systems:
- **Viruses**: Self-replicating programs that attach to other files
- **Worms**: Standalone malware that spreads across networks
- **Trojans**: Disguised malware that appears legitimate
- **Ransomware**: Encrypts files and demands payment for decryption

### Phishing
Fraudulent attempts to obtain sensitive information through:
- Email spoofing
- Fake websites
- Social engineering tactics
- Credential harvesting

### Social Engineering
Psychological manipulation techniques to divulge confidential information:
- Pretexting
- Baiting
- Quid pro quo
- Tailgating

## Security Controls

### Preventive Controls
- Firewalls
- Antivirus software
- Access controls
- Security awareness training

### Detective Controls
- Intrusion detection systems
- Log monitoring
- Security audits
- Vulnerability assessments

### Corrective Controls
- Incident response procedures
- Backup and recovery
- Patch management
- System updates

## Best Practices

1. **Use Strong Authentication**
   - Complex passwords
   - Multi-factor authentication
   - Biometric verification
   - Single sign-on (SSO)

2. **Keep Systems Updated**
   - Regular patching
   - Software updates
   - Security configurations
   - Vulnerability management

3. **Implement Defense in Depth**
   - Multiple security layers
   - Network segmentation
   - Endpoint protection
   - Data encryption

4. **Regular Security Training**
   - Awareness programs
   - Phishing simulations
   - Security policies
   - Incident reporting

## Conclusion

Cybersecurity is an ongoing process that requires continuous learning, adaptation, and vigilance. By understanding fundamental principles and implementing comprehensive security measures, organizations can better protect themselves against evolving cyber threats.`,
      },
      {
        filename: "penetration-testing/methodology.md",
        content: `---
title: "Penetration Testing Methodology"
author: "Security Professional"
date: "2024-01-20"
category: "Penetration Testing"
tags: ["pentest", "methodology", "security-testing", "vulnerability"]
---

# Penetration Testing Methodology

## Overview

Penetration testing is a systematic approach to evaluating the security of an IT infrastructure by safely attempting to exploit vulnerabilities. This methodology follows industry standards and best practices.

## Testing Phases

### 1. Planning and Reconnaissance

#### Scope Definition
- **Target Systems**: Define which systems, networks, and applications are in scope
- **Testing Methods**: Determine black box, white box, or gray box approach
- **Rules of Engagement**: Establish testing boundaries and restrictions
- **Timeline**: Set testing schedule and milestones

#### Information Gathering (OSINT)
- **Passive Reconnaissance**: Gather information without direct interaction
  - DNS enumeration
  - WHOIS lookups
  - Social media research
  - Public records search
- **Active Reconnaissance**: Direct interaction with target systems
  - Port scanning
  - Service enumeration
  - Banner grabbing
  - Network mapping

### 2. Scanning and Enumeration

#### Network Discovery
\`\`\`bash
# Network sweep
nmap -sn 192.168.1.0/24

# Port scanning
nmap -sS -sV -O target.com

# Service enumeration
nmap -sC -sV -p- target.com

# UDP scanning
nmap -sU --top-ports 1000 target.com
\`\`\`

#### Vulnerability Scanning
- **Automated Tools**: Nessus, OpenVAS, Qualys
- **Manual Testing**: Custom scripts and techniques
- **Web Application Scanning**: Burp Suite, OWASP ZAP
- **Database Scanning**: SQLMap, NoSQLMap

### 3. Gaining Access

#### Exploitation Techniques
- **Network Exploits**: Buffer overflows, protocol vulnerabilities
- **Web Application Exploits**: SQL injection, XSS, CSRF
- **Social Engineering**: Phishing, pretexting, physical access
- **Password Attacks**: Brute force, dictionary attacks, credential stuffing

#### Common Exploitation Tools
\`\`\`bash
# Metasploit Framework
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS target_ip
exploit

# SQL Injection with SQLMap
sqlmap -u "http://target.com/page.php?id=1" --dbs

# Web shell upload
curl -X POST -F "file=@shell.php" http://target.com/upload.php
\`\`\`

### 4. Maintaining Access

#### Persistence Mechanisms
- **Backdoors**: Hidden access points for future entry
- **Rootkits**: Stealth tools to maintain system access
- **Scheduled Tasks**: Automated execution of malicious code
- **Registry Modifications**: Windows persistence techniques

#### Privilege Escalation
- **Local Privilege Escalation**: Exploit local vulnerabilities
- **Domain Privilege Escalation**: Active Directory attacks
- **Kernel Exploits**: Operating system vulnerabilities
- **Misconfiguration Abuse**: Weak permissions and settings

### 5. Analysis and Reporting

#### Evidence Collection
- **Screenshots**: Visual proof of successful exploitation
- **Log Files**: System and application logs
- **Network Captures**: Packet analysis and traffic flows
- **Command Output**: Results of executed commands

#### Risk Assessment
- **CVSS Scoring**: Common Vulnerability Scoring System
- **Business Impact**: Potential damage to organization
- **Exploitability**: Ease of exploitation
- **Remediation Effort**: Cost and complexity of fixes

## OWASP Top 10 Testing

### 1. Injection Flaws
- **SQL Injection**: Database query manipulation
- **NoSQL Injection**: NoSQL database attacks
- **LDAP Injection**: Directory service attacks
- **Command Injection**: Operating system command execution

### 2. Broken Authentication
- **Session Management**: Session fixation, hijacking
- **Password Security**: Weak passwords, storage issues
- **Multi-factor Authentication**: Bypass techniques
- **Account Lockout**: Brute force protection testing

### 3. Sensitive Data Exposure
- **Data in Transit**: Unencrypted communications
- **Data at Rest**: Unencrypted storage
- **Backup Security**: Unsecured backup files
- **Log Security**: Sensitive information in logs

## Tools and Frameworks

### Network Testing
- **Nmap**: Network discovery and port scanning
- **Masscan**: High-speed port scanner
- **Zmap**: Internet-wide network scanner
- **Unicornscan**: Asynchronous network scanner

### Web Application Testing
- **Burp Suite**: Comprehensive web application testing
- **OWASP ZAP**: Open-source web application scanner
- **Nikto**: Web server scanner
- **Dirb/Dirbuster**: Directory and file brute forcing

### Exploitation Frameworks
- **Metasploit**: Comprehensive penetration testing framework
- **Cobalt Strike**: Advanced threat emulation platform
- **Empire**: PowerShell post-exploitation framework
- **BeEF**: Browser exploitation framework

### Post-Exploitation
- **Mimikatz**: Windows credential extraction
- **BloodHound**: Active Directory attack path analysis
- **PowerSploit**: PowerShell post-exploitation toolkit
- **LinEnum**: Linux enumeration script

## Reporting Best Practices

### Executive Summary
- **High-level Overview**: Non-technical summary for management
- **Risk Rating**: Overall security posture assessment
- **Key Findings**: Most critical vulnerabilities
- **Business Impact**: Potential consequences of exploitation

### Technical Details
- **Vulnerability Descriptions**: Detailed technical explanations
- **Proof of Concept**: Step-by-step exploitation procedures
- **Evidence**: Screenshots, logs, and command output
- **CVSS Scores**: Standardized vulnerability ratings

### Remediation Recommendations
- **Immediate Actions**: Critical fixes requiring urgent attention
- **Short-term Solutions**: Fixes to implement within 30 days
- **Long-term Improvements**: Strategic security enhancements
- **Compensating Controls**: Temporary risk mitigation measures

## Conclusion

Effective penetration testing requires a systematic approach, proper tooling, and comprehensive reporting. Regular testing helps organizations identify and address security weaknesses before they can be exploited by malicious actors.`,
      },
      {
        filename: "incident-response/playbook.md",
        content: `---
title: "Incident Response Playbook"
author: "CSIRT Team"
date: "2024-01-25"
category: "Incident Response"
tags: ["incident-response", "playbook", "containment", "forensics"]
---

# Incident Response Playbook

## Preparation Phase

### Team Structure and Roles

#### Incident Commander
- **Responsibilities**: Overall response coordination and decision-making
- **Authority**: Resource allocation and external communication approval
- **Skills Required**: Leadership, communication, technical understanding
- **Contact Information**: 24/7 availability with multiple contact methods

#### Security Analyst
- **Responsibilities**: Technical investigation and analysis
- **Tasks**: Log analysis, forensic examination, threat assessment
- **Tools**: SIEM, forensic software, analysis platforms
- **Expertise**: Malware analysis, network forensics, system administration

#### Communications Lead
- **Responsibilities**: Internal and external communications
- **Stakeholders**: Management, legal, customers, media, regulators
- **Templates**: Pre-approved communication templates
- **Channels**: Multiple communication methods and backup systems

#### Legal Counsel
- **Responsibilities**: Legal and regulatory compliance
- **Areas**: Data breach laws, evidence handling, regulatory requirements
- **Contacts**: External legal firms, regulatory bodies
- **Documentation**: Legal hold procedures, compliance checklists

### Tools and Resources

#### Incident Response Toolkit
- **Forensic Imaging**: dd, FTK Imager, EnCase
- **Memory Analysis**: Volatility, Rekall, WinPmem
- **Network Analysis**: Wireshark, tcpdump, NetworkMiner
- **Malware Analysis**: IDA Pro, Ghidra, Cuckoo Sandbox

#### Communication Systems
- **Primary**: Secure messaging platform (Signal, Element)
- **Secondary**: Conference bridge with dial-in numbers
- **Emergency**: Satellite phones for critical situations
- **Documentation**: Shared workspace for real-time collaboration

## Detection and Analysis

### Initial Detection Sources

#### Security Monitoring
- **SIEM Alerts**: Correlation rules and anomaly detection
- **IDS/IPS**: Network intrusion detection systems
- **EDR**: Endpoint detection and response platforms
- **Log Analysis**: Centralized logging and analysis

#### User Reports
- **Phishing Reports**: Suspicious email notifications
- **System Issues**: Performance problems or unusual behavior
- **Data Concerns**: Unauthorized access or data exposure
- **Social Engineering**: Suspicious phone calls or requests

### Triage Process

#### Initial Assessment (15 minutes)
1. **Verify the Incident**: Confirm legitimate security event
2. **Classify Severity**: Use predefined severity matrix
3. **Assign Resources**: Allocate appropriate team members
4. **Establish Timeline**: Set initial response milestones

#### Severity Classification
- **Critical**: System compromise, data breach, service outage
- **High**: Attempted breach, malware infection, policy violation
- **Medium**: Suspicious activity, minor security event
- **Low**: False positive, informational alert

### Evidence Collection

#### Digital Forensics
\`\`\`bash
# Create forensic image
dd if=/dev/sda of=/mnt/evidence/disk_image.dd bs=4096 conv=noerror,sync

# Calculate hash for integrity
sha256sum /mnt/evidence/disk_image.dd > /mnt/evidence/disk_image.sha256

# Memory dump acquisition
sudo ./linpmem-2.1.post4 /mnt/evidence/memory.aff4

# Network packet capture
tcpdump -i eth0 -w /mnt/evidence/network_capture.pcap
\`\`\`

#### Chain of Custody
- **Documentation**: Detailed evidence handling log
- **Storage**: Secure, tamper-evident storage
- **Access Control**: Limited access with audit trail
- **Transportation**: Secure transfer procedures

## Containment, Eradication, and Recovery

### Short-term Containment

#### Network Isolation
- **System Quarantine**: Isolate affected systems from network
- **Network Segmentation**: Implement additional network controls
- **Access Restriction**: Disable compromised accounts
- **Traffic Blocking**: Block malicious IP addresses and domains

#### Evidence Preservation
\`\`\`bash
# Create system snapshot
virsh snapshot-create-as vm_name snapshot_name

# Preserve volatile data
ps aux > /evidence/running_processes.txt
netstat -tulpn > /evidence/network_connections.txt
lsof > /evidence/open_files.txt
\`\`\`

### Long-term Containment

#### System Hardening
- **Patch Management**: Apply security updates
- **Configuration Changes**: Implement security configurations
- **Access Controls**: Strengthen authentication and authorization
- **Monitoring Enhancement**: Increase logging and monitoring

#### Threat Intelligence
- **IOC Analysis**: Indicators of compromise research
- **Attribution**: Threat actor identification
- **TTPs**: Tactics, techniques, and procedures analysis
- **Threat Landscape**: Current threat environment assessment

### Eradication

#### Malware Removal
\`\`\`bash
# Scan for malware
clamscan -r --infected --remove /

# Remove persistence mechanisms
crontab -l | grep -v malicious_script | crontab -
systemctl disable malicious_service
\`\`\`

#### Vulnerability Remediation
- **Patch Installation**: Apply security patches
- **Configuration Fixes**: Correct misconfigurations
- **Access Revocation**: Remove unauthorized access
- **System Rebuilding**: Complete system reconstruction if necessary

### Recovery

#### System Restoration
- **Clean Backups**: Restore from verified clean backups
- **System Validation**: Verify system integrity and functionality
- **Gradual Restoration**: Phased return to normal operations
- **Monitoring**: Enhanced monitoring during recovery phase

#### Business Continuity
- **Service Restoration**: Prioritize critical business functions
- **User Communication**: Inform users of service status
- **Performance Monitoring**: Ensure system performance
- **Backup Verification**: Confirm backup system functionality

## Communication and Documentation

### Internal Communication

#### Stakeholder Notifications
- **Management**: Executive briefings and status updates
- **IT Teams**: Technical coordination and resource allocation
- **Business Units**: Impact assessment and recovery planning
- **Legal/Compliance**: Regulatory and legal implications

#### Communication Templates
\`\`\`
INCIDENT NOTIFICATION
Incident ID: INC-2024-001
Severity: HIGH
Status: ACTIVE
Summary: Suspected malware infection on critical server
Impact: Email services degraded
Actions: Containment in progress, investigation ongoing
Next Update: 2 hours
Contact: incident-commander@company.com
\`\`\`

### External Communication

#### Regulatory Reporting
- **Timeline Requirements**: Notification deadlines
- **Required Information**: Specific data elements
- **Submission Methods**: Approved reporting channels
- **Follow-up Requirements**: Additional reporting obligations

#### Customer Notification
- **Breach Notification**: Data breach disclosure requirements
- **Service Impact**: Service availability and performance
- **Remediation Steps**: Actions taken to address incident
- **Prevention Measures**: Steps to prevent recurrence

## Post-Incident Activities

### Lessons Learned

#### After-Action Review
- **Timeline Analysis**: Detailed incident timeline
- **Response Effectiveness**: What worked well
- **Improvement Areas**: What could be improved
- **Resource Adequacy**: Staffing and tool effectiveness

#### Process Improvements
- **Playbook Updates**: Revise procedures based on experience
- **Tool Enhancements**: Improve detection and response capabilities
- **Training Needs**: Identify skill gaps and training requirements
- **Communication Improvements**: Enhance notification procedures

### Metrics and KPIs

#### Response Metrics
- **Mean Time to Detection (MTTD)**: Average time to identify incidents
- **Mean Time to Response (MTTR)**: Average time to begin response
- **Mean Time to Recovery (MTTR)**: Average time to restore services
- **False Positive Rate**: Percentage of false alarms

#### Effectiveness Metrics
- **Containment Success**: Percentage of successful containments
- **Recovery Time**: Time to full operational recovery
- **Cost Impact**: Financial impact of incidents
- **Stakeholder Satisfaction**: Internal and external satisfaction ratings

## Legal and Regulatory Considerations

### Data Breach Laws
- **GDPR**: European Union data protection regulation
- **CCPA**: California Consumer Privacy Act
- **HIPAA**: Health Insurance Portability and Accountability Act
- **SOX**: Sarbanes-Oxley Act requirements

### Evidence Handling
- **Chain of Custody**: Proper evidence documentation
- **Legal Hold**: Preservation of relevant documents
- **Expert Testimony**: Preparation for legal proceedings
- **Disclosure Requirements**: Legal and regulatory disclosure obligations

## Conclusion

Effective incident response requires preparation, coordination, and continuous improvement. This playbook provides a framework for responding to security incidents while ensuring legal compliance and business continuity.`,
      },
    ]

    // Create subdirectories
    const subfolders = ["penetration-testing", "incident-response", "malware-analysis", "threat-intelligence"]
    subfolders.forEach((subfolder) => {
      const subfolderPath = path.join(this.notesDirectory, subfolder)
      if (!fs.existsSync(subfolderPath)) {
        fs.mkdirSync(subfolderPath, { recursive: true })
      }
    })

    // Write sample notes
    sampleNotes.forEach((note) => {
      const filePath = path.join(this.notesDirectory, note.filename)
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, note.content, "utf8")
      }
    })
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastScan > this.CACHE_DURATION
  }

  private generateTableOfContents(content: string): TableOfContentsItem[] {
    const headings: TableOfContentsItem[] = []
    const lines = content.split("\n")

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const match = line.match(/^(#{1,6})\s+(.+)$/)

      if (match) {
        const level = match[1].length
        const title = match[2].trim()
        const anchor = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")

        headings.push({
          id: `heading-${i}`,
          title,
          level,
          anchor,
        })
      }
    }

    return this.buildTocHierarchy(headings)
  }

  private buildTocHierarchy(headings: TableOfContentsItem[]): TableOfContentsItem[] {
    const result: TableOfContentsItem[] = []
    const stack: TableOfContentsItem[] = []

    for (const heading of headings) {
      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop()
      }

      if (stack.length === 0) {
        result.push(heading)
      } else {
        const parent = stack[stack.length - 1]
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(heading)
      }

      stack.push(heading)
    }

    return result
  }

  private extractImages(content: string): string[] {
    const images: string[] = []
    const imageRegex = /!\[([^\]]*)\]$$([^)]+)$$/g
    let match

    while ((match = imageRegex.exec(content)) !== null) {
      images.push(match[2])
    }

    return images
  }

  private processImages(content: string, noteSlug: string): string {
    // Create note-specific image directory
    const noteImageDir = path.join(this.imagesDirectory, noteSlug)
    if (!fs.existsSync(noteImageDir)) {
      fs.mkdirSync(noteImageDir, { recursive: true })
    }

    // Process image references in content
    return content.replace(/!\[([^\]]*)\]$$([^)]+)$$/g, (match, alt, src) => {
      // Skip if already a web URL
      if (src.startsWith("http://") || src.startsWith("https://")) {
        return match
      }

      // Skip if already in correct format
      if (src.startsWith("/images/notes/")) {
        return match
      }

      // Convert relative paths to absolute paths
      const imageName = path.basename(src)
      const newImagePath = `/images/notes/${noteSlug}/${imageName}`

      return `![${alt}](${newImagePath})`
    })
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  private generateExcerpt(content: string, maxLength = 200): string {
    const plainText = content
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")
      .replace(/!\[([^\]]*)\]$$[^)]+$$/g, "")
      .replace(/\n+/g, " ")
      .trim()

    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
  }

  private scanNotesDirectory(): LocalNote[] {
    if (!this.shouldRefreshCache() && this.cache.size > 0) {
      return Array.from(this.cache.values())
    }

    const notes: LocalNote[] = []
    this.cache.clear()

    try {
      this.scanDirectoryRecursive(this.notesDirectory, "", notes)
      this.lastScan = Date.now()
    } catch (error) {
      console.error("Error scanning notes directory:", error)
    }

    return notes
  }

  private scanDirectoryRecursive(dirPath: string, relativePath: string, notes: LocalNote[]): void {
    if (!fs.existsSync(dirPath)) {
      return
    }

    const items = fs.readdirSync(dirPath)

    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      const itemRelativePath = relativePath ? path.join(relativePath, item) : item

      // Skip hidden files and directories
      if (item.startsWith(".")) {
        continue
      }

      const stats = fs.statSync(itemPath)

      if (stats.isDirectory()) {
        this.scanDirectoryRecursive(itemPath, itemRelativePath, notes)
      } else if (item.endsWith(".md") || item.endsWith(".markdown")) {
        try {
          const content = fs.readFileSync(itemPath, "utf8")
          const { data: frontmatter, content: markdownContent } = matter(content)
          const slug = path.basename(item, path.extname(item))
          const title = frontmatter.title || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          const subfolder = relativePath ? path.dirname(itemRelativePath) : undefined

          // Process images in content
          const processedContent = this.processImages(markdownContent, slug)
          const wordCount = processedContent.split(/\s+/).length

          const note: LocalNote = {
            id: itemRelativePath.replace(/\.(md|markdown)$/, "").replace(/[/\\]/g, "-"),
            title,
            slug,
            content: processedContent,
            excerpt: this.generateExcerpt(processedContent),
            filePath: item,
            relativePath: itemRelativePath,
            lastModified: stats.mtime.toISOString(),
            category: frontmatter.category,
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            subfolder,
            tableOfContents: this.generateTableOfContents(processedContent),
            frontmatter,
            images: this.extractImages(processedContent),
            wordCount,
            readTime: this.calculateReadTime(processedContent),
          }

          notes.push(note)
          this.cache.set(note.id, note)
        } catch (error) {
          console.error("Error processing markdown file:", itemRelativePath, error)
        }
      }
    }
  }

  // Public methods
  async getAllNotes(): Promise<LocalNote[]> {
    return this.scanNotesDirectory().sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
    )
  }

  async getNoteBySlug(slug: string): Promise<LocalNote | null> {
    const notes = this.scanNotesDirectory()
    return notes.find((note) => note.slug === slug || note.id === slug) || null
  }

  async searchNotes(query: string): Promise<LocalNote[]> {
    if (!query.trim()) return []

    const notes = this.scanNotesDirectory()
    const queryLower = query.toLowerCase()

    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(queryLower) ||
        note.content.toLowerCase().includes(queryLower) ||
        note.tags.some((tag) => tag.toLowerCase().includes(queryLower)) ||
        (note.category && note.category.toLowerCase().includes(queryLower)) ||
        (note.excerpt && note.excerpt.toLowerCase().includes(queryLower))
      )
    })
  }

  async getCategories(): Promise<string[]> {
    const notes = this.scanNotesDirectory()
    const categories = new Set<string>()

    notes.forEach((note) => {
      if (note.category) {
        categories.add(note.category)
      }
    })

    return Array.from(categories).sort()
  }

  async getTags(): Promise<string[]> {
    const notes = this.scanNotesDirectory()
    const tags = new Set<string>()

    notes.forEach((note) => {
      note.tags.forEach((tag) => tags.add(tag))
    })

    return Array.from(tags).sort()
  }

  async getSubfolders(): Promise<string[]> {
    const notes = this.scanNotesDirectory()
    const subfolders = new Set<string>()

    notes.forEach((note) => {
      if (note.subfolder) {
        subfolders.add(note.subfolder)
      }
    })

    return Array.from(subfolders).sort()
  }

  async getMetadata(): Promise<NotesMetadata> {
    const notes = this.scanNotesDirectory()
    const categories = await this.getCategories()
    const tags = await this.getTags()
    const subfolders = await this.getSubfolders()
    const lastUpdated = notes.length > 0 ? notes[0].lastModified : new Date().toISOString()

    return {
      totalNotes: notes.length,
      categories,
      tags,
      subfolders,
      lastUpdated,
    }
  }

  // Image processing utilities
  async processNoteImages(noteSlug: string, imageFiles: File[]): Promise<string[]> {
    const noteImageDir = path.join(this.imagesDirectory, noteSlug)
    if (!fs.existsSync(noteImageDir)) {
      fs.mkdirSync(noteImageDir, { recursive: true })
    }

    const processedImages: string[] = []

    for (const file of imageFiles) {
      try {
        const fileName = file.name
        const filePath = path.join(noteImageDir, fileName)

        // In a real implementation, you would save the file here
        // For now, we'll just track the expected path
        const webPath = `/images/notes/${noteSlug}/${fileName}`
        processedImages.push(webPath)
      } catch (error) {
        console.error(`Error processing image ${file.name}:`, error)
      }
    }

    return processedImages
  }
}

export const localNotesManager = new LocalNotesManager()
