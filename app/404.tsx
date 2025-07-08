"use client"

import Link from "next/link"
import { MatrixRain } from "@/components/matrix-rain"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-black/90 border border-red-400 p-8 rounded-lg max-w-2xl w-full mx-4">
          <div className="text-center space-y-6">
            <div className="text-red-400 text-6xl font-bold">404</div>
            <div className="text-red-400 text-xl">$ ls: cannot access 'page': No such file or directory</div>
            <div className="text-green-300">The requested resource could not be found in the system.</div>
            <div className="space-y-2">
              <div className="text-green-400">Available commands:</div>
              <div className="text-green-300 text-sm space-y-1">
                <div>{"> cd / (Go to home)"}</div>
                <div>{"> ls -la (List all pages)"}</div>
                <div>{"> cat /about (View about page)"}</div>
                <div>{"> grep -r skills (Search skills)"}</div>
              </div>
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors rounded"
            >
              $ cd /home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
