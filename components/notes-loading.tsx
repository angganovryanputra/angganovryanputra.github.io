"use client"

import { useState, useEffect } from "react"
import { BookOpen, Database, Search, FileText, Shield, Terminal } from "lucide-react"

interface NotesLoadingProps {
  message?: string
  variant?: "default" | "search" | "data"
  size?: "sm" | "md" | "lg"
}

export function NotesLoading({
  message = "Loading cybersecurity notes...",
  variant = "default",
  size = "md",
}: NotesLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [dots, setDots] = useState("")

  const loadingSteps = [
    { icon: Database, text: "Scanning note repository", color: "text-green-400" },
    { icon: FileText, text: "Processing markdown files", color: "text-cyan-400" },
    { icon: Search, text: "Building search index", color: "text-blue-400" },
    { icon: Shield, text: "Validating security content", color: "text-purple-400" },
    { icon: BookOpen, text: "Organizing knowledge base", color: "text-green-400" },
  ]

  const sizeClasses = {
    sm: {
      container: "p-4",
      icon: "w-8 h-8",
      title: "text-lg",
      text: "text-sm",
      step: "text-xs",
    },
    md: {
      container: "p-6 md:p-8",
      icon: "w-12 h-12",
      title: "text-xl md:text-2xl",
      text: "text-sm md:text-base",
      step: "text-sm",
    },
    lg: {
      container: "p-8 md:p-12",
      icon: "w-16 h-16",
      title: "text-2xl md:text-3xl",
      text: "text-base md:text-lg",
      step: "text-base",
    },
  }

  const currentSize = sizeClasses[size]

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length)
    }, 1200)

    return () => clearInterval(stepInterval)
  }, [loadingSteps.length])

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(dotInterval)
  }, [])

  const currentStepData = loadingSteps[currentStep]
  const IconComponent = currentStepData.icon

  return (
    <div className={`flex flex-col items-center justify-center ${currentSize.container}`}>
      {/* Main Loading Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping">
          <div className="w-full h-full bg-green-400/20 rounded-full"></div>
        </div>
        <div className="relative bg-black/80 border-2 border-green-400 rounded-full p-4 backdrop-blur-sm">
          <BookOpen className={`${currentSize.icon} text-green-400 animate-pulse`} />
        </div>
      </div>

      {/* Title */}
      <h2 className={`${currentSize.title} font-bold text-green-400 mb-2 text-center`}>Cybersecurity Knowledge Base</h2>

      {/* Main Message */}
      <p className={`${currentSize.text} text-green-300 mb-6 text-center max-w-md`}>
        {message}
        <span className="inline-block w-8 text-left">{dots}</span>
      </p>

      {/* Loading Steps */}
      <div className="w-full max-w-md space-y-3">
        {loadingSteps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                isActive
                  ? `border-green-400 bg-green-400/10 ${step.color}`
                  : isCompleted
                    ? "border-green-400/50 bg-green-400/5 text-green-400"
                    : "border-green-400/20 bg-black/20 text-green-400/50"
              }`}
            >
              <div className={`flex-shrink-0 ${isActive ? "animate-spin" : ""}`}>
                <StepIcon className="w-4 h-4" />
              </div>
              <span className={`${currentSize.step} font-medium flex-1`}>{step.text}</span>
              {isCompleted && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
              {isActive && (
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Terminal-style Progress */}
      <div className="mt-6 w-full max-w-md">
        <div className="bg-black/60 border border-green-400/30 rounded p-3 font-mono">
          <div className="flex items-center gap-2 text-green-400 text-xs">
            <Terminal className="w-3 h-3" />
            <span>notes@cybersec:~$</span>
            <span className="animate-pulse">|</span>
          </div>
          <div className="mt-2 text-xs text-green-300">
            Processing {currentStep + 1}/{loadingSteps.length} operations...
          </div>
          <div className="mt-1 bg-green-400/20 rounded-full h-1">
            <div
              className="bg-green-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Variant-specific content */}
      {variant === "search" && (
        <div className="mt-4 text-center">
          <p className="text-xs text-green-400/70">Building search index for faster queries...</p>
        </div>
      )}

      {variant === "data" && (
        <div className="mt-4 text-center">
          <p className="text-xs text-green-400/70">Synchronizing with knowledge repository...</p>
        </div>
      )}
    </div>
  )
}
