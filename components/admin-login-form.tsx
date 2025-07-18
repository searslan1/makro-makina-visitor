"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogIn, Mail, Lock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginAdmin } from "@/lib/auth" // loginAdmin fonksiyonunu import ediyoruz
import { useRouter } from "next/navigation" // useRouter'ı import ediyoruz

export default function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter() // useRouter hook'unu kullanıyoruz

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || "Giriş başarılı!")
        loginAdmin() // Başarılı girişte admin oturumunu kaydet
        setEmail("")
        setPassword("")
        // Başarılı giriş sonrası admin paneline yönlendir
        setTimeout(() => {
          router.push("/admin-panel")
        }, 500) // Kısa bir gecikme ile yönlendirme
      } else {
        setError(data.message || "Giriş başarısız oldu. Lütfen tekrar deneyin.")
      }
    } catch (err) {
      console.error("Giriş sırasında ağ hatası:", err)
      setError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 rounded-3xl overflow-hidden bg-makro-white">
      <CardHeader className="bg-gradient-to-r from-makro-navy to-makro-navy-light text-makro-white p-8">
        <CardTitle className="text-3xl md:text-4xl text-center font-bold flex items-center justify-center space-x-4">
          <LogIn className="w-10 h-10" />
          <span>Yönetici Girişi</span>
        </CardTitle>
        <p className="text-center text-makro-white/90 text-lg mt-4">Yönetici paneline erişmek için giriş yapın</p>
      </CardHeader>
      <CardContent className="p-8 md:p-10 space-y-6">
        {error && (
          <Alert variant="destructive" className="border-red-500 bg-red-50 rounded-2xl p-4">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base font-medium ml-2">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-500 bg-green-50 rounded-2xl p-4">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base font-medium ml-2">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-xl font-bold text-makro-navy flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>E-posta</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 text-xl border-3 rounded-2xl border-gray-300 focus:border-makro-orange focus:ring-4 focus:ring-makro-orange/20 bg-makro-white shadow-lg"
              placeholder="admin@makromakina.com"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-xl font-bold text-makro-navy flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Parola</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-14 text-xl border-3 rounded-2xl border-gray-300 focus:border-makro-orange focus:ring-4 focus:ring-makro-orange/20 bg-makro-white shadow-lg"
              placeholder="Parolanızı giriniz"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 text-2xl font-bold bg-gradient-to-r from-makro-orange to-makro-orange-light hover:from-makro-orange-dark hover:to-makro-orange disabled:bg-gray-400 disabled:cursor-not-allowed text-makro-white rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-7 h-7 mr-3 animate-spin" />
                Giriş Yapılıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
