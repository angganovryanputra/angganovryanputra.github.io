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
      logo: "/images/cert-chfi.png",
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
      logo: null,
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
      logo: null,
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
      logo: "/images/cert-cnsp.png",
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
      logo: "/images/cert-microsoft-appsec.png",
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
      logo: "/images/cert-microsoft-appsec.png",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-400 border-green-400 bg-green-400/10"
      case "Studying":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/10"
      case "Planned":
        return "text-cyan-400 border-cyan-400 bg-cyan-400/10"
      case "Expired":
        return "text-red-400 border-red-400 bg-red-400/10"
      default:
        return "text-green-400 border-green-400 bg-green-400/10"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <LoadingSpinner message="Searching certification database..." />
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
          <div className="bg-black/90 border border-green-400 p-4 md:p-6 rounded-lg">
            <div className="text-green-400 text-lg md:text-xl font-bold mb-6">
              $ find ./certifications -name "*.cert" -type f
            </div>
            <div className="text-green-300 mb-6 text-sm md:text-base">
              Searching certification database from LinkedIn profile...
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-black/80 border border-green-400 p-4 md:p-6 rounded relative hover:border-green-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-green-400 text-sm md:text-lg font-bold mb-1 pr-2">{cert.name}</h3>
                      <p className="text-cyan-400 text-xs md:text-sm mb-1">{cert.issuer}</p>
                      {cert.credentialId && <p className="text-green-300 text-xs">ID: {cert.credentialId}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-green-300 text-xs md:text-sm mb-1">
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
                </div>
              ))}
            </div>

            <div className="bg-black/80 border border-green-400 p-4 md:p-6 rounded mt-8">
              <h2 className="text-green-400 text-lg font-bold mb-4"># Certification Summary</h2>
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
          </div>
        </main>
      </div>
    </div>
  )
}
