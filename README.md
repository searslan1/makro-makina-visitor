# makro-makina-visitor
# Makro Makina Ziyaretçi Yönetim Sistemi

## Genel Bakış

Bu proje, Makro Makina için ziyaretçilerin hızlı, kolay ve KVKK uyumlu şekilde kayıt altına alınmasını sağlar. 
Kullanıcılar bir tablet üzerinden ad, soyad, telefon, (isteğe bağlı) e-posta bilgilerini girer, KVKK metnini onaylar ve dokunmatik imza atar. 
Tüm veriler güvenli şekilde Supabase veritabanında saklanır ve yönetici panelinden sadece adminler tarafından görüntülenebilir.

Kurumsal amaçlar ve sürdürülebilir kullanım için geliştirilmiştir.

---

## Özellikler

- **Modern Form Arayüzü**: Dokunmatik ekranlara uygun, kullanıcı dostu ve kurumsal tasarım.
- **KVKK Onayı**: Kayıt öncesi zorunlu onay kutusu ve metni.
- **Dijital İmza**: Ziyaretçi parmağıyla imza atabilir, imza PNG olarak saklanır.
- **Supabase Entegrasyonu**: Tüm veriler bulutta, güvenli şekilde saklanır.
- **Admin Paneli**: Sadece giriş yapan adminler ziyaretçi kayıtlarını görebilir, filtreleyebilir ve dışa aktarabilir.
- **E-posta Bildirimi (opsiyonel)**: Her yeni kayıtta yöneticilere otomatik mail.
- **Güvenli Giriş Sistemi**: Bcrypt ile hash’lenmiş parolalar, güvenli oturum yönetimi.
- **WebView Destekli Mobil Uygulama**: Expo ile hazırlanan mobil uygulama (APK) üzerinden form doğrudan kullanılabilir.

---

## Kullanılan Teknolojiler

- **Next.js** (React tabanlı, SSR destekli web uygulama çatısı)
- **Supabase** (PostgreSQL tabanlı, bulut veritabanı ve authentication)
- **Expo + React Native WebView** (Tablet/mobil için)
- **Shadcn/UI + TailwindCSS** (Modern ve responsive arayüz)
- **EmailJS** (Opsiyonel: E-posta bildirim servisi)
- **bcryptjs** (Parola hashleme ve doğrulama)
- **TypeScript** (Güvenli, tip kontrollü geliştirme)

---


