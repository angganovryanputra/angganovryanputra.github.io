"use client"

import { useState, useEffect } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ExperiencePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <LoadingSpinner message="Compiling professional timeline..." />
          </main>
        </div>
      </div>
    )
  }

  const experiences = [
    {
      title: "Security Engineer",
      company: "PT. Cynnex Integrasi Solusi (Cynnex)",
      period: "Feb 2025 - Present",
      duration: "6 months",
      location: "Jakarta, Indonesia",
      description:
        "Leading security engineering initiatives and implementing comprehensive security solutions. Responsible for security architecture design, threat modeling, and security controls implementation across enterprise infrastructure.",
      technologies: [
        "Analytical Skills",
        "SIEM",
        "Security Architecture",
        "Threat Modeling",
        "Risk Assessment",
        "Security Controls",
        "Compliance",
        "Incident Response",
        "Vulnerability Management",
      ],
      current: true,
    },
    {
      title: "Penetration Tester Leader",
      company: "PT. Cynnex Integrasi Solusi (Cynnex)",
      period: "Aug 2023 - Feb 2025",
      duration: "1 year 7 months",
      location: "Jakarta Raya, Indonesia",
      description:
        "Led penetration testing team and conducted comprehensive security assessments for enterprise clients. Specialized in vulnerability assessment, cyber threat hunting, and advanced persistent threat detection.",
      technologies: [
        "Vulnerability Assessment",
        "Cyber Threat Hunting (CTH)",
        "Penetration Testing",
        "Team Leadership",
        "Security Assessment",
        "Red Team Operations",
      ],
    },
    {
      title: "Security Operations Center Analyst L2",
      company: "PT. Cynnex Integrasi Solusi (Cynnex)",
      period: "Jan 2023 - Aug 2023",
      duration: "8 months",
      location: "Jakarta Raya, Indonesia",
      description:
        "Performed advanced security monitoring and incident response as L2 analyst. Managed SIEM platforms, developed custom detection rules, and conducted threat hunting activities to identify and mitigate security threats.",
      technologies: [
        "Analytical Skills",
        "SIEM",
        "Incident Response",
        "Threat Detection",
        "Log Analysis",
        "Security Monitoring",
        "Threat Hunting",
        "Forensics",
        "Malware Analysis",
      ],
    },
    {
      title: "Information Technology Technical Support",
      company: "Badan Pusat Statistik",
      period: "Dec 2016 - May 2017",
      duration: "6 months",
      location: "Samarinda, Kalimantan Timur, Indonesia",
      description:
        "Provided technical support for IT infrastructure and network systems during internship program. Gained foundational experience in network engineering and system administration.",
      technologies: ["Network Engineering", "Technical Support", "System Administration", "Troubleshooting"],
      internship: true,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-black/90 border border-green-400 p-4 md:p-6 rounded-lg mb-8">
            <h1 className="text-green-400 text-2xl md:text-3xl font-bold">Professional Experience</h1>
            <p className="text-green-300/70 text-sm mt-2">A timeline of my career in cybersecurity.</p>
          </div>

          <section aria-labelledby="experience-timeline-title">
            <h2 id="experience-timeline-title" className="sr-only">Experience Timeline</h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <article
                  key={index}
                  className="bg-black/80 border border-green-400/50 p-4 md:p-6 rounded-lg relative overflow-hidden transform hover:scale-[1.01] hover:border-green-400 transition-all duration-300"
                >
                  {exp.current && (
                    <div className="absolute top-4 right-4 bg-green-500 text-green-950 text-xs font-bold px-2 py-1 rounded">Current</div>
                  )}
                  <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-3">
                    <div>
                      <h3 className="text-green-300 font-bold text-lg md:text-xl">{exp.title}</h3>
                      <p className="text-cyan-400 font-medium text-sm">{exp.company}</p>
                      <p className="text-green-300/70 text-xs mt-1">{exp.location}</p>
                    </div>
                    <div className="text-right mt-2 lg:mt-0">
                      <div className="text-green-300 text-sm">{exp.period}</div>
                      <div className="text-green-400 text-xs font-bold">{exp.duration}</div>
                    </div>
                  </div>

                  <p className="text-green-300 mb-4 leading-relaxed">{exp.description}</p>

                  <div className="space-y-2">
                    <div className="text-cyan-400 text-sm font-bold">Key Skills & Technologies:</div>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-green-400/10 border border-green-400 text-green-400 text-xs rounded hover:bg-green-400/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="absolute left-0 top-0 w-1 h-full bg-green-400"></div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="career-summary-title" className="mt-8">
            <div className="bg-black/80 border border-green-400 p-6 rounded">
              <h2 id="career-summary-title" className="text-green-400 text-lg font-bold mb-4"># Career Progression Summary</h2>
              <div className="text-green-300 space-y-2 text-sm">
                <div>{'> Total Experience: 3+ years in cybersecurity'}</div>
                <div>{'> Current Focus: Security Engineering & Architecture'}</div>
                <div>{'> Leadership Experience: Penetration Testing Team Lead'}</div>
                <div>{'> Core Expertise: SIEM, Threat Hunting, Vulnerability Assessment'}</div>
                <div>{'> Career Growth: Technical Support → SOC Analyst → Pentest Leader → Security Engineer'}</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
