"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, ArrowLeft } from "lucide-react"
import type { Screen } from "@/app/page"

interface WaitingForRideScreenProps {
  onNavigate: (screen: Screen) => void
}

export function WaitingForRideScreen({ onNavigate }: WaitingForRideScreenProps) {
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const initialDragY = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate("during-ride")
    }, 10000) // Changed from 30 seconds to 10 seconds

    return () => clearTimeout(timer)
  }, [onNavigate])

  const driverInfo = {
    name: "Michael Johnson",
    vehicle: "Silver Honda Civic",
    plate: "6Z47DJ1",
    rating: "4.9",
    photo: "/placeholder.svg?height=60&width=60",
  }

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

  React.useEffect(() => {
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

        {/* Pickup spot button */}
        <div className="absolute top-20 left-4 flex gap-2">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg border">
            <span className="text-gray-800 font-medium">Pickup spot</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg border">
            <span className="text-gray-600">Change</span>
          </div>
        </div>

        {/* Location markers */}
        <div className="absolute top-32 left-16 bg-white bg-opacity-90 text-gray-800 px-3 py-2 rounded-lg text-sm shadow-lg border">
          <div className="font-medium">Sherman Circle and Kansas Ave nw</div>
          <div className="text-xs opacity-75 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Meet the driver here
          </div>
        </div>

        {/* ETA badge */}
        <div className="absolute top-32 right-16 bg-black text-white px-3 py-2 rounded text-lg font-bold">
          2<br />
          min
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
        style={{ height: "45vh" }}
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
          {/* Driver arriving message */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-1">{driverInfo.name} is Arriving in</h1>
            <div className="text-3xl font-bold text-gray-800">2 min</div>
          </div>

          {/* Driver info card */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4">
              <img
                src={driverInfo.photo || "/placeholder.svg"}
                alt="Driver"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold">{driverInfo.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{driverInfo.plate}</div>
                <div className="text-gray-600">{driverInfo.vehicle}</div>
              </div>
              <img
                src="/placeholder.svg?height=80&width=120"
                alt="Vehicle"
                className="w-20 h-12 object-cover rounded"
              />
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
              Send a message
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
