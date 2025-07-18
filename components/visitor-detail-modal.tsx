"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, User, Phone, Mail, CheckCircle, XCircle, Calendar, FilePenLineIcon as Signature } from "lucide-react"

interface Visitor {
  id: string
  name: string
  surname: string
  phone: string
  email: string | null
  kvkk_consent: boolean
  signature_image: string | null
  created_at: string
}

interface VisitorDetailModalProps {
  isOpen: boolean
  onClose: () => void
  visitor: Visitor | null
}

export default function VisitorDetailModal({ isOpen, onClose, visitor }: VisitorDetailModalProps) {
  if (!visitor) return null

  const formattedDate = new Date(visitor.created_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-makro-gray rounded-3xl border-0 shadow-2xl overflow-hidden">
        <DialogHeader className="p-8 pb-6 bg-gradient-to-r from-makro-navy to-makro-navy-light text-makro-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl md:text-4xl font-bold flex items-center space-x-4">
              <User className="w-10 h-10" />
              <span>Ziyaretçi Detayları</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-makro-white hover:bg-makro-navy-light h-14 w-14 rounded-2xl"
            >
              <X className="h-8 w-8" />
            </Button>
          </div>
          <DialogDescription className="text-makro-white/90 text-xl md:text-2xl mt-4 text-center">
            Ziyaretçi kaydının tüm detayları
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 md:p-10 space-y-8 bg-makro-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-makro-navy flex items-center space-x-2">
                <User className="w-6 h-6 text-makro-orange" />
                <span>Ad Soyad:</span>
              </h3>
              <p className="text-lg text-gray-800 font-medium">{`${visitor.name} ${visitor.surname}`}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-makro-navy flex items-center space-x-2">
                <Phone className="w-6 h-6 text-makro-orange" />
                <span>Telefon:</span>
              </h3>
              <p className="text-lg text-gray-800 font-medium">{visitor.phone}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-makro-navy flex items-center space-x-2">
                <Mail className="w-6 h-6 text-makro-orange" />
                <span>E-posta:</span>
              </h3>
              <p className="text-lg text-gray-800 font-medium">{visitor.email || "Belirtilmemiş"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-makro-navy flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-makro-orange" />
                <span>Kayıt Tarihi:</span>
              </h3>
              <p className="text-lg text-gray-800 font-medium">{formattedDate}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-xl font-bold text-makro-navy flex items-center space-x-2">
                {visitor.kvkk_consent ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <span>KVKK Onayı:</span>
              </h3>
              <p className="text-lg text-gray-800 font-medium">{visitor.kvkk_consent ? "Onaylandı" : "Onaylanmadı"}</p>
            </div>
          </div>

          {visitor.signature_image && (
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-makro-navy flex items-center space-x-2">
                <Signature className="w-6 h-6 text-makro-orange" />
                <span>İmza:</span>
              </h3>
              <div className="bg-makro-gray/50 p-4 rounded-xl border border-gray-200 flex justify-center items-center">
                <img
                  src={visitor.signature_image || "/placeholder.svg"}
                  alt="Ziyaretçi İmzası"
                  className="max-w-full h-auto max-h-64 object-contain rounded-md shadow-md border border-gray-300"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
