"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, RotateCcw, PenTool } from "lucide-react"

interface SignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSignatureComplete: (signature: string) => void
}

interface Point {
  x: number
  y: number
}

export default function SignatureModal({ isOpen, onClose, onSignatureComplete }: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [lastPoint, setLastPoint] = useState<Point | null>(null)

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get device pixel ratio for high DPI displays
    const devicePixelRatio = window.devicePixelRatio || 1

    // Get the display size (CSS pixels)
    const displayWidth = canvas.offsetWidth
    const displayHeight = canvas.offsetHeight

    // Set the actual size in memory (scaled up for high DPI)
    canvas.width = displayWidth * devicePixelRatio
    canvas.height = displayHeight * devicePixelRatio

    // Scale the canvas back down using CSS
    canvas.style.width = displayWidth + "px"
    canvas.style.height = displayHeight + "px"

    // Scale the drawing context so everything draws at the correct size
    ctx.scale(devicePixelRatio, devicePixelRatio)

    // Set drawing styles
    ctx.strokeStyle = "#0b2847" // Makro navy color
    ctx.lineWidth = 4
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.imageSmoothingEnabled = true

    // Fill with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, displayWidth, displayHeight)

    // Add subtle border with Makro colors
    ctx.strokeStyle = "#ff9000"
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, displayWidth - 4, displayHeight - 4)

    // Reset stroke style for drawing
    ctx.strokeStyle = "#0b2847"
    ctx.lineWidth = 4
  }, [])

  const getEventPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    let clientX: number, clientY: number

    if ("touches" in e) {
      // Touch event
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if (e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX
        clientY = e.changedTouches[0].clientY
      } else {
        return { x: 0, y: 0 }
      }
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    // Calculate coordinates relative to canvas
    const x = clientX - rect.left
    const y = clientY - rect.top

    return { x, y }
  }, [])

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Sadece canvas içindeki touch'ları handle et
      const target = e.target as HTMLElement
      if (target.tagName !== "CANVAS") return

      e.preventDefault()
      e.stopPropagation()

      const point = getEventPoint(e)
      setIsDrawing(true)
      setLastPoint(point)

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
    },
    [getEventPoint],
  )

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Sadece canvas içindeki touch'ları handle et
      const target = e.target as HTMLElement
      if (target.tagName !== "CANVAS") return

      e.preventDefault()
      e.stopPropagation()

      if (!isDrawing || !lastPoint) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const currentPoint = getEventPoint(e)

      ctx.beginPath()
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(currentPoint.x, currentPoint.y)
      ctx.stroke()

      setLastPoint(currentPoint)
      setHasSignature(true)
    },
    [isDrawing, lastPoint, getEventPoint],
  )

  const stopDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Sadece canvas içindeki touch'ları handle et
    const target = e.target as HTMLElement
    if (target.tagName !== "CANVAS") return

    e.preventDefault()
    e.stopPropagation()

    setIsDrawing(false)
    setLastPoint(null)
  }, [])

  const clearSignature = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const displayWidth = canvas.offsetWidth
    const displayHeight = canvas.offsetHeight

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, displayWidth, displayHeight)

    ctx.strokeStyle = "#ff9000"
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, displayWidth - 4, displayHeight - 4)

    ctx.strokeStyle = "#0b2847"
    ctx.lineWidth = 4

    setHasSignature(false)
  }, [])

  const saveSignature = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const canvas = canvasRef.current
      if (!canvas || !hasSignature) return

      const dataURL = canvas.toDataURL("image/png", 1.0)
      onSignatureComplete(dataURL)
    },
    [hasSignature, onSignatureComplete],
  )

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure canvas is rendered
      const timer = setTimeout(() => {
        setupCanvas()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, setupCanvas])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[95vh] p-0 bg-makro-gray rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="p-8 pb-6 bg-gradient-to-r from-makro-navy to-makro-navy-light text-makro-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl md:text-4xl font-bold flex items-center space-x-4">
              <PenTool className="w-10 h-10" />
              <span>Dijital İmza</span>
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
          <p className="text-makro-white/90 text-xl md:text-2xl mt-4 text-center">
            Parmağınızla aşağıdaki beyaz alana imzanızı atınız
          </p>
        </DialogHeader>

        <div className="flex-1 p-8 flex flex-col bg-makro-gray">
          <div className="flex-1 mb-8 relative">
            <div className="w-full h-full bg-makro-white rounded-3xl shadow-2xl border-4 border-makro-orange/20 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair block rounded-3xl"
                style={{
                  minHeight: "450px",
                  background: "white",
                  touchAction: "none",
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <PenTool className="w-16 h-16 text-makro-orange/40 mx-auto mb-4" />
                    <p className="text-makro-navy/60 text-2xl md:text-3xl font-bold mb-2">İmza Alanı</p>
                    <p className="text-makro-navy/40 text-xl">Parmağınızla bu alana imzanızı atın</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6 justify-center bg-makro-white p-6 rounded-3xl shadow-xl">
            <Button
              onClick={clearSignature}
              onTouchEnd={clearSignature}
              variant="outline"
              className="h-18 px-10 text-xl font-bold border-3 border-makro-navy text-makro-navy hover:bg-makro-navy hover:text-makro-white bg-makro-white min-w-[160px] rounded-2xl shadow-lg transition-all duration-300"
              style={{ touchAction: "manipulation" }}
            >
              <RotateCcw className="w-7 h-7 mr-3" />
              Temizle
            </Button>
            <Button
              onClick={saveSignature}
              onTouchEnd={saveSignature}
              disabled={!hasSignature}
              className="h-18 px-10 text-xl font-bold bg-gradient-to-r from-makro-orange to-makro-orange-light hover:from-makro-orange-dark hover:to-makro-orange disabled:bg-gray-300 disabled:cursor-not-allowed text-makro-white min-w-[160px] rounded-2xl shadow-lg transition-all duration-300"
              style={{ touchAction: "manipulation" }}
            >
              İmzayı Kaydet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
