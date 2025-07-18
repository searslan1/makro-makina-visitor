"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Settings } from "lucide-react"

export default function EnvironmentCheck() {
  const [configStatus, setConfigStatus] = useState<{
    isValid: boolean
    missingVars: string[]
  }>({ isValid: true, missingVars: [] })

  useEffect(() => {
    const requiredVars = [
      "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
      "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
      "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
    ]

    const missingVars = requiredVars.filter((varName) => {
      const value = process.env[varName as keyof typeof process.env]
      return !value || value.trim() === ""
    })

    setConfigStatus({
      isValid: missingVars.length === 0,
      missingVars,
    })
  }, [])

  if (configStatus.isValid) {
    console.log("EmailJS konfigürasyonu başarıyla yüklendi")
    return null // Return null to render nothing in the UI
  }

  return (
    <Alert variant="destructive" className="mb-8 rounded-2xl p-6 shadow-lg border-red-500 bg-red-50">
      <AlertTriangle className="h-6 w-6" />
      <AlertDescription>
        <div className="space-y-4 ml-3">
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5" />
            <p className="font-bold text-lg">EmailJS konfigürasyonu eksik!</p>
          </div>
          <p className="text-base">Eksik environment variables:</p>
          <ul className="text-base list-disc list-inside space-y-2 bg-red-100 p-4 rounded-xl">
            {configStatus.missingVars.map((varName) => (
              <li key={varName}>
                <code className="bg-red-200 px-2 py-1 rounded font-mono text-sm">{varName}</code>
              </li>
            ))}
          </ul>
          <p className="text-base mt-4 font-semibold">
            Lütfen <code className="bg-red-200 px-2 py-1 rounded font-mono">.env.local</code> dosyasını kontrol edin.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
