import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, currentPassword, newPassword } = await request.json()

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ message: "Tüm alanlar doldurulmalıdır.", success: false }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Admini e-posta ile bul
    const { data: admin, error: fetchError } = await supabase
      .from("admins")
      .select("id, password_hash")
      .eq("email", email)
      .single()

    if (fetchError || !admin) {
      console.error("Admin bulunamadı veya Supabase hatası:", fetchError)
      return NextResponse.json({ message: "Geçersiz e-posta veya mevcut parola.", success: false }, { status: 401 })
    }

    // Mevcut parolayı doğrula
    const passwordMatch = await bcrypt.compare(currentPassword, admin.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Geçersiz e-posta veya mevcut parola.", success: false }, { status: 401 })
    }

    // Yeni parolayı hashle
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Parolayı güncelle
    const { error: updateError } = await supabase
      .from("admins")
      .update({ password_hash: hashedNewPassword })
      .eq("id", admin.id)

    if (updateError) {
      console.error("Parola güncellenirken hata oluştu:", updateError)
      return NextResponse.json(
        {
          message: `Parola güncelleme başarısız: ${updateError.message || "Bilinmeyen bir hata oluştu."}`,
          success: false,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Parola başarıyla değiştirildi.", success: true }, { status: 200 })
  } catch (error) {
    console.error("API Endpoint: Parola değiştirme sırasında beklenmedik bir hata oluştu:", error)
    return NextResponse.json(
      { message: "Parola değiştirme sırasında beklenmedik bir hata oluştu.", success: false },
      { status: 500 },
    )
  }
}
