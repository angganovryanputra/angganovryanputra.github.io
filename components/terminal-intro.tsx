"use client"

import { useEffect, useMemo, useState } from "react"

interface TerminalIntroProps {
  onComplete: () => void
}

const TERMINAL_LINES = [
  "root@angga:~# whoami",
  "Angga Novryan Putra F.",
  "SOC Analyst | Penetration Tester | Security Researcher",
  "",
  "root@angga:~# ./start_hacking.sh",
  "Initializing security protocols...",
  "Loading threat intelligence database...",
  "Establishing secure connection...",
  "System ready for operation.",
  "",
  "root@angga:~# ls -la skills/",
  "-rw-r--r--  web_security.sh",
  "-rw-r--r--  reverse_engineering.py",
  "-rw-r--r--  siem_analysis.c",
  "-rw-r--r--  threat_hunting.rb",
  "-rw-r--r--  forensics.go",
  "",
  'root@angga:~# echo "Welcome to my digital domain"',
  "Welcome to my digital domain",
]

export function TerminalIntro({ onComplete }: TerminalIntroProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const lines = useMemo(() => TERMINAL_LINES, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (currentLine >= lines.length) {
      setTimeout(onComplete, 1000)
      return
    }

    const currentLineText = lines[currentLine]

    if (currentChar < currentLineText.length) {
      const timer = setTimeout(() => {
        setCurrentChar((prev) => prev + 1)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setCurrentLine((prev) => prev + 1)
        setCurrentChar(0)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentLine, currentChar, lines, onComplete])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-black/90 border border-green-400 p-4 md:p-8 rounded-lg max-w-4xl w-full mx-4">
        <div className="space-y-2">
          {lines.slice(0, currentLine).map((line, index) => (
            <div key={index} className="text-green-400 text-xs md:text-sm lg:text-base font-mono">
              {line}
            </div>
          ))}
          {currentLine < lines.length && (
            <div className="text-green-400 text-xs md:text-sm lg:text-base font-mono">
              {lines[currentLine].slice(0, currentChar)}
              {showCursor && <span className="bg-green-400 text-black">_</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
