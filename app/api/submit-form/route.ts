import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase" // Merkezi Supabase client'ınızı import ediyoruz

export async function POST(request: Request) {
  try {
    const formData = await request.json()

    // Supabase client'ı oluştur
    const supabase = createServiceClient()

    // Veritabanına eklenecek verileri hazırla
    const { name, surname, phone, email, kvkkConsent, signature } = formData

    // Supabase'deki 'visitors' tablosuna veri ekle
    const { data, error } = await supabase.from("visitors").insert([
      {
        name: name,
        surname: surname,
        phone: phone,
        email: email || null, // E-posta isteğe bağlı olduğu için null olabilir
        kvkk_consent: kvkkConsent,
        signature_image: signature, // İmza PNG verisi (base64 string)
        // created_at alanı Supabase'de default olarak now() ayarlıysa buraya eklemeye gerek yok
      },
    ])

    if (error) {
      console.error("Supabase'e veri kaydederken hata oluştu:", error)
      // Supabase hatasını daha anlaşılır bir JSON mesajla döndür
      return NextResponse.json(
        { message: `Veritabanı kaydı başarısız: ${error.message || "Bilinmeyen bir hata oluştu."}`, success: false },
        { status: 500 },
      )
    }

    console.log("Supabase'e veri başarıyla kaydedildi:", data)
    return NextResponse.json(
      { message: "Form verileri veritabanına başarıyla kaydedildi.", success: true },
      { status: 200 },
    )
  } catch (error) {
    console.error("API Endpoint: Form verilerini işlerken beklenmedik bir hata oluştu:", error)
    // Beklenmedik hataları her zaman JSON olarak döndür
    return NextResponse.json(
      { message: "Form verilerini işlerken beklenmedik bir hata oluştu.", success: false },
      { status: 500 },
    )
  }
}
