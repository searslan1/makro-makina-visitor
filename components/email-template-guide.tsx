"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailTemplateGuide() {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">EmailJS Template Rehberi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">EmailJS Template Parametreleri</h3>
          <p className="text-blue-700 mb-4">EmailJS dashboard'ınızda aşağıdaki parametreleri kullanabilirsiniz:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Ziyaretçi Bilgileri:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>
                  <code>{"{{visitor_name}}"}</code> - Ad
                </li>
                <li>
                  <code>{"{{visitor_surname}}"}</code> - Soyad
                </li>
                <li>
                  <code>{"{{visitor_full_name}}"}</code> - Ad Soyad
                </li>
                <li>
                  <code>{"{{visitor_phone}}"}</code> - Telefon
                </li>
                <li>
                  <code>{"{{visitor_email}}"}</code> - E-posta
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Sistem Bilgileri:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>
                  <code>{"{{submission_date}}"}</code> - Tarih
                </li>
                <li>
                  <code>{"{{submission_time}}"}</code> - Saat
                </li>
                <li>
                  <code>{"{{submission_datetime}}"}</code> - Tarih/Saat
                </li>
                <li>
                  <code>{"{{kvkk_consent}}"}</code> - KVKK Onayı
                </li>
                <li>
                  <code>{"{{company_name}}"}</code> - Şirket Adı
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">İmza Görüntüleme</h3>
          <p className="text-green-700 mb-3">İmzayı e-postada göstermek için HTML template'inde:</p>
          <div className="bg-white p-3 rounded border">
            <code className="text-sm text-gray-800">
              {
                '<img src="{{signature_image}}" alt="Ziyaretçi İmzası" style="max-width: 300px; border: 1px solid #ccc;" />'
              }
            </code>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800">Örnek E-posta Template</h3>
          <div className="bg-white p-4 rounded border text-sm">
            <pre className="whitespace-pre-wrap text-gray-800">{`Makro Makina - Yeni Ziyaretçi Kaydı

Ziyaretçi Bilgileri:
- Ad Soyad: {{visitor_full_name}}
- Telefon: {{visitor_phone}}
- E-posta: {{visitor_email}}

Kayıt Bilgileri:
- Tarih: {{submission_datetime}}
- KVKK Onayı: {{kvkk_consent}}

Ziyaretçi İmzası:
<img src="{{signature_image}}" alt="İmza" style="max-width: 300px; border: 1px solid #ddd; margin: 10px 0;" />

Bu e-posta otomatik olarak oluşturulmuştur.`}</pre>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-red-800">Önemli Notlar</h3>
          <ul className="space-y-2 text-red-700">
            <li>• EmailJS hesabınızdan Service ID, Template ID ve Public Key'i alın</li>
            <li>• Template'i EmailJS dashboard'ında oluşturun</li>
            <li>• İmza PNG formatında base64 string olarak gönderilir</li>
            <li>• E-posta boyutu sınırları nedeniyle imza boyutunu kontrol edin</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
