import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Angga Novryan Putra F. - Cybersecurity Professional",
  description:
    "SOC Analyst | Penetration Tester | Security Researcher with 3+ years of experience in cybersecurity operations, threat hunting, and penetration testing.",
  keywords:
    "cybersecurity, SOC analyst, penetration testing, security researcher, threat hunting, SIEM, incident response",
  authors: [{ name: "Angga Novryan Putra F." }],
  generator: 'mxz4rt-sec'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${jetbrains.className}`}>{children}</body>
    </html>
  )
}
