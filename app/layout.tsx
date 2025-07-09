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
  // TODO: Ganti dengan URL domain production Anda
  metadataBase: new URL("https://angganovryanputra.github.io"),
  title: "Angga Novryan Putra F. - Cybersecurity Professional",
  description:
    "SOC Analyst | Penetration Tester | Security Researcher with 3+ years of experience in cybersecurity operations, threat hunting, and penetration testing.",
  keywords:
    "cybersecurity, SOC analyst, penetration testing, security researcher, threat hunting, SIEM, incident response",
  authors: [{ name: "Angga Novryan Putra F." }],
  generator: 'mxz4rt-sec',
  openGraph: {
    title: "Angga Novryan Putra F. - Cybersecurity Professional",
    description:
      "Explore the portfolio of Angga Novryan Putra F., a dedicated cybersecurity professional specializing in threat detection, penetration testing, and security research.",
    images: [
      {
        url: "/profile.png", // Pastikan file ini ada di folder /public
        width: 1200,
        height: 630,
        alt: "Angga Novryan Putra F. Cybersecurity Portfolio",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Angga Novryan Putra F. - Cybersecurity Professional",
    description:
      "Cybersecurity portfolio of Angga Novryan Putra F., focusing on SOC, pentesting, and research. #CyberSecurity #InfoSec",
    images: ["/profile.png"], // Pastikan file ini ada di folder /public
    // TODO: Ganti dengan username Twitter Anda (opsional)
    // creator: "@your_twitter_handle", 
  },
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
