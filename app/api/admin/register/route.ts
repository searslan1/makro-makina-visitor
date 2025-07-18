import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "E-posta ve parola gerekli.", success: false }, { status: 400 })
    }

    const supabase = createServiceClient()

    // E-postanın zaten kayıtlı olup olmadığını kontrol et
    const { data: existingAdmin, error: fetchError } = await supabase
      .from("admins")
      .select("id")
      .eq("email", email)
      .single()

    if (existingAdmin) {
      return NextResponse.json({ message: "Bu e-posta adresi zaten kayıtlı.", success: false }, { status: 409 })
    }

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means "no rows found" which is expected
      console.error("Admin kontrolü sırasında Supabase hatası:", fetchError)
      return NextResponse.json({ message: "Veritabanı hatası.", success: false }, { status: 500 })
    }

    // Parolayı hashle
    const hashedPassword = await bcrypt.hash(password, 10) // 10 salt round

    // Yeni admini veritabanına ekle
    const { data, error } = await supabase.from("admins").insert([{ email: email, password_hash: hashedPassword }])

    if (error) {
      console.error("Yeni admin kaydederken hata oluştu:", error)
      return NextResponse.json(
        { message: `Yönetici kaydı başarısız: ${error.message || "Bilinmeyen bir hata oluştu."}`, success: false },
        { status: 500 },
      )
    }

    console.log("Yeni admin başarıyla kaydedildi:", data)
    return NextResponse.json({ message: "Yeni yönetici başarıyla eklendi.", success: true }, { status: 201 })
  } catch (error) {
    console.error("API Endpoint: Yeni admin kaydederken beklenmedik bir hata oluştu:", error)
    return NextResponse.json(
      { message: "Yönetici kaydederken beklenmedik bir hata oluştu.", success: false },
      { status: 500 },
    )
  }
}
