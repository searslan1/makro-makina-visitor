import VisitorForm from "@/components/visitor-form"


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-makro-gray via-makro-white to-makro-gray">
      {/* Header Section */}
      <div className="bg-makro-navy shadow-2xl">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center space-x-6">
            {/* Logo Placeholder */}
            <div className="w-auto h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
              <img src="/images/makro-logo.png" alt="Makro Makina Logo" className="h-full w-auto object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-makro-white mb-2 tracking-wide">Makro Makina</h1>
              <div className="w-32 h-1 bg-makro-orange mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-makro-navy mb-4">Ziyaretçi Kayıt Sistemi</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Güvenli ve hızlı kayıt için lütfen bilgilerinizi eksiksiz doldurunuz
          </p>
        </div>


        {/* Form */}
        <VisitorForm />
      </div>

      {/* Footer */}
      <footer className="bg-makro-navy mt-16">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">
            <p className="text-makro-white/80 text-lg">© 2025 Makro Makina - Tüm hakları saklıdır</p>
            <div className="w-24 h-1 bg-makro-orange mx-auto mt-4 rounded-full"></div>
          </div>
        </div>
      </footer>
    </main>
  )
}
