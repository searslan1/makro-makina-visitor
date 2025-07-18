"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, User, Phone, Mail } from "lucide-react"
import emailjs from "@emailjs/browser"
import SignatureModal from "./signature-modal"
import KvkkSection from "./kvkk-section"
import SuccessMessage from "./success-message"

interface FormData {
  name: string
  surname: string
  phone: string
  email: string
  kvkkConsent: boolean
  signature: string | null
}

interface EmailJSConfig {
  serviceId: string
  templateId: string
  publicKey: string
}

// EmailJS konfigürasyonu - Environment variables'dan alınıyor
const EMAILJS_CONFIG: EmailJSConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
}

// Environment variables kontrolü
const validateEmailJSConfig = () => {
  const missingVars = []

  if (!EMAILJS_CONFIG.serviceId) missingVars.push("NEXT_PUBLIC_EMAILJS_SERVICE_ID")
  if (!EMAILJS_CONFIG.templateId) missingVars.push("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID")
  if (!EMAILJS_CONFIG.publicKey) missingVars.push("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY")

  if (missingVars.length > 0) {
    console.error("Eksik EmailJS environment variables:", missingVars)
    return false
  }

  return true
}

/**
 * İmza PNG'sinden küçük bir thumbnail oluşturur.
 * @param base64String Tam çözünürlüklü imzanın base64 string'i.
 * @param maxWidth Thumbnail'in maksimum genişliği.
 * @param maxHeight Thumbnail'in maksimum yüksekliği.
 * @returns Thumbnail'in base64 string'i.
 */
const createSignatureThumbnail = (base64String: string, maxWidth = 200, maxHeight = 100): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous" // CORS sorunlarını önlemek için
    img.src = base64String

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        return reject(new Error("Canvas context oluşturulamadı."))
      }

      let width = img.width
      let height = img.height

      // Boyutları küçült
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL("image/png"))
    }

    img.onerror = (error) => {
      console.error("İmza thumbnail oluşturulurken resim yükleme hatası:", error)
      reject(new Error("İmza thumbnail oluşturulamadı."))
    }
  })
}

export default function VisitorForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    phone: "",
    email: "",
    kvkkConsent: false,
    signature: null,
  })

  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Ad alanı zorunludur"
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Soyad alanı zorunludur"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası zorunludur"
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Geçerli bir telefon numarası giriniz"
    }

    if (!formData.kvkkConsent) {
      newErrors.kvkk = "KVKK metnini onaylamanız gerekmektedir"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (submitError) {
      setSubmitError(null)
    }
  }

  const handleSignClick = () => {
    if (validateForm()) {
      setShowSignatureModal(true)
    }
  }

  const submitFormData = async (fullSignatureData: string) => {
    setIsSubmitting(true)
    setSubmitError(null)

    const emailJsConfigValid = validateEmailJSConfig()
    let signatureThumbnail: string | null = null

    // EmailJS için thumbnail oluştur
    if (emailJsConfigValid) {
      try {
        signatureThumbnail = await createSignatureThumbnail(fullSignatureData)
      } catch (thumbnailError) {
        console.error("İmza thumbnail oluşturulurken hata:", thumbnailError)
        // Thumbnail oluşturma hatası EmailJS gönderimini engellememeli, sadece imza gönderilmez
        signatureThumbnail = null
      }
    }

    const emailJsPromise =
      emailJsConfigValid && signatureThumbnail
        ? emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
              visitor_name: formData.name,
              visitor_surname: formData.surname,
              visitor_phone: formData.phone,
              visitor_email: formData.email || "Belirtilmedi",
              visitor_full_name: `${formData.name} ${formData.surname}`,
              submission_date: new Date().toLocaleDateString("tr-TR"),
              submission_time: new Date().toLocaleTimeString("tr-TR"),
              submission_datetime: new Date().toLocaleString("tr-TR"),
              kvkk_consent: formData.kvkkConsent ? "Onaylandı" : "Onaylanmadı",
              signature_image: signatureThumbnail, // Buraya thumbnail gönderiliyor
              company_name: "Makro Makina",
              form_type: "Ziyaretçi Kayıt Formu",
              user_agent: navigator.userAgent,
              screen_resolution: `${screen.width}x${screen.height}`,
            },
            EMAILJS_CONFIG.publicKey,
          )
        : Promise.reject(
            new Error(
              emailJsConfigValid
                ? "İmza thumbnail oluşturulamadı veya EmailJS konfigürasyonu eksik."
                : "EmailJS konfigürasyonu eksik.",
            ),
          )

    const apiSavePromise = fetch("/api/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, signature: fullSignatureData }), // Buraya tam çözünürlüklü imza gönderiliyor
    }).then(async (res) => {
      if (!res.ok) {
        // API'den gelen yanıt JSON değilse, hata mesajını doğrudan kullan
        const errorText = await res.text()
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.message || "API kaydı başarısız oldu.")
        } catch {
          // Yanıt JSON değilse veya parse edilemezse, ham metni kullan
          throw new Error(`API kaydı başarısız oldu: ${errorText.substring(0, 100)}...`)
        }
      }
      return res.json()
    })

    try {
      const [emailResult, apiResult] = await Promise.allSettled([emailJsPromise, apiSavePromise])

      let overallSuccess = false
      const combinedErrorMessage: string[] = []

      if (emailResult.status === "fulfilled") {
        console.log("EmailJS gönderimi başarılı:", emailResult.value)
        overallSuccess = true
      } else {
        console.error("EmailJS gönderimi başarısız:", emailResult.reason)
        combinedErrorMessage.push(`E-posta gönderimi başarısız: ${emailResult.reason.message || emailResult.reason}`)
      }

      if (apiResult.status === "fulfilled") {
        console.log("API kaydı başarılı:", apiResult.value)
        overallSuccess = true
      } else {
        console.error("API kaydı başarısız:", apiResult.reason)
        combinedErrorMessage.push(`Veritabanı kaydı başarısız: ${apiResult.reason.message || apiResult.reason}`)
      }

      if (overallSuccess) {
        setShowSuccess(true)
        setTimeout(() => {
          setFormData({
            name: "",
            surname: "",
            phone: "",
            email: "",
            kvkkConsent: false,
            signature: null,
          })
          setShowSuccess(false)
          setIsSubmitting(false)
        }, 3000)
      } else {
        setSubmitError(combinedErrorMessage.join(" ve "))
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Beklenmedik bir hata oluştu:", error)
      setSubmitError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.")
      setIsSubmitting(false)
    }
  }

  const handleSignatureComplete = (signatureData: string) => {
    setFormData((prev) => ({ ...prev, signature: signatureData }))
    setShowSignatureModal(false)
    submitFormData(signatureData)
  }

  if (showSuccess) {
    return <SuccessMessage />
  }

  return (
    <>
      <Card className="w-full shadow-2xl border-0 rounded-3xl overflow-hidden bg-makro-white">
        <CardHeader className="bg-gradient-to-r from-makro-navy to-makro-navy-light text-makro-white p-8">
          <CardTitle className="text-3xl md:text-4xl text-center font-bold flex items-center justify-center space-x-4">
            <User className="w-10 h-10" />
            <span>Ziyaretçi Bilgileri</span>
          </CardTitle>
          <p className="text-center text-makro-white/90 text-lg mt-4">Güvenli kayıt için bilgilerinizi giriniz</p>
        </CardHeader>
        <CardContent className="p-8 md:p-12 space-y-8">
          {submitError && (
            <Alert variant="destructive" className="border-red-500 bg-red-50 rounded-2xl p-6">
              <AlertCircle className="h-6 w-6" />
              <AlertDescription className="text-lg font-medium ml-2">{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label htmlFor="name" className="text-xl font-bold text-makro-navy flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Ad *</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`h-16 text-xl border-3 rounded-2xl ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:border-makro-orange focus:ring-4 focus:ring-makro-orange/20 bg-makro-white shadow-lg`}
                placeholder="Adınızı giriniz"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-red-500 text-lg font-semibold">{errors.name}</p>}
            </div>

            <div className="space-y-4">
              <Label htmlFor="surname" className="text-xl font-bold text-makro-navy flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Soyad *</span>
              </Label>
              <Input
                id="surname"
                type="text"
                value={formData.surname}
                onChange={(e) => handleInputChange("surname", e.target.value)}
                className={`h-16 text-xl border-3 rounded-2xl ${
                  errors.surname ? "border-red-500" : "border-gray-300"
                } focus:border-makro-orange focus:ring-4 focus:ring-makro-orange/20 bg-makro-white shadow-lg`}
                placeholder="Soyadınızı giriniz"
                disabled={isSubmitting}
              />
              {errors.surname && <p className="text-red-500 text-lg font-semibold">{errors.surname}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="phone" className="text-xl font-bold text-makro-navy flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Telefon Numarası *</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`h-16 text-xl border-3 rounded-2xl ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:border-makro-orange focus:ring-4 focus:ring-makro-orange/20 bg-makro-white shadow-lg`}
              placeholder="0555 123 45 67"
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-red-500 text-lg font-semibold">{errors.phone}</p>}
          </div>

          <div className="space-y-4">
            <Label htmlFor="email" className="text-xl font-bold text-makro-navy flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>E-posta Adresi</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`h-16 text-xl border-3 rounded-2xl ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:border-makro-orange focus:ring-4 focus:ring-makro-orange/20 bg-makro-white shadow-lg`}
              placeholder="ornek@email.com (isteğe bağlı)"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-red-500 text-lg font-semibold">{errors.email}</p>}
          </div>

          <KvkkSection
            checked={formData.kvkkConsent}
            onChange={(checked) => handleInputChange("kvkkConsent", checked)}
            error={errors.kvkk}
          />

          <div className="pt-8">
            <Button
              onClick={handleSignClick}
              disabled={isSubmitting}
              className="w-full h-20 text-2xl font-bold bg-gradient-to-r from-makro-orange to-makro-orange-light hover:from-makro-orange-dark hover:to-makro-orange disabled:bg-gray-400 disabled:cursor-not-allowed text-makro-white rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-8 h-8 mr-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                "İmzala ve Gönder"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => !isSubmitting && setShowSignatureModal(false)}
        onSignatureComplete={handleSignatureComplete}
      />
    </>
  )
}
