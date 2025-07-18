"use client"

import { CheckCircle, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function SuccessMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-makro-gray via-makro-white to-makro-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl border-0 rounded-3xl overflow-hidden bg-makro-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-makro-navy to-makro-navy-light text-makro-white p-8">
          <div className="flex items-center justify-center space-x-6">
            {/* Logo */}
            <div className="w-16 h-16 bg-makro-orange rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-makro-white font-bold text-2xl">M</div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold">Makro Makina</h1>
              <div className="w-24 h-1 bg-makro-orange mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
        </div>

        <CardContent className="p-12 md:p-16 text-center">
          <div className="flex flex-col items-center space-y-8">
            {/* Success Icon */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-20 h-20 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-makro-orange rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-makro-white" />
              </div>
            </div>

            {/* Success Messages */}
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold text-green-600">Başarılı!</h2>
              <p className="text-3xl md:text-4xl text-makro-navy font-bold">Ziyaretçi kaydınız başarıyla tamamlandı.</p>
              <p className="text-2xl text-makro-navy/80 font-semibold">Makro Makina'ya hoş geldiniz!</p>
            </div>

            {/* Info Box */}
            <div className="mt-12 p-8 bg-gradient-to-r from-makro-orange/10 to-makro-orange/5 rounded-3xl border-2 border-makro-orange/20 shadow-lg">
              <p className="text-xl text-makro-navy font-semibold flex items-center justify-center space-x-3">
                <div className="w-3 h-3 bg-makro-orange rounded-full animate-pulse"></div>
                <span>Form otomatik olarak temizlenecek...</span>
                <div className="w-3 h-3 bg-makro-orange rounded-full animate-pulse"></div>
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex space-x-4 mt-8">
              <div className="w-4 h-4 bg-makro-orange rounded-full"></div>
              <div className="w-4 h-4 bg-makro-navy rounded-full"></div>
              <div className="w-4 h-4 bg-makro-orange rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
