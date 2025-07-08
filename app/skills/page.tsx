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
        { name: "SIEM Management", level: 90, tools: ["QRadar", "Splunk", "Wazuh"] },
        { name: "Threat Hunting", level: 85, tools: ["MITRE ATT&CK", "Sigma Rules", "YARA"] },
        { name: "Incident Response", level: 88, tools: ["DFIR", "Volatility", "Autopsy"] },
        { name: "Log Analysis", level: 92, tools: ["ELK Stack", "Graylog", "Fluentd"] },
      ],
    },
    {
      category: "Penetration Testing",
      skills: [
        { name: "Web Application Testing", level: 85, tools: ["Burp Suite", "OWASP ZAP", "SQLMap"] },
        { name: "Network Penetration", level: 80, tools: ["Nmap", "Metasploit", "Nessus"] },
        { name: "Wireless Security", level: 75, tools: ["Aircrack-ng", "Kismet", "Reaver"] },
        { name: "Social Engineering", level: 70, tools: ["SET", "Gophish", "BeEF"] },
      ],
    },
    {
      category: "Programming & Scripting",
      skills: [
        { name: "Python", level: 88, tools: ["Scapy", "Requests", "Pandas"] },
        { name: "PowerShell", level: 82, tools: ["Empire", "PowerSploit", "BloodHound"] },
        { name: "Bash/Shell", level: 85, tools: ["Linux", "Automation", "Scripting"] },
        { name: "SQL", level: 78, tools: ["MySQL", "PostgreSQL", "SQLite"] },
      ],
    },
    {
      category: "Forensics & Analysis",
      skills: [
        { name: "Malware Analysis", level: 80, tools: ["IDA Pro", "Ghidra", "x64dbg"] },
        { name: "Memory Forensics", level: 75, tools: ["Volatility", "Rekall", "WinDbg"] },
        { name: "Network Forensics", level: 83, tools: ["Wireshark", "NetworkMiner", "Tcpdump"] },
        { name: "Reverse Engineering", level: 72, tools: ["Radare2", "Binary Ninja", "OllyDbg"] },
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
        <main className="container mx-auto px-4 py-8">
          <div className="bg-black/90 border border-green-400 p-6 rounded-lg">
            <div className="text-green-400 text-xl font-bold mb-6">
              $ grep -r skills --include="*.sh" --include="*.py" --include="*.c"
            </div>
            <div className="text-green-300 mb-6">Scanning skill database and proficiency levels...</div>

            <div className="space-y-8">
              {skillCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-black/80 border border-green-400 p-6 rounded">
                  <h2 className="text-green-400 text-lg font-bold mb-6"># {category.category}</h2>

                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-400 font-medium">{skill.name}</span>
                          <span className="text-green-300 text-sm">{skill.level}%</span>
                        </div>

                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {skill.tools.map((tool, toolIndex) => (
                            <span
                              key={toolIndex}
                              className="px-2 py-1 bg-green-400/10 border border-green-400 text-green-400 text-xs rounded"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
