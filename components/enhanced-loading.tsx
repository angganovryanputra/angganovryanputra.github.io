"use client"

import { useState, useEffect } from "react"

interface EnhancedLoadingProps {
  message?: string
  subMessage?: string
  progress?: number
  showProgress?: boolean
  variant?: "default" | "matrix" | "terminal" | "pulse" | "matrix-terminal"
  size?: "sm" | "md" | "lg"
}

interface SystemInfo {
  os: string;
  cpu: string;
  memory: string;
  ip: string;
  country: string;
}

export function EnhancedLoading({
  message = "Initializing security protocols...",
  subMessage,
  progress,
  showProgress = false,
  variant = "default",
  size = "md",
}: EnhancedLoadingProps) {
  const [dots, setDots] = useState("")
  const [currentProgress, setCurrentProgress] = useState(0)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    os: 'Detecting OS...',
    cpu: 'Detecting CPU...',
    memory: 'Detecting Memory...',
    ip: 'Resolving IP...',
    country: 'Locating...',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (showProgress && progress !== undefined) {
      const timer = setTimeout(() => {
        setCurrentProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [progress, showProgress])

  useEffect(() => {
    const getSystemInfo = async () => {
      // --- Local System Info ---
      const platform = (navigator as any).userAgentData?.platform || navigator.platform || 'N/A';
      let osName = platform;
      if (platform.startsWith('Win')) osName = 'Windows';
      else if (platform.startsWith('Mac')) osName = 'macOS';
      else if (platform.toLowerCase().includes('linux')) osName = 'Linux';
      else if (['iPhone', 'iPad', 'iPod'].includes(platform)) osName = 'iOS';

      const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}-core Processor` : 'N/A';
      const memory = (navigator as any).deviceMemory ? `Approx. ${(navigator as any).deviceMemory}GB available` : 'N/A';

      // --- IP & Geolocation Info ---
      let ipAddress = 'N/A';
      let country = 'N/A';
      try {
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) throw new Error('Failed to fetch IP info');
        const data = await response.json();
        ipAddress = data.ip || 'N/A';
        country = data.country || 'N/A';
      } catch (error) {
        console.error('IP detection failed:', error);
        ipAddress = 'Detection Failed';
        country = 'Detection Failed';
      }

      setSystemInfo({
        os: `${osName} user-system`,
        cpu: cores,
        memory: memory,
        ip: ipAddress,
        country: country,
      });
    };

    getSystemInfo();
  }, []);

  useEffect(() => {
    if (variant === "terminal") {
      // Simulate realistic terminal output
      const commands = [
        "$ sudo systemctl start security-framework",
        "[  OK  ] Started Security Framework Service",
        "$ modprobe security_modules",
        "[  OK  ] Loading kernel security modules...",
        "$ mount -t securityfs securityfs /sys/kernel/security",
        "[  OK  ] Mounted security filesystem",
        "$ systemctl enable firewall.service",
        "[  OK  ] Firewall service enabled",
        "$ /usr/bin/threat-intel-sync --update",
        "[  OK  ] Threat intelligence database updated",
        "$ systemctl start siem-collector",
        "[  OK  ] SIEM collector service started",
        "$ echo 'System initialization complete'",
        "System initialization complete",
      ]

      let lineIndex = 0
      const addLine = () => {
        if (lineIndex < commands.length) {
          const cmd = commands[lineIndex]
          if (cmd) {
            setTerminalLines((prev) => [...prev, cmd])
          }
          lineIndex++
          setTimeout(addLine, Math.random() * 800 + 400) // Random delay between 400-1200ms
        }
      }

      const timer = setTimeout(addLine, 500)
      return () => clearTimeout(timer)
    }
  }, [variant])

  const sizeClasses = {
    sm: {
      container: "p-4",
      title: "text-sm",
      subtitle: "text-xs",
      spinner: "w-6 h-6",
      matrix: "text-xs",
      terminal: "text-xs",
    },
    md: {
      container: "p-6 md:p-8",
      title: "text-base md:text-lg",
      subtitle: "text-xs md:text-sm",
      spinner: "w-8 h-8",
      matrix: "text-sm",
      terminal: "text-sm",
    },
    lg: {
      container: "p-8 md:p-12",
      title: "text-lg md:text-xl",
      subtitle: "text-sm md:text-base",
      spinner: "w-12 h-12",
      matrix: "text-base",
      terminal: "text-base md:text-lg",
    },
  }

  const classes = sizeClasses[size]

  if (variant === "terminal") {
    return (
      <div className={`flex flex-col items-center justify-center ${classes.container} w-full`}>
        {/* Large Terminal Window */}
        <div className="bg-black/95 border-2 border-green-400 rounded-lg w-full max-w-4xl shadow-2xl shadow-green-400/20">
          {/* Terminal Header */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-green-400/30 bg-green-400/5">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <div
                className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <div className="text-green-400/70 text-xs md:text-sm font-mono">root@security-system:/home/angga</div>
            <div className="text-green-400/50 text-xs md:text-sm">●●●</div>
          </div>

          {/* Terminal Content */}
          <div className="p-4 md:p-6 min-h-[300px] md:min-h-[400px] font-mono">
            {/* Boot Header */}
            <div className="text-green-400 mb-4 text-xs md:text-sm">
              <div className="border-b border-green-400/30 pb-2 mb-4">
                {/* Responsive Boot Header */}
                <div className="border-2 border-green-400/50 p-1">
                  <div className="border border-green-400/50 p-2 text-center">
                    <p className="font-bold tracking-widest">SECURITY SYSTEM BOOT</p>
                    <p>Angga Novryan Putra Portfolio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="text-green-300 mb-4 text-xs md:text-sm space-y-1">
              <div>{systemInfo.os}</div>
              <div>CPU: {systemInfo.cpu}</div>
              <div>Memory: {systemInfo.memory}</div>
              <div>Your IP Address: {systemInfo.ip} ({systemInfo.country})</div>
              <div>Security Level: Maximum</div>
              <div className="border-b border-green-400/20 pb-2"></div>
            </div>

            {/* Dynamic Terminal Output */}
            <div className="space-y-1 text-xs md:text-sm">
              {terminalLines.map((ln, idx) =>
                !ln ? null : (
                  <div
                    key={idx}
                    className={`${
                      ln.startsWith("$")
                        ? "text-green-400"
                        : ln.includes("[  OK  ]")
                          ? "text-green-300"
                          : ln.toLowerCase().includes("complete")
                            ? "text-cyan-400 font-bold"
                            : "text-green-300"
                    } animate-fade-in`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {ln}
                  </div>
                ),
              )}
            </div>

            {/* Current Status */}
            <div className="mt-4 pt-4 border-t border-green-400/20">
              <div className="flex items-center text-xs md:text-sm">
                <span className="text-green-400 mr-2">root@security-system:~$</span>
                <span className="text-green-300">{message}</span>
                <span className="text-green-400 animate-pulse ml-1">{dots}</span>
              </div>

              {/* Enhanced Progress Bar */}
              {showProgress && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-green-400">
                    <span>System Initialization Progress</span>
                    <span>{Math.round(currentProgress)}%</span>
                  </div>
                  <div className="w-full bg-green-400/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-500 ease-out relative"
                      style={{ width: `${currentProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-xs text-green-300/70">
                    [{Math.round(currentProgress / 5) > 0 ? "█".repeat(Math.round(currentProgress / 5)) : ""}
                    {20 - Math.round(currentProgress / 5) > 0 ? "░".repeat(20 - Math.round(currentProgress / 5)) : ""}]
                  </div>
                </div>
              )}

              {/* Cursor */}
              <div className="flex items-center mt-2">
                <span className="text-green-400 text-xs md:text-sm">root@security-system:~$</span>
                <div
                  className={`ml-2 w-2 h-4 bg-green-400 ${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}
                ></div>
              </div>
            </div>

            {/* Sub Message */}
            {subMessage && <div className="mt-2 text-green-300/70 text-xs md:text-sm italic"># {subMessage}</div>}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-4 text-center">
          <div className="text-green-400 text-xs md:text-sm">
            <span className="animate-pulse">●</span> Security Framework Loading
          </div>
        </div>
      </div>
    )
  }

  // Other variants remain the same but with responsive improvements
  if (variant === "matrix") {
    return (
      <div className={`flex flex-col items-center justify-center ${classes.container}`}>
        <div className={`text-green-400 font-mono ${classes.matrix} mb-6 text-center leading-tight`}>
          <pre className="text-xs md:text-sm lg:text-base">{`
    ╔══════════════════╗
    ║  LOADING MATRIX  ║
    ║  ████████████    ║
    ║  ████████████    ║
    ║  ████████████    ║
    ╚══════════════════╝
          `}</pre>
        </div>
        <div className={`text-green-400 font-mono ${classes.title} animate-pulse text-center`}>
          {message}
          {dots}
        </div>
        {subMessage && (
          <div className={`text-green-300 font-mono ${classes.subtitle} mt-2 text-center opacity-70`}>{subMessage}</div>
        )}
      </div>
    )
  }

  // Default variant with responsive improvements
  return (
    <div className={`flex flex-col items-center justify-center ${classes.container}`}>
      <div className={`text-green-400 font-mono ${classes.matrix} mb-4`}>
        <pre className="text-center leading-tight text-xs md:text-sm">{`
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⣠⣤⣤⣤⣤⣤⡙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠟⢁⣴⣿⣿⣿⣿⣿⣿⣿⣿⣦⣈⠻⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡿⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡿⢀⣿⣿⡿⠿⠛⢋⣉⣉⡙⠛⠿⢿⣿⣿⡄⢹⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣧⠘⢿⣤⡄⢰⣿⣿⣿⣿⣿⣿⣶⠀⣤⣽⠃⣸⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡿⠛⢋⣁⡈⢻⡇⢸⣿⣿⣿⣿⣿⣿⡿⢠⡿⢁⣈⡙⠛⢿⣿⣿⣿⣿⣿
⣿⣿⣿⡿⢁⡾⠿⠿⠿⠄⠹⠄⠙⠛⠿⠿⠟⠋⠠⠞⠠⠾⠿⠿⠿⡄⢻⣿⣿⣿
⣿⣿⡿⢁⣾⠀⣶⣶⣿⣿⣶⣾⣶⣶⣶⣶⣶⣿⣿⣷⣾⣷⣶⣶⠀⣷⡀⢻⣿⣿
⣿⣿⠁⣼⣿⠀⣿⣿⣿⣿⣿⠟⣉⣤⣤⣈⠛⣿⣿⣿⣿⣿⣿⠀⣿⣷⡈⢿⣿
⣿⠃⣼⣿⣿⠀⣿⣿⣿⣿⣿⡇⣰⡛⢿⡿⠛⣧⠘⣿⣿⣿⣿⣿⠀⣿⣿⣷⠈⣿
⡇⢸⣿⣿⣿⠀⣿⣿⣿⣿⣿⣧⡘⠻⣾⣷⠾⠋⣰⣿⣿⣿⣿⣿⠀⣿⣿⣿⣧⠘
⣷⣌⠙⠿⣿⠀⣿⣿⣿⣿⣿⣿⣄⣉⣉⣠⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⡿⠛⣡⣼
⣿⣿⣿⣦⣈⠀⠿⠿⠿⠿⠟⠛⠛⠛⠛⠿⠛⠟⠛⢿⣿⠛⠻⠀⢉⣴⣾⣿⣿
⣿⣿⣿⣿⣿⡀⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠀⣿⣿⣿⣿⣿⣿
        `}</pre>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
      <div className={`text-green-400 font-mono ${classes.title} animate-pulse text-center`}>
        {message}
        {dots}
      </div>
      {subMessage && (
        <div className={`text-green-300 font-mono ${classes.subtitle} mt-2 text-center opacity-70`}>{subMessage}</div>
      )}
    </div>
  )
}
