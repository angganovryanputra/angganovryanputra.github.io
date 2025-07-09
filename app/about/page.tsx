"use client"

import { MatrixRain } from "@/components/matrix-rain"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useState, useEffect } from "react"
import {
  Shield,
  Terminal,
  Code,
  Eye,
  Target,
  Users,
  MapPin,
  Calendar,
  Globe,
  Award,
  Briefcase,
  BookOpen,
  Zap,
  Github,
  Instagram,
  Linkedin,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [activeRole, setActiveRole] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <LoadingSpinner message="Loading Profile..." />
          </main>
        </div>
      </div>
    )
  }

  const roles = [
    {
      title: "Blue Team Specialist",
      icon: Shield,
      color: "blue",
      description:
        "Defensive security operations focusing on threat detection, incident response, and security monitoring.",
      skills: ["SOC Analysis", "SIEM Management", "Threat Hunting", "Incident Response", "Log Analysis"],
      experience: "3+ years in SOC operations and security monitoring",
      gradient: "from-blue-900/30 to-blue-600/10",
    },
    {
      title: "Red Team Operator",
      icon: Target,
      color: "red",
      description:
        "Offensive security testing through penetration testing, vulnerability assessment, and security auditing.",
      skills: [
        "Penetration Testing",
        "Vulnerability Assessment",
        "Social Engineering",
        "Red Team Operations",
        "Security Auditing",
      ],
      experience: "2+ years in penetration testing and security assessments",
      gradient: "from-red-900/30 to-red-600/10",
    },
    {
      title: "Security Developer",
      icon: Code,
      color: "purple",
      description: "Developing security tools, automation scripts, and custom solutions for cybersecurity challenges.",
      skills: ["Python Development", "Security Automation", "API Integration", "Custom Tools", "Script Development"],
      experience: "Continuous development of security tools and automation",
      gradient: "from-purple-900/30 to-purple-600/10",
    },
    {
      title: "Security Researcher",
      icon: Eye,
      color: "cyan",
      description: "Researching emerging threats, analyzing malware, and contributing to the cybersecurity community.",
      skills: ["Threat Intelligence", "Malware Analysis", "Security Research", "Documentation", "Knowledge Sharing"],
      experience: "Ongoing research and community contributions",
      gradient: "from-cyan-900/30 to-cyan-600/10",
    },
  ]

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/angganovryanputra",
      color: "text-gray-400 hover:text-gray-300",
      bgColor: "hover:bg-gray-400/10",
      description: "View my code repositories and projects",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/angganovryanputra",
      color: "text-blue-400 hover:text-blue-300",
      bgColor: "hover:bg-blue-400/10",
      description: "Connect with me professionally",
    },
    {
      name: "X (Twitter)",
      icon: XIcon,
      url: "https://x.com/angganvryn",
      color: "text-white hover:text-gray-300",
      bgColor: "hover:bg-white/10",
      description: "Follow my thoughts and updates",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/angga.npf",
      color: "text-pink-400 hover:text-pink-300",
      bgColor: "hover:bg-pink-400/10",
      description: "See my personal moments",
    },
  ]

  const currentRole = roles[activeRole]

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-black/90 border border-green-400 p-6 rounded-lg">
              <div className="text-green-400 text-xl font-bold mb-6 flex items-center">
                <Terminal className="w-6 h-6 mr-3" />$ cat about.md
              </div>
              <div className="text-green-300 mb-4">Displaying personal and professional information...</div>
            </div>

            {/* Personal Information & Bio */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-green-900/20 to-black/80 border border-green-400">
                <CardHeader>
                  <CardTitle className="text-green-400 text-xl font-bold flex items-center">
                    <Users className="w-5 h-5 mr-2" /># Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="text-cyan-400">Name:</span>
                    </div>
                    <span className="text-green-300 font-medium">Angga Novryan Putra F.</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="text-cyan-400">Current Role:</span>
                    </div>
                    <span className="text-green-300 font-medium">Lead SOC Analyst L2</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="text-cyan-400">Experience:</span>
                    </div>
                    <span className="text-green-300 font-medium">3+ Years</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="text-cyan-400">Location:</span>
                    </div>
                    <span className="text-green-300 font-medium">Jakarta, Indonesia</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="text-cyan-400">Languages:</span>
                    </div>
                    <span className="text-green-300 font-medium">Indonesian, English</span>
                  </div>

                  {/* Social Media Section */}
                  <div className="pt-4 border-t border-green-400/30">
                    <h3 className="text-cyan-400 font-semibold mb-4 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Connect with me
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {socialLinks.map((social, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className={`${social.color} ${social.bgColor} border-green-400/30 hover:border-green-400/50 transition-all duration-200 group relative overflow-hidden`}
                          onClick={() => window.open(social.url, "_blank", "noopener,noreferrer")}
                        >
                          <social.icon className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">{social.name}</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-green-300/70 text-center">
                      Click any button to visit my profile
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-900/20 to-black/80 border border-cyan-400">
                <CardHeader>
                  <CardTitle className="text-cyan-400 text-xl font-bold flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" /># Biography
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-300 space-y-4 text-sm leading-relaxed">
                  <p className="p-4 bg-black/40 rounded border-l-4 border-cyan-400">
                    Passionate cybersecurity professional with over 3 years of hands-on experience in security
                    operations, threat hunting, and penetration testing. Dedicated to protecting digital assets and
                    staying ahead of emerging cyber threats.
                  </p>
                  <p className="p-4 bg-black/40 rounded border-l-4 border-green-400">
                    Specializing in both defensive (Blue Team) and offensive (Red Team) security operations, with a
                    strong focus on incident response, vulnerability assessment, and security architecture design.
                  </p>
                  <p className="p-4 bg-black/40 rounded border-l-4 border-purple-400">
                    Continuous learner and contributor to the cybersecurity community through research, blogging, and
                    knowledge sharing. Currently leading security engineering initiatives at PT. Cynnex Integrasi
                    Solusi.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Role Showcase */}
            <Card className="bg-black/90 border border-green-400">
              <CardHeader>
                <CardTitle className="text-green-400 text-xl font-bold flex items-center">
                  <Zap className="w-5 h-5 mr-2" /># Professional Roles & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role Selector */}
                <div className="flex flex-wrap gap-2">
                  {roles.map((role, index) => (
                    <Button
                      key={index}
                      onClick={() => setActiveRole(index)}
                      variant={activeRole === index ? "default" : "outline"}
                      className={`transition-all duration-300 ${
                        activeRole === index
                          ? `bg-${role.color}-400/20 border-${role.color}-400 text-${role.color}-400`
                          : "border-green-400/50 text-green-300 hover:border-green-400"
                      }`}
                    >
                      <role.icon className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{role.title}</span>
                    </Button>
                  ))}
                </div>

                {/* Active Role Display */}
                <div
                  className={`bg-gradient-to-r ${currentRole.gradient} border border-${currentRole.color}-400 p-6 rounded-lg transition-all duration-500`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 bg-${currentRole.color}-400/20 rounded-lg mr-4`}>
                      <currentRole.icon className={`w-8 h-8 text-${currentRole.color}-400`} />
                    </div>
                    <div>
                      <h3 className={`text-${currentRole.color}-400 text-2xl font-bold`}>{currentRole.title}</h3>
                      <p className="text-green-300 text-sm">{currentRole.experience}</p>
                    </div>
                  </div>

                  <p className="text-green-300 mb-6 leading-relaxed">{currentRole.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className={`text-${currentRole.color}-400 font-bold mb-3`}>Core Skills:</h4>
                      <div className="space-y-2">
                        {currentRole.skills.map((skill, index) => (
                          <div key={index} className="flex items-center">
                            <div className={`w-2 h-2 bg-${currentRole.color}-400 rounded-full mr-3`}></div>
                            <span className="text-green-300 text-sm">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className={`p-8 bg-${currentRole.color}-400/10 rounded-full border-2 border-${currentRole.color}-400/30`}
                      >
                        <currentRole.icon className={`w-16 h-16 text-${currentRole.color}-400 animate-pulse`} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Areas of Expertise */}
            <Card className="bg-black/80 border border-green-400">
              <CardHeader>
                <CardTitle className="text-green-400 text-xl font-bold flex items-center">
                  <Award className="w-5 h-5 mr-2" /># Areas of Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-blue-900/20 border border-blue-400/50 rounded">
                      <Shield className="w-5 h-5 text-blue-400 mr-3" />
                      <span className="text-green-300">Security Operations Center (SOC) Management</span>
                    </div>
                    <div className="flex items-center p-3 bg-cyan-900/20 border border-cyan-400/50 rounded">
                      <Eye className="w-5 h-5 text-cyan-400 mr-3" />
                      <span className="text-green-300">Threat Hunting & Intelligence</span>
                    </div>
                    <div className="flex items-center p-3 bg-green-900/20 border border-green-400/50 rounded">
                      <Terminal className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-green-300">SIEM Implementation & Management</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-red-900/20 border border-red-400/50 rounded">
                      <Target className="w-5 h-5 text-red-400 mr-3" />
                      <span className="text-green-300">Incident Response & Forensics</span>
                    </div>
                    <div className="flex items-center p-3 bg-purple-900/20 border border-purple-400/50 rounded">
                      <Code className="w-5 h-5 text-purple-400 mr-3" />
                      <span className="text-green-300">Vulnerability Assessment & Penetration Testing</span>
                    </div>
                    <div className="flex items-center p-3 bg-yellow-900/20 border border-yellow-400/50 rounded">
                      <Zap className="w-5 h-5 text-yellow-400 mr-3" />
                      <span className="text-green-300">Malware Analysis & Reverse Engineering</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Philosophy */}
            <Card className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border border-green-400">
              <CardHeader>
                <CardTitle className="text-green-400 text-xl font-bold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" /># Professional Philosophy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-green-300 text-lg italic border-l-4 border-cyan-400 pl-6 py-4">
                  "In cybersecurity, the only constant is change. Every day brings new threats, new challenges, and new
                  opportunities to learn. My approach combines defensive vigilance with offensive thinking, always
                  staying one step ahead of adversaries while building robust security architectures that protect what
                  matters most."
                </blockquote>
                <div className="text-right mt-4">
                  <span className="text-cyan-400 font-medium">- Angga Novryan Putra F.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
