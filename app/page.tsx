"use client"

import { useEffect, useState } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { Navigation } from "@/components/navigation"
import { EnhancedLoading } from "@/components/enhanced-loading"
import { Shield, Terminal, Code, BookOpen, Award, Briefcase, Zap, Eye, Target } from "lucide-react"

export default function HomePage() {
  const [showContent, setShowContent] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState("Initializing security protocols...")
  const [animatedStats, setAnimatedStats] = useState({ experience: 0, projects: 0, certifications: 0 })

  useEffect(() => {
    const stages = [
      { message: "Initializing security protocols...", duration: 1200, progress: 15 },
      { message: "Loading threat intelligence database...", duration: 1000, progress: 30 },
      { message: "Establishing secure connection...", duration: 1100, progress: 50 },
      { message: "Mounting encrypted filesystems...", duration: 900, progress: 70 },
      { message: "Authenticating user credentials...", duration: 800, progress: 85 },
      { message: "Starting security services...", duration: 700, progress: 95 },
      { message: "System ready for operation.", duration: 600, progress: 100 },
    ]

    let currentStage = 0
    let currentProgress = 0

    const progressInterval = setInterval(() => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage]
        setLoadingStage(stage.message)

        // Smooth progress animation
        if (currentProgress < stage.progress) {
          currentProgress += Math.ceil((stage.progress - currentProgress) / 8)
          setLoadingProgress(Math.min(currentProgress, stage.progress))
        } else {
          // Move to next stage after a brief pause
          setTimeout(() => {
            currentStage++
          }, stage.duration)
        }
      } else {
        clearInterval(progressInterval)
        // Add a final dramatic pause before showing content
        setTimeout(() => setShowContent(true), 1000)
      }
    }, 100) // Smoother animation with shorter intervals

    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    if (showContent) {
      // Staggered animation for stats
      const animateStats = () => {
        const targets = { experience: 3, projects: 50, certifications: 7 }
        const current = { experience: 0, projects: 0, certifications: 0 }
        const delays = { experience: 0, projects: 500, certifications: 1000 }

        Object.keys(targets).forEach((key) => {
          setTimeout(
            () => {
              const interval = setInterval(() => {
                const target = targets[key as keyof typeof targets]
                const currentVal = current[key as keyof typeof current]
                if (currentVal < target) {
                  current[key as keyof typeof current] = Math.min(currentVal + Math.ceil(target / 15), target)
                  setAnimatedStats({ ...current })
                } else {
                  clearInterval(interval)
                }
              }, 100)
            },
            delays[key as keyof typeof delays],
          )
        })
      }
      setTimeout(animateStats, 1200)
    }
  }, [showContent])

  if (!showContent) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 py-4 md:py-8">
            <EnhancedLoading
              message={loadingStage}
              subMessage="Securing digital perimeter and initializing defense systems..."
              progress={loadingProgress}
              showProgress={true}
              variant="terminal"
              size="lg"
            />
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
        <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
          <div className="space-y-8 md:space-y-12">
            {/* Enhanced Hero Section */}
            <div className="text-center space-y-6 md:space-y-8">
              <div className="flex items-center justify-center mb-6 md:mb-8">
                <div className="relative">
                  {/* Main shield with enhanced animation */}
                  <Shield className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-green-400 animate-pulse relative z-10" />

                  {/* Outer ring - slow pulse */}
                  <div
                    className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-2 border-green-400/20 rounded-full animate-ping"
                    style={{ animationDuration: "3s" }}
                  ></div>

                  {/* Middle ring - medium pulse */}
                  <div
                    className="absolute inset-1 w-14 h-14 md:w-18 md:h-18 lg:w-22 lg:h-22 border border-green-400/40 rounded-full animate-ping"
                    style={{ animationDuration: "2s", animationDelay: "0.5s" }}
                  ></div>

                  {/* Inner ring - fast pulse */}
                  <div
                    className="absolute inset-2 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border border-green-400/60 rounded-full animate-pulse"
                    style={{ animationDuration: "1.5s", animationDelay: "1s" }}
                  ></div>

                  {/* Core glow effect */}
                  <div
                    className="absolute inset-3 md:inset-4 w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-green-400/10 rounded-full animate-pulse blur-sm"
                    style={{ animationDuration: "2.5s" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-green-400">
                  <span className="inline-block animate-pulse">&gt;</span>
                  <span className="inline-block ml-1 md:ml-2">SYSTEM</span>
                  <span className="inline-block ml-1 md:ml-2">INITIALIZED</span>
                </h1>
                <div className="text-base sm:text-lg md:text-2xl text-green-400 font-semibold">
                  Angga Novryan Putra F.
                </div>
                <p className="text-sm sm:text-base md:text-xl text-green-300 max-w-3xl mx-auto leading-relaxed px-4">
                  Welcome to the digital realm of cybersecurity - Where defense meets offense in the eternal battle for
                  digital security. Specializing in threat detection, incident response, and penetration testing.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-4 md:space-x-6 text-green-400">
                {[
                  { Icon: Terminal, delay: "0s" },
                  { Icon: Code, delay: "0.2s" },
                  { Icon: Shield, delay: "0.4s" },
                  { Icon: Zap, delay: "0.6s" },
                ].map(({ Icon, delay }, index) => (
                  <div key={index} className="relative">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 animate-bounce" style={{ animationDelay: delay }} />
                    <div
                      className="absolute -inset-1 bg-green-400/20 rounded-full animate-ping opacity-30"
                      style={{ animationDelay: delay, animationDuration: "2s" }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Role Cards with responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                {
                  title: "Blue Team",
                  icon: Shield,
                  color: "blue",
                  gradient: "from-blue-900/20 to-black/80",
                  delay: "0s",
                  description: "Defensive Security Operations",
                  skills: ["Threat Hunting", "Digital Forensics", "Incident Response", "Threat Intelligence"],
                },
                {
                  title: "Red Team",
                  icon: Target,
                  color: "red",
                  gradient: "from-red-900/20 to-black/80",
                  delay: "0.2s",
                  description: "Offensive Security Testing",
                  skills: ["Penetration Testing", "Vulnerability Assessment", "Red Team Ops", "Secure Code Review"],
                },
                {
                  title: "Developer",
                  icon: Code,
                  color: "purple",
                  gradient: "from-purple-900/20 to-black/80",
                  delay: "0.4s",
                  description: "Security Tool Development",
                  skills: ["Python Automation", "Custom Tools", "API Integration"],
                },
                {
                  title: "Researcher",
                  icon: Eye,
                  color: "cyan",
                  gradient: "from-cyan-900/20 to-black/80",
                  delay: "0.6s",
                  description: "Continuous Learning & Research",
                  skills: ["Detection Engineering", "Malware Analysis"],
                },
              ].map((role, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${role.gradient} border border-${role.color}-400 p-4 md:p-6 rounded-lg hover:border-${role.color}-300 hover:shadow-lg hover:shadow-${role.color}-400/20 transition-all duration-300 group animate-fade-in-up`}
                  style={{ animationDelay: role.delay }}
                >
                  <div className="flex items-center mb-3 md:mb-4">
                    <div
                      className={`p-2 bg-${role.color}-400/10 rounded-lg mr-3 group-hover:bg-${role.color}-400/20 transition-colors`}
                    >
                      <role.icon className={`w-6 h-6 md:w-8 md:h-8 text-${role.color}-400 group-hover:animate-pulse`} />
                    </div>
                    <div className={`text-${role.color}-400 text-base md:text-lg font-bold`}>{role.title}</div>
                  </div>
                  <p className="text-green-300 text-xs md:text-sm mb-3">{role.description}</p>
                  <div className="space-y-1 text-xs text-green-300">
                    {role.skills.map((skill, skillIndex) => (
                      <div key={skillIndex}>• {skill}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Stats Section */}
            <div className="bg-gradient-to-r from-black/90 to-green-900/20 border border-green-400 p-4 md:p-6 lg:p-8 rounded-lg">
              <div className="text-green-400 text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6 flex items-center">
                <Terminal className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />$ cat system_metrics.json
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  {
                    icon: Briefcase,
                    title: "Experience",
                    value: `${animatedStats.experience}+ Years`,
                    subtitle: "In Cybersecurity",
                    detail: "Threat Hunting • Pentesting",
                  },
                  {
                    icon: Shield,
                    title: "Security Projects",
                    value: `${animatedStats.projects}+`,
                    subtitle: "Completed",
                    detail: "VAPT • Detection Rules • Automation Scripts",
                  },
                  {
                    icon: Award,
                    title: "Certifications",
                    value: `${animatedStats.certifications}`,
                    subtitle: "Active",
                    detail: "CySA+ • CHFI • PenTest+ • Security+",
                  },
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="flex items-center justify-center mb-3 md:mb-4">
                      <div className="p-2 md:p-3 bg-green-400/10 rounded-full group-hover:bg-green-400/20 transition-colors">
                        <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                      </div>
                    </div>
                    <div className="text-green-300 text-base md:text-lg mb-2">{stat.title}</div>
                    <div className="text-green-400 text-2xl md:text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-green-300/70 text-sm">{stat.subtitle}</div>
                    <div className="mt-2 text-xs text-green-400">{stat.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Quick Navigation */}
            <div className="bg-black/80 border border-green-400 p-4 md:p-6 lg:p-8 rounded-lg">
              <div className="text-green-400 text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6 flex items-center">
                <Code className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />$ ls -la portfolio/
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { href: "/experience", icon: Briefcase, label: "Experience", detail: "3+ Years" },
                  { href: "/skills", icon: Code, label: "Skills", detail: "Technical" },
                  { href: "/certifications", icon: Award, label: "Certifications", detail: "7 Active" },
                  { href: "/blog", icon: BookOpen, label: "Blog", detail: "Articles" },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex flex-col items-center p-3 md:p-4 border border-green-400/50 rounded-lg hover:border-green-400 hover:bg-green-400/5 transition-all group"
                  >
                    <item.icon className="w-6 h-6 md:w-8 md:h-8 text-green-400 mb-2 group-hover:animate-pulse" />
                    <span className="text-green-300 text-xs md:text-sm font-medium">{item.label}</span>
                    <span className="text-green-400/70 text-xs mt-1">{item.detail}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gradient-to-r from-green-900/20 to-black/80 border border-green-400 p-4 md:p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-green-400 text-base md:text-lg font-bold mb-2">Current Status</div>
                  <div className="text-green-300 text-sm md:text-base">
                    Lead SOC Analyst L2 at PT. Cynnex Integrasi Solusi
                  </div>
                  <div className="text-green-400/70 text-xs md:text-sm">
                    Leading security operation and threat detection initiatives.
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
