"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, Shield } from "lucide-react"

interface KvkkSectionProps {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
}

const KVKK_TEXT = `
KVKK Aydınlatma Metni

Makro Makina olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin işlenmesine ilişkin aşağıdaki bilgileri sizlerle paylaşıyoruz:

Veri Sorumlusu: Makro Makina Sanayi ve Ticaret A.Ş.

Kişisel Verilerin İşlenme Amacı:
- Ziyaretçi kayıt ve takip işlemlerinin gerçekleştirilmesi
- Güvenlik tedbirlerinin alınması
- Yasal yükümlülüklerin yerine getirilmesi
- İletişim faaliyetlerinin yürütülmesi

İşlenen Kişisel Veri Kategorileri:
- Kimlik bilgileri (ad, soyad)
- İletişim bilgileri (telefon, e-posta)
- İmza bilgileri

Kişisel Verilerin Aktarılabileceği Üçüncü Kişiler:
- Yasal yükümlülükler çerçevesinde kamu kurum ve kuruluşları
- Hizmet aldığımız üçüncü kişi kuruluşlar

Kişisel Veri Sahibinin Hakları:
- Kişisel verilerinin işlenip işlenmediğini öğrenme
- İşlenen kişisel verileri hakkında bilgi talep etme
- İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
- Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme
- Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme
- Kişisel verilerin silinmesini veya yok edilmesini isteme
- Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme
- İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme
- Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme

Bu haklarınızı kullanmak için info@makromakina.com adresine başvurabilirsiniz.
`

export default function KvkkSection({ checked, onChange, error }: KvkkSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-6">
      <div className="border-3 border-makro-orange/30 rounded-3xl p-6 bg-gradient-to-br from-makro-white to-makro-gray/30 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-makro-navy flex items-center space-x-3">
            <Shield className="w-7 h-7 text-makro-orange" />
            <span>KVKK Aydınlatma Metni</span>
          </h3>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-12 px-6 text-makro-orange hover:text-makro-orange-dark hover:bg-makro-orange/10 rounded-2xl font-semibold text-lg"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-6 h-6 mr-2" />
                Gizle
              </>
            ) : (
              <>
                <ChevronDown className="w-6 h-6 mr-2" />
                Metni Göster
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="bg-makro-white p-6 rounded-2xl max-h-80 overflow-y-auto border-2 border-makro-gray shadow-inner">
            <pre className="text-base text-makro-navy whitespace-pre-wrap font-sans leading-relaxed">{KVKK_TEXT}</pre>
          </div>
        )}
      </div>

      <div className="flex items-start space-x-4 p-6 bg-makro-white rounded-3xl shadow-xl border-2 border-makro-orange/20">
        <Checkbox
          id="kvkk-consent"
          checked={checked}
          onCheckedChange={(checked) => onChange(checked as boolean)}
          className={`mt-2 h-8 w-8 rounded-xl border-3 ${error ? "border-red-500" : "border-makro-navy"} data-[state=checked]:bg-makro-orange data-[state=checked]:border-makro-orange`}
        />
        <div className="flex-1">
          <label
            htmlFor="kvkk-consent"
            className="text-xl font-semibold text-makro-navy cursor-pointer leading-relaxed"
          >
            KVKK Aydınlatma Metnini okudum, anladım ve kişisel verilerimin işlenmesini onaylıyorum. *
          </label>
          {error && <p className="text-red-500 text-lg font-semibold mt-3">{error}</p>}
        </div>
      </div>
    </div>
  )
}
