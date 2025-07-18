import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"
import bcrypt from "bcryptjs" // bcryptjs kütüphanesini kullanıyoruz

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = createServiceClient()
  let loginSuccess = false
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || request.ip || null

  try {
    if (!email || !password) {
      // Log attempt before returning error
      await supabase.from("login_attempts").insert([{ email: email || "N/A", ip_address: ipAddress, success: false }])
      return NextResponse.json({ message: "E-posta ve parola gerekli.", success: false }, { status: 400 })
    }

    // 'admins' tablosundan kullanıcıyı e-posta ile bul
    const { data: admin, error } = await supabase
      .from("admins")
      .select("email, password_hash") // Sadece e-posta ve hashlenmiş parolayı çek
      .eq("email", email)
      .single()

    if (error || !admin) {
      console.error("Admin bulunamadı veya Supabase hatası:", error)
      // Log attempt before returning error
      await supabase.from("login_attempts").insert([{ email: email, ip_address: ipAddress, success: false }])
      // Güvenlik için genel bir hata mesajı döndür
      return NextResponse.json({ message: "Geçersiz kimlik bilgileri.", success: false }, { status: 401 })
    }

    // Sağlanan parolayı veritabanındaki hashlenmiş parola ile karşılaştır
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)

    if (!passwordMatch) {
      console.warn("Parola eşleşmedi:", email)
      // Log attempt before returning error
      await supabase.from("login_attempts").insert([{ email: email, ip_address: ipAddress, success: false }])
      // Güvenlik için genel bir hata mesajı döndür
      return NextResponse.json({ message: "Geçersiz kimlik bilgileri.", success: false }, { status: 401 })
    }

    // Başarılı giriş
    loginSuccess = true
    await supabase.from("login_attempts").insert([{ email: email, ip_address: ipAddress, success: true }])
    return NextResponse.json({ message: "Giriş başarılı!", success: true }, { status: 200 })
  } catch (error) {
    console.error("Yönetici girişi sırasında beklenmedik bir hata oluştu:", error)
    // Log unexpected errors as failed attempts
    await supabase.from("login_attempts").insert([{ email: email || "N/A", ip_address: ipAddress, success: false }])
    return NextResponse.json(
      { message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.", success: false },
      { status: 500 },
    )
  }
}
