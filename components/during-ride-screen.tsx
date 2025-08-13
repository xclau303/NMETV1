"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, ArrowLeft, Navigation } from "lucide-react"
import type { Screen } from "@/app/page"

interface DuringRideScreenProps {
  onNavigate: (screen: Screen) => void
}

export function DuringRideScreen({ onNavigate }: DuringRideScreenProps) {
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const initialDragY = useRef(0)

  const driverInfo = {
    name: "Michael Johnson",
    vehicle: "Silver Honda Civic",
    plate: "6Z47DJ1",
    rating: "4.9",
    photo: "/placeholder.svg?height=60&width=60",
  }

  const rideDetails = {
    pickup: "Sherman Circle and Kansas Ave nw",
    destination: "City Hospital",
    eta: "12 min",
    distance: "3.2 miles",
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate("post-ride")
    }, 10000) // 10 seconds

    return () => clearTimeout(timer)
  }, [onNavigate])

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY
    startY.current = clientY
    initialDragY.current = dragY

    if ("touches" in event) {
      event.preventDefault()
    }
  }

  const handleDragMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY
    const deltaY = clientY - startY.current
    const newDragY = initialDragY.current + deltaY

    const maxDrag = 150
    setDragY(Math.max(0, Math.min(maxDrag, newDragY)))
  }

  const handleDragEnd = () => {
    setIsDragging(false)

    const snapThreshold = 75
    if (dragY > snapThreshold) {
      setDragY(150) // Minimized position
    } else {
      setDragY(0) // Full position
    }
  }

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e)
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault()
        handleDragMove(e)
      }
      const handleMouseUp = () => handleDragEnd()
      const handleTouchEnd = () => handleDragEnd()

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchend", handleTouchEnd)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, dragY])

  return (
    <div className="relative bg-gray-100 min-h-screen overflow-hidden">
      {/* Map background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-200">
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 400 800" className="text-gray-400">
            <path d="M0 200 L400 200" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M0 400 L400 400" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M0 600 L400 600" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M100 0 L100 800" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M200 0 L200 800" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M300 0 L300 800" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          </svg>
        </div>

        {/* Route visualization */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 80 160 Q 200 120 320 200 Q 350 250 300 350"
            stroke="#3B82F6"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,5"
            opacity="0.8"
          />
        </svg>

        {/* Current location marker */}
        <div className="absolute top-40 left-20 bg-blue-600 text-white p-2 rounded-full">
          <Navigation className="h-4 w-4" />
        </div>

        {/* Destination marker */}
        <div className="absolute top-60 right-20 bg-white bg-opacity-90 text-gray-800 px-3 py-2 rounded-lg text-sm shadow-lg border">
          <div className="font-medium">City Hospital</div>
          <div className="text-xs opacity-75 flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Destination
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => onNavigate("dashboard")}
          className="bg-white bg-opacity-90 text-gray-800 p-3 rounded-full hover:bg-opacity-100 transition-all shadow-lg border"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom sheet */}
      <motion.div
        ref={dragRef}
        animate={{ y: dragY }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
          duration: isDragging ? 0 : 0.3,
        }}
        className="absolute bottom-0 left-0 right-0 bg-white text-gray-800 rounded-t-3xl shadow-2xl z-10 border-t"
        style={{ height: "50vh" }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{ touchAction: "none" }}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"></div>
        </div>

        <div className="px-6 pb-6 h-full overflow-y-auto">
          {/* Trip progress */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-1">Arriving in {rideDetails.eta}</h1>
            <div className="text-sm text-gray-600">{rideDetails.distance} away</div>
          </div>

          {/* Route info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">From</span>
            </div>
            <div className="text-gray-800 font-medium mb-4 ml-6">{rideDetails.pickup}</div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">To</span>
            </div>
            <div className="text-gray-800 font-medium ml-6">{rideDetails.destination}</div>
          </div>

          {/* Driver info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4">
              <img
                src={driverInfo.photo || "/placeholder.svg"}
                alt="Driver"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{driverInfo.name}</div>
                <div className="text-sm text-gray-600">
                  {driverInfo.vehicle} • {driverInfo.plate}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-medium">{driverInfo.rating}</span>
                  <span className="text-yellow-500 text-sm">★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-full border-gray-300 text-gray-700 bg-transparent"
              onClick={() => onNavigate("driver-chat")}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Message
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-gray-300 text-gray-700 bg-transparent"
              onClick={() => alert("Calling driver...")}
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-gray-300 text-gray-700 bg-transparent"
              onClick={() => alert("Emergency contact...")}
            >
              <span className="text-lg">🚨</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
