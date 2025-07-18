"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, AlertCircle, CheckCircle, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AdminPasswordChangeFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export default function AdminPasswordChangeForm({ onSuccess, onClose }: AdminPasswordChangeFormProps) {
  const [email, setEmail] = useState("") // Admin email'i, gerçek uygulamada session'dan gelmeli
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!email || !currentPassword || !newPassword || !confirmNewPassword) {
      setError("Tüm alanları doldurunuz.")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError("Yeni parolalar eşleşmiyor.")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("Yeni parola en az 6 karakter olmalıdır.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || "Parola başarıyla değiştirildi!")
        setEmail("")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
        onSuccess?.()
        setTimeout(() => {
          setSuccess(null)
          onClose?.()
        }, 2000)
      } else {
        setError(data.message || "Parola değiştirilirken bir hata oluştu.")
      }
    } catch (err) {
      console.error("Parola değiştirme sırasında ağ hatası:", err)
      setError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 rounded-3xl overflow-hidden bg-makro-white">
      <CardHeader className="bg-gradient-to-r from-makro-navy to-makro-navy-light text-makro-white p-8">
        <CardTitle className="text-3xl md:text-4xl text-center font-bold flex items-center justify-center space-x-4">
          <Lock className="w-10 h-10" />
          <span>Parola Değiştir</span>
        </CardTitle>
        <p className="text-center text-makro-white/90 text-lg mt-4">Mevcut parolanızı güncelleyin</p>
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
            <CheckCircle className="h-5 w-5" />
            <AlertDescription className="text-base font-medium ml-2">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-xl font-bold text-makro-navy flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Admin E-posta</span>
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
            <Label htmlFor="current-password" className="text-xl font-bold text-makro-navy flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Mevcut Parola</span>
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="h-14 text-xl border-3 rounded-2xl border-gray-300 focus:border-makro-orange focus:ring-4 focus:ring-makro-orange/20 bg-makro-white shadow-lg"
              placeholder="Mevcut parolanızı giriniz"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="new-password" className="text-xl font-bold text-makro-navy flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Yeni Parola</span>
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="h-14 text-xl border-3 rounded-2xl border-gray-300 focus:border-makro-orange focus:ring-4 focus:ring-makro-orange/20 bg-makro-white shadow-lg"
              placeholder="Yeni parolanızı giriniz"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="confirm-new-password"
              className="text-xl font-bold text-makro-navy flex items-center space-x-2"
            >
              <Lock className="w-5 h-5" />
              <span>Yeni Parola Tekrar</span>
            </Label>
            <Input
              id="confirm-new-password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="h-14 text-xl border-3 rounded-2xl border-gray-300 focus:border-makro-orange focus:ring-4 focus:ring-makro-orange/20 bg-makro-white shadow-lg"
              placeholder="Yeni parolanızı tekrar giriniz"
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
                Değiştiriliyor...
              </>
            ) : (
              "Parolayı Değiştir"
            )}
          </Button>
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full h-16 text-2xl font-bold border-2 border-makro-navy text-makro-navy hover:bg-makro-navy hover:text-makro-white bg-makro-white rounded-2xl shadow-md transition-all duration-300 mt-4"
              disabled={isLoading}
            >
              İptal
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
