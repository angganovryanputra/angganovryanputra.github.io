"use client"

import { MatrixRain } from "@/components/matrix-rain"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useState, useEffect } from "react"  

export default function CertificationsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1300)
    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500 text-green-950 border-green-400"
      case "Studying":
        return "bg-yellow-400 text-yellow-950 border-yellow-300"
      case "Planned":
        return "bg-cyan-400 text-cyan-950 border-cyan-300"
      case "Expired":
        return "bg-red-500 text-red-950 border-red-400"
      default:
        return "bg-gray-500 text-gray-950 border-gray-400"
    }
  }

  const certifications = [
    {
      name: "Certified Hacking Forensic Investigator (CHFI)",
      issuer: "EC-Council",
      issueDate: "Jun 2025",
      expiryDate: "Jul 2026",
      credentialId: "ECC4165038792",
      status: "Active",
      description:
        "Advanced digital forensics and incident response certification focusing on forensic investigation techniques, evidence handling, and cyber crime analysis.",
      skills: [
        "Digital Forensics",
        "Incident Response",
        "Evidence Analysis",
        "Cyber Crime Investigation",
        "Forensic Tools",
      ],
    },
    {
      name: "CompTIA PenTest+ ce Certification",
      issuer: "CompTIA",
      issueDate: "Dec 2024",
      expiryDate: "Dec 2027",
      credentialId: "-",
      status: "Active",
      description:
        "Comprehensive penetration testing certification covering planning, scoping, vulnerability identification, and reporting of penetration test activities.",
      skills: ["Penetration Testing", "Vulnerability Assessment", "Security Testing", "Risk Analysis", "Reporting"],
    },
    {
      name: "CompTIA Security+ ce Certification",
      issuer: "CompTIA",
      issueDate: "Dec 2024",
      expiryDate: "Dec 2027",
      credentialId: "-",
      status: "Active",
      description:
        "Foundation-level cybersecurity certification covering core security concepts, risk management, and security technologies.",
      skills: ["Network Security", "Risk Management", "Cryptography", "Identity Management", "Security Operations"],
    },
    {
      name: "Certified Network Security Practitioner",
      issuer: "The SecOps Group",
      issueDate: "Mar 2023",
      expiryDate: null,
      credentialId: "7158301",
      status: "Active",
      description:
        "Specialized certification in network security practices, focusing on network defense, monitoring, and incident response.",
      skills: [
        "Network Security",
        "Network Monitoring",
        "Intrusion Detection",
        "Firewall Management",
        "Network Defense",
      ],
    },
    {
      name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals",
      issuer: "Microsoft",
      issueDate: "Feb 2023",
      expiryDate: null,
      credentialId: "MS-SC900-2023-001",
      status: "Active",
      description:
        "Foundational certification covering Microsoft security, compliance, and identity solutions and services.",
      skills: ["Microsoft Security", "Identity Management", "Compliance", "Azure Security", "Microsoft 365 Security"],
    },
    {
      name: "Certified AppSec Practitioner",
      issuer: "The SecOps Group",
      issueDate: "Dec 2022",
      expiryDate: null,
      credentialId: "6880043",
      status: "Active",
      description:
        "Application security certification focusing on secure coding practices, application testing, and vulnerability management.",
      skills: ["Application Security", "Secure Coding", "OWASP", "Code Review", "Security Testing"],
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navigation />
          <main className="p-4 sm:p-6 lg:p-8">
            <LoadingSpinner message="Loading certifications..." />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-green-400 min-h-screen font-mono">
      <MatrixRain />
      <div className="relative z-10">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-black/90 border border-green-400 p-4 md:p-6 rounded-lg mb-8">
            <h1 className="text-green-400 text-2xl md:text-3xl font-bold">Certifications & Credentials</h1>
            <p className="text-green-300/70 text-sm mt-2">A showcase of my professional certifications and qualifications.</p>
          </div>

          <section aria-labelledby="certification-list-title">
            <h2 id="certification-list-title" className="sr-only">List of Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <article
                  key={index}
                  className="bg-black/80 border border-green-400/50 rounded-lg p-4 md:p-5 relative overflow-hidden transform hover:scale-[1.02] hover:border-green-400 transition-all duration-300 flex flex-col"
                >
                  <div className="flex-grow">
                    <div className="mb-4">
                      <h3 className="text-green-300 font-bold text-base md:text-lg leading-tight">{cert.name}</h3>
                      <p className="text-cyan-400 text-xs md:text-sm font-medium mt-1">by {cert.issuer}</p>
                    </div>

                    <div className="flex justify-between items-center mb-4 text-xs">
                      <div className="text-green-300/80">
                        {cert.issueDate}
                        {cert.expiryDate && ` - ${cert.expiryDate}`}
                      </div>
                      <span className={`px-2 py-1 border text-xs rounded ${getStatusColor(cert.status)}`}>
                        {cert.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-green-300 text-xs md:text-sm leading-relaxed mb-4">{cert.description}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="text-cyan-400 text-xs font-bold mb-2">Key Skills & Competencies:</div>
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {cert.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-green-400/10 border border-green-400 text-green-400 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {cert.expiryDate && (
                      <div className="pt-2 border-t border-green-400/30">
                        <div className="text-yellow-400 text-xs">⏰ Expires: {cert.expiryDate}</div>
                      </div>
                    )}
                  </div>

                  <div className="absolute left-0 top-0 w-1 h-full bg-green-400"></div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="certification-summary-title" className="mt-8">
            <div className="bg-black/80 border border-green-400 p-4 md:p-6 rounded">
              <h2 id="certification-summary-title" className="text-green-400 text-lg font-bold mb-4"># Certification Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-green-300 text-sm">Total Certifications</div>
                  <div className="text-green-400 text-2xl font-bold">{certifications.length}</div>
                </div>
                <div>
                  <div className="text-green-300 text-sm">Active Certifications</div>
                  <div className="text-green-400 text-2xl font-bold">
                    {certifications.filter((cert) => cert.status === "Active").length}
                  </div>
                </div>
                <div>
                  <div className="text-green-300 text-sm">Latest Achievement</div>
                  <div className="text-green-400 text-sm font-bold">CHFI (2025)</div>
                </div>
              </div>

              <div className="text-green-300 space-y-2 text-xs md:text-sm">
                <div>{"> Focus Areas: Digital Forensics, Penetration Testing, Threat Hunting"}</div>
                <div>{"> Continuous Education: Regular certification renewals and updates"}</div>
                <div>{"> Industry Recognition: EC-Council, CompTIA, Microsoft, SecOps Group"}</div>
                <div>{"> Next Goals: CRTA, OSCP, etc"}</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
