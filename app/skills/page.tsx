"use client"

import { MatrixRain } from "@/components/matrix-rain"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useState, useEffect } from "react"

export default function SkillsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const skillCategories = [
    {
      category: "Security Operations",
      skills: [
        { name: "Detection Engineering", level: 90, tools: ["QRadar", "LogRhythm", "Wazuh"] },
        { name: "Threat Hunting", level: 90, tools: ["MITRE ATT&CK", "Sigma Rules", "YARA"] },
        { name: "Incident Response", level: 88, tools: ["DFIR", "Volatility", "Autopsy"] },
        { name: "Log Analysis", level: 92, tools: ["ELK Stack", "Graylog", "Fluentd"] },
      ],
    },
    {
      category: "Penetration Testing",
      skills: [
        { name: "Web Application Testing", level: 85, tools: ["Burp Suite", "OWASP ZAP", "Nuclei"] },
        { name: "Network Penetration Testing", level: 80, tools: ["Nmap", "Metasploit", "C2 Framework"] },
        { name: "Vulnerability Assessment", level: 90, tools: ["Acunetix", "Nessus", "NetSparker"] },
        { name: "Mobile Penetration Testing", level: 70, tools: ["OWASP Mobile Security Testing", "OWASP MAST", "OWASP MSTG"] },
      ],
    },
    {
      category: "Programming & Scripting",
      skills: [
        { name: "Python", level: 88, tools: ["Scapy", "Requests", "Pandas"] },
        { name: "PowerShell", level: 82, tools: ["Empire", "PowerSploit", "BloodHound"] },
        { name: "Bash/Shell", level: 85, tools: ["Linux", "Automation", "Scripting"] }, 
      ],
    },
    {
      category: "Forensics & Analysis",
      skills: [
        { name: "Malware Analysis", level: 80, tools: ["IDA Pro", "Ghidra", "x64dbg"] },
        { name: "Memory Forensics", level: 75, tools: ["Volatility", "MemProcFS"] },
        { name: "Network Forensics", level: 83, tools: ["Wireshark", "NetworkMiner", "Tcpdump"] },
        { name: "Endpoint Forensics", level: 85, tools: ["EZTools", "KAPE", "FTK Imager"] },
      ],
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <LoadingSpinner message="Scanning skill database..." />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-black/90 border border-green-400 p-4 md:p-6 rounded-lg mb-8">
            <h1 className="text-green-400 text-2xl md:text-3xl font-bold">Skills &amp; Proficiencies</h1>
            <p className="text-green-300/70 text-sm mt-2">$ grep -r skills --include=&quot;*.sh&quot; --include=&quot;*.py&quot;</p>
          </div>

          <div className="space-y-8">
            {skillCategories.map((category, categoryIndex) => (
              <section key={categoryIndex} aria-labelledby={`category-title-${categoryIndex}`}>
                <div className="bg-black/80 border border-green-400/50 p-4 md:p-6 rounded-lg">
                  <h2 id={`category-title-${categoryIndex}`} className="text-green-400 text-xl font-bold mb-6"># {category.category}</h2>

                  <div className="space-y-6">
                    {category.skills.map((skill, skillIndex) => (
                      <article key={skillIndex} aria-labelledby={`skill-name-${categoryIndex}-${skillIndex}`}>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 id={`skill-name-${categoryIndex}-${skillIndex}`} className="text-cyan-400 font-medium text-base">{skill.name}</h3>
                            <span className="text-green-300 text-sm font-mono">{skill.level}%</span>
                          </div>

                          <div
                            role="progressbar"
                            aria-valuenow={skill.level}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-labelledby={`skill-name-${categoryIndex}-${skillIndex}`}
                            className="w-full bg-green-900/50 rounded-full h-2.5 overflow-hidden"
                          >
                            <div
                              className="bg-green-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {skill.tools.map((tool, toolIndex) => (
                              <span
                                key={toolIndex}
                                className="px-2 py-1 bg-green-400/10 border border-green-400/30 text-green-300 text-xs rounded-md"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
