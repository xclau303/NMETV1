"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ArrowLeft, Search, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface MapLocationScreenProps {
  onNavigate: (screen: string, data: any) => void
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  goBack: () => void
  locationType?: "pickup" | "destination"
  currentPickup?: string
  currentDropoff?: string
}

export function MapLocationScreen({
  onNavigate,
  onLocationSelect,
  goBack,
  locationType = "destination",
  currentPickup = "",
  currentDropoff = "",
}: MapLocationScreenProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string }>({
    lat: 50,
    lng: 50,
    address: "26 n highland ave",
  })

  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    // Generate a mock address based on click position
    const addresses = [
      "26 n highland ave",
      "123 croton ave",
      "456 yale ave",
      "789 eastern ave",
      "321 ellis pl",
      "654 aqueduct st",
    ]
    const address = addresses[Math.floor(Math.random() * addresses.length)]

    setSelectedLocation({ lat: y, lng: x, address })
  }

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      if (locationType === "destination") {
        onNavigate("confirm-location", {
          pickupLocation: currentPickup,
          dropoffLocation: selectedLocation.address,
        })
      } else {
        // Setting pickup - go back to set-location screen
        onNavigate("set-location", {
          selectedAddress: selectedLocation.address,
          isFromMap: true,
          initialPickup: selectedLocation.address,
          initialDropoff: currentDropoff,
        })
      }
    }
  }

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY
    startY.current = clientY - dragY
  }

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return

    event.preventDefault()
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY
    const newY = clientY - startY.current
    const maxDrag = 120

    setDragY(Math.max(-maxDrag, Math.min(maxDrag, newY)))
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    const threshold = 60

    if (Math.abs(dragY) > threshold) {
      setDragY(dragY > 0 ? 120 : -120)
    } else {
      setDragY(0)
    }
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="bg-white text-gray-900 hover:bg-gray-50 rounded-full w-12 h-12 p-0 shadow-lg"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Crosshair/Target Button */}
      <div className="absolute bottom-80 right-4 z-30">
        <Button
          variant="ghost"
          size="sm"
          className="bg-white text-blue-600 hover:bg-blue-50 rounded-full w-12 h-12 p-0 shadow-lg"
        >
          <Target className="h-6 w-6" />
        </Button>
      </div>

      {/* Map Container */}
      <div
        className="w-full h-full relative cursor-crosshair"
        onClick={handleMapClick}
        style={{
          background: `
            radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(147, 197, 253, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)
          `,
        }}
      >
        {/* Street Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}>
          {/* Major roads */}
          <path d="M0,200 Q200,180 400,200 T800,200" stroke="#94a3b8" strokeWidth="4" fill="none" />
          <path d="M200,0 Q220,200 200,400 T200,800" stroke="#94a3b8" strokeWidth="4" fill="none" />
          <path d="M0,350 Q300,330 600,350 T1200,350" stroke="#94a3b8" strokeWidth="3" fill="none" />
          <path d="M400,0 Q420,300 400,600 T400,1200" stroke="#94a3b8" strokeWidth="3" fill="none" />

          {/* Minor streets */}
          <path d="M0,120 L800,140" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <path d="M0,280 L800,300" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <path d="M100,0 L120,600" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <path d="M300,0 L320,600" stroke="#cbd5e1" strokeWidth="2" fill="none" />
        </svg>

        {/* Street Labels */}
        <div
          className="absolute top-16 left-8 text-gray-700 text-sm font-medium transform -rotate-12"
          style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
        >
          SABRINA LN
        </div>
        <div
          className="absolute top-8 right-16 text-gray-700 text-sm font-medium transform rotate-12"
          style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
        >
          YALE AVE
        </div>
        <div
          className="absolute top-1/3 left-4 text-gray-700 text-sm font-medium transform -rotate-90"
          style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
        >
          N MALCOLM ST
        </div>
        <div
          className="absolute top-1/2 left-1/4 text-gray-700 text-sm font-medium transform rotate-6"
          style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
        >
          AQUEDUCT ST
        </div>
        <div
          className="absolute top-1/2 right-1/4 text-gray-700 text-sm font-medium"
          style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
        >
          CROTON AVE
        </div>
        <div
          className="absolute bottom-1/3 right-8 text-gray-700 text-sm font-medium"
          style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
        >
          EASTERN AVE
        </div>
        <div
          className="absolute bottom-16 left-1/2 text-gray-700 text-sm font-medium"
          style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
        >
          ELLIS PL
        </div>

        {/* Route 9 Shield */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-gray-200">
            <span className="text-gray-900 text-xs font-bold">9</span>
          </div>
        </div>

        {/* Center Pin (fixed) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-blue-600 shadow-lg"></div>
        </div>

        {/* Blue Location Dot */}
        <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>

        {/* Building Blocks */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-gray-300 shadow-sm border border-gray-400"></div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-gray-300 shadow-sm border border-gray-400"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-gray-300 shadow-sm border border-gray-400"></div>
        <div className="absolute bottom-1/4 right-1/2 w-3 h-3 bg-gray-300 shadow-sm border border-gray-400"></div>
      </div>

      {/* Draggable Bottom Sheet */}
      <motion.div
        ref={dragRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-30 shadow-2xl border-t border-gray-200"
        style={{ y: dragY }}
        animate={{ y: dragY }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6 cursor-grab active:cursor-grabbing"></div>

        <div className="text-center mb-4">
          <h2 className="text-gray-900 text-xl font-semibold mb-2">
            Set your {locationType === "pickup" ? "pickup location" : "destination"}
          </h2>
          <p className="text-gray-600 text-sm">Drag map to move pin</p>
        </div>

        {/* Address Input */}
        <div className="relative mb-6">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className={`w-2 h-2 rounded-full ${locationType === "pickup" ? "bg-green-600" : "bg-blue-600"}`}></div>
          </div>
          <input
            type="text"
            value={selectedLocation.address}
            onChange={(e) => setSelectedLocation((prev) => ({ ...prev, address: e.target.value }))}
            className="w-full bg-gray-50 text-gray-900 pl-8 pr-12 py-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder={`Enter ${locationType === "pickup" ? "pickup location" : "destination"}`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirmLocation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium text-lg"
        >
          Confirm {locationType === "pickup" ? "pickup location" : "destination"}
        </Button>
      </motion.div>
    </div>
  )
}
