"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { checkAdminAuth, logoutAdmin } from "@/lib/auth"
import { createBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Loader2,
  LogOut,
  Users,
  AlertCircle,
  Search,
  Calendar,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  UserPlus,
  Lock,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import VisitorDetailModal from "@/components/visitor-detail-modal"
import AdminRegisterForm from "@/components/admin-register-form"
import AdminPasswordChangeForm from "@/components/admin-password-change-form"

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

export default function AdminPanelPage() {
  const router = useRouter()
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [deleteStatus, setDeleteStatus] = useState<{ id: string; status: "deleting" | "success" | "error" } | null>(
    null,
  )
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRegisterAdminModal, setShowRegisterAdminModal] = useState(false)
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false)

  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 50
  const [totalCount, setTotalCount] = useState(0)

  const fetchVisitors = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createBrowserClient()
      let query = supabase.from("visitors").select("*", { count: "exact" })

      // İsim filtresi
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,surname.ilike.%${searchTerm}%`)
      }

      // Tarih aralığı filtresi
      if (startDate) {
        query = query.gte("created_at", startDate)
      }
      if (endDate) {
        // Bitiş tarihine bir gün ekleyerek o günün sonuna kadar olan kayıtları dahil et
        const endOfDay = new Date(endDate)
        endOfDay.setDate(endOfDay.getDate() + 1)
        query = query.lt("created_at", endOfDay.toISOString())
      }

      const from = currentPage * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error: supabaseError, count } = await query.order("created_at", { ascending: false })

      if (supabaseError) {
        console.error("Ziyaretçi verileri çekilirken hata:", supabaseError)
        setError(`Veri çekilirken hata oluştu: ${supabaseError.message}`)
      } else {
        setVisitors(data as Visitor[])
        setTotalCount(count || 0)
      }
    } catch (err) {
      console.error("Ziyaretçi verileri çekilirken beklenmedik hata:", err)
      setError("Ziyaretçi verileri yüklenirken bir sorun oluştu.")
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, startDate, endDate, currentPage, pageSize])

  useEffect(() => {
    if (!checkAdminAuth()) {
      router.push("/admin/login")
      return
    }
    fetchVisitors()
  }, [router, fetchVisitors, currentPage])

  const handleLogout = () => {
    logoutAdmin()
    router.push("/admin/login")
  }

  const exportToCSV = () => {
    if (visitors.length === 0) {
      alert("Dışa aktarılacak veri bulunmamaktadır.")
      return
    }

    const headers = [
      "ID",
      "Ad",
      "Soyad",
      "Telefon",
      "E-posta",
      "KVKK Onayı",
      "Kayıt Tarihi",
      "İmza (Base64)", // İmza verisi çok büyük olabileceği için not düşüldü
    ]
    const rows = visitors.map((visitor) => [
      visitor.id,
      visitor.name,
      visitor.surname,
      visitor.phone,
      visitor.email || "",
      visitor.kvkk_consent ? "Evet" : "Hayır",
      new Date(visitor.created_at).toLocaleString("tr-TR"),
      visitor.signature_image || "",
    ])

    let csvContent = headers.join(";") + "\n" // Semicolon (;) ile ayır
    rows.forEach((row) => {
      csvContent += row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(";") + "\n"
    })

    const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" }) // UTF-8 BOM ekle
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `makro_makina_ziyaretciler_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteVisitor = async (visitorId: string) => {
    setDeleteStatus({ id: visitorId, status: "deleting" })
    try {
      const supabase = createBrowserClient()
      const { error: supabaseError } = await supabase.from("visitors").delete().eq("id", visitorId)

      if (supabaseError) {
        console.error("Ziyaretçi silinirken hata:", supabaseError)
        setDeleteStatus({ id: visitorId, status: "error" })
        setError(`Ziyaretçi silinirken hata oluştu: ${supabaseError.message}`)
      } else {
        setVisitors((prevVisitors) => prevVisitors.filter((v) => v.id !== visitorId))
        setDeleteStatus({ id: visitorId, status: "success" })
        setTimeout(() => setDeleteStatus(null), 2000) // Başarı mesajını kısa süre göster
      }
    } catch (err) {
      console.error("Ziyaretçi silinirken beklenmedik hata:", err)
      setDeleteStatus({ id: visitorId, status: "error" })
      setError("Ziyaretçi silinirken bir sorun oluştu.")
    }
  }

  const handleRowClick = (visitor: Visitor) => {
    setSelectedVisitor(visitor)
    setShowDetailModal(true)
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }
  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-makro-gray via-makro-white to-makro-gray">
        <div className="flex flex-col items-center space-y-4 text-makro-navy">
          <Loader2 className="w-16 h-16 animate-spin" />
          <p className="text-2xl font-semibold">Ziyaretçiler Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error && !deleteStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-makro-gray via-makro-white to-makro-gray p-4">
        <Alert variant="destructive" className="w-full max-w-2xl border-red-500 bg-red-50 rounded-2xl p-6 shadow-lg">
          <AlertCircle className="h-6 w-6" />
          <AlertDescription className="text-lg font-medium ml-3">{error}</AlertDescription>
          <Button
            onClick={handleLogout}
            className="mt-6 w-full h-14 text-xl font-bold bg-makro-orange hover:bg-makro-orange-dark text-makro-white rounded-xl shadow-md"
          >
            <LogOut className="w-6 h-6 mr-3" />
            Çıkış Yap
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-makro-gray via-makro-white to-makro-gray p-6 md:p-10">
      <Card className="w-full max-w-7xl mx-auto shadow-2xl border-0 rounded-3xl overflow-hidden bg-makro-white">
        <CardHeader className="bg-gradient-to-r from-makro-navy to-makro-navy-light text-makro-white p-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <CardTitle className="text-3xl md:text-4xl font-bold flex items-center space-x-4">
            <Users className="w-10 h-10" />
            <span>Yönetici Paneli</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setShowPasswordChangeModal(true)}
              className="h-14 px-8 text-xl font-bold bg-makro-orange hover:bg-makro-orange-dark text-makro-white rounded-2xl shadow-lg transition-all duration-300"
            >
              <Lock className="w-6 h-6 mr-3" />
              Parola Değiştir
            </Button>
            <Button
              onClick={() => setShowRegisterAdminModal(true)}
              className="h-14 px-8 text-xl font-bold bg-makro-orange hover:bg-makro-orange-dark text-makro-white rounded-2xl shadow-lg transition-all duration-300"
            >
              <UserPlus className="w-6 h-6 mr-3" />
              Yeni Admin Ekle
            </Button>
            <Button
              onClick={handleLogout}
              className="h-14 px-8 text-xl font-bold bg-makro-orange hover:bg-makro-orange-dark text-makro-white rounded-2xl shadow-lg transition-all duration-300"
            >
              <LogOut className="w-6 h-6 mr-3" />
              Çıkış Yap
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-makro-navy mb-8 text-center">Ziyaretçi Kayıtları</h2>

          {/* Filtreleme ve Dışa Aktarma Alanı */}
          <div className="mb-8 p-6 bg-makro-gray/30 rounded-2xl shadow-inner border border-gray-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="search-name" className="text-lg font-semibold text-makro-navy flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  İsim/Soyisim Ara
                </Label>
                <Input
                  id="search-name"
                  type="text"
                  placeholder="Ad veya Soyad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 text-lg rounded-xl border-2 border-gray-300 focus:border-makro-orange focus:ring-2 focus:ring-makro-orange/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-lg font-semibold text-makro-navy flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Başlangıç Tarihi
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 text-lg rounded-xl border-2 border-gray-300 focus:border-makro-orange focus:ring-2 focus:ring-makro-orange/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-lg font-semibold text-makro-navy flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Bitiş Tarihi
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 text-lg rounded-xl border-2 border-gray-300 focus:border-makro-orange focus:ring-2 focus:ring-makro-orange/20"
                />
              </div>
            </div>
            <Button
              onClick={fetchVisitors}
              className="w-full md:w-auto h-14 px-8 text-xl font-bold bg-makro-navy hover:bg-makro-navy-light text-makro-white rounded-xl shadow-md transition-all duration-300"
            >
              <Search className="w-6 h-6 mr-3" />
              Filtrele
            </Button>
          </div>

          {/* Dışa Aktar Butonu */}
          <div className="mb-8 text-right">
            <Button
              onClick={exportToCSV}
              className="h-14 px-8 text-xl font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all duration-300"
            >
              <Download className="w-6 h-6 mr-3" />
              CSV Olarak Dışa Aktar
            </Button>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="h-12 px-6 text-lg font-bold bg-makro-navy hover:bg-makro-navy-light text-makro-white rounded-xl shadow-md transition-all duration-300"
            >
              Önceki
            </Button>
            <span>
              Sayfa {currentPage + 1} / {Math.ceil(totalCount / pageSize)}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={(currentPage + 1) * pageSize >= totalCount}
              className="h-12 px-6 text-lg font-bold bg-makro-navy hover:bg-makro-navy-light text-makro-white rounded-xl shadow-md transition-all duration-300"
            >
              Sonraki
            </Button>
          </div>

          {/* Silme Durumu Mesajı */}
          {deleteStatus && (
            <Alert
              className={`mb-4 rounded-2xl p-4 ${
                deleteStatus.status === "success"
                  ? "border-green-500 bg-green-50"
                  : deleteStatus.status === "error"
                    ? "border-red-500 bg-red-50"
                    : "border-blue-500 bg-blue-50"
              }`}
            >
              {deleteStatus.status === "deleting" && <Loader2 className="h-5 w-5 animate-spin" />}
              {deleteStatus.status === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
              {deleteStatus.status === "error" && <XCircle className="h-5 w-5 text-red-600" />}
              <AlertDescription className="text-base font-medium ml-2">
                {deleteStatus.status === "deleting"
                  ? "Kayıt siliniyor..."
                  : deleteStatus.status === "success"
                    ? "Kayıt başarıyla silindi."
                    : error}
              </AlertDescription>
            </Alert>
          )}

          {visitors.length === 0 ? (
            <div className="text-center text-xl text-gray-600 p-8 border-2 border-dashed border-gray-300 rounded-2xl">
              Filtreleme kriterlerinize uygun ziyaretçi kaydı bulunmamaktadır.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-makro-navy-light">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-left text-lg font-bold text-makro-white uppercase tracking-wider">
                      Ad Soyad
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-lg font-bold text-makro-white uppercase tracking-wider">
                      Telefon
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-lg font-bold text-makro-white uppercase tracking-wider">
                      E-posta
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-lg font-bold text-makro-white uppercase tracking-wider">
                      KVKK Onayı
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-lg font-bold text-makro-white uppercase tracking-wider">
                      İmza
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-lg font-bold text-makro-white uppercase tracking-wider">
                      Kayıt Tarihi
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-lg font-bold text-makro-white uppercase tracking-wider">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-makro-white divide-y divide-gray-200">
                  {visitors.map((visitor) => (
                    <TableRow
                      key={visitor.id}
                      className="hover:bg-makro-gray/20 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleRowClick(visitor)}
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-lg font-medium text-makro-navy">
                        {visitor.name} {visitor.surname}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-lg text-gray-700">
                        {visitor.phone}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-lg text-gray-700">
                        {visitor.email || "Yok"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-lg">
                        {visitor.kvkk_consent ? (
                          <span className="px-3 py-1 inline-flex text-lg leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Onaylı
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-lg leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Reddedildi
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {visitor.signature_image ? (
                          <img
                            src={visitor.signature_image || "/placeholder.svg"}
                            alt="Ziyaretçi İmzası"
                            className="h-16 w-auto object-contain border border-gray-300 rounded-md shadow-sm"
                          />
                        ) : (
                          <span className="text-gray-500 text-lg">Yok</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-lg text-gray-700">
                        {new Date(visitor.created_at).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="h-12 px-6 text-lg font-bold rounded-xl shadow-md"
                              onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
                            >
                              <Trash2 className="w-5 h-5 mr-2" />
                              Sil
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-makro-white rounded-2xl p-8 shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-bold text-makro-navy">
                                Kaydı Silmek İstediğinizden Emin Misiniz?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-lg text-gray-700 mt-4">
                                Bu işlem geri alınamaz. Ziyaretçi kaydı veritabanından kalıcı olarak silinecektir.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row-reverse sm:space-x-4 sm:space-x-reverse space-y-4 sm:space-y-0">
                              <AlertDialogAction asChild>
                                <Button
                                  onClick={() => handleDeleteVisitor(visitor.id)}
                                  className="h-14 px-8 text-xl font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all duration-300"
                                >
                                  <Trash2 className="w-6 h-6 mr-3" />
                                  Evet, Sil
                                </Button>
                              </AlertDialogAction>
                              <AlertDialogCancel asChild>
                                <Button
                                  variant="outline"
                                  className="h-14 px-8 text-xl font-bold border-2 border-makro-navy text-makro-navy hover:bg-makro-navy hover:text-makro-white bg-makro-white rounded-xl shadow-md transition-all duration-300"
                                >
                                  İptal
                                </Button>
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ziyaretçi Detay Modal */}
      <VisitorDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        visitor={selectedVisitor}
      />

      {/* Yeni Admin Ekle Modal */}
      <Dialog open={showRegisterAdminModal} onOpenChange={setShowRegisterAdminModal}>
        <DialogContent className="max-w-md p-0 bg-makro-gray rounded-3xl border-0 shadow-2xl overflow-hidden">
          <AdminRegisterForm
            onSuccess={() => setShowRegisterAdminModal(false)}
            onClose={() => setShowRegisterAdminModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Parola Değiştir Modal */}
      <Dialog open={showPasswordChangeModal} onOpenChange={setShowPasswordChangeModal}>
        <DialogContent className="max-w-md p-0 bg-makro-gray rounded-3xl border-0 shadow-2xl overflow-hidden">
          <AdminPasswordChangeForm
            onSuccess={() => setShowPasswordChangeModal(false)}
            onClose={() => setShowPasswordChangeModal(false)}
          />
        </DialogContent>
      </Dialog>
    </main>
  )
}
