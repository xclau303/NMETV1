"use client"

import React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Car, Accessibility, ArrowLeft } from "lucide-react"
import type { Screen } from "@/app/page"

interface ChooseRideScreenProps {
  onNavigate: (screen: Screen, data?: any) => void
  pickupLocation?: string
  dropoffLocation?: string
  scheduledDate?: string
  scheduledTime?: string
  isScheduled?: boolean
  onBookRide?: (rideData: any) => void // Added callback to create upcoming rides
  goBack: () => void
}

export function ChooseRideScreen({
  onNavigate,
  pickupLocation,
  dropoffLocation,
  scheduledDate,
  scheduledTime,
  isScheduled = false,
  onBookRide, // Added onBookRide prop
  goBack,
}: ChooseRideScreenProps) {
  const [selectedRideType, setSelectedRideType] = useState<string | null>(null)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const initialDragY = useRef(0)

  const getArrivalTime = () => {
    const now = new Date()
    const arrivalTime = new Date(now.getTime() + 4 * 60 * 1000) // Add 4 minutes
    return arrivalTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const rideTypes = [
    {
      id: "standard",
      name: "Car Type",
      icon: <Car className="h-8 w-8 text-blue-600" />,
      price: "$15.00",
      arrivalTime: getArrivalTime(), // Use dynamic time instead of static "11:44pm"
      awayTime: "4 min away",
    },
    {
      id: "wheelchair",
      name: "Wheelchair Van",
      icon: <Accessibility className="h-8 w-8 text-blue-600" />,
      price: "$25.00",
      arrivalTime: getArrivalTime(), // Use dynamic time instead of static "11:44pm"
      awayTime: "4 min away",
    },
  ]

  const handleSelectRide = (id: string) => {
    setSelectedRideType(id)
  }

  const handleConfirmRide = () => {
    if (selectedRideType) {
      const selectedRide = rideTypes.find((ride) => ride.id === selectedRideType)

      const rideData = {
        pickupLocation,
        dropoffLocation,
        scheduledDate,
        scheduledTime,
        isScheduled,
        vehicleType: selectedRide?.name,
        price: selectedRide?.price,
      }

      // Add to upcoming rides
      if (onBookRide) {
        onBookRide(rideData)
      }

      if (isScheduled) {
        onNavigate("reservation-confirmed", rideData)
      } else {
        onNavigate("waiting-for-ride")
      }
    } else {
      alert("Please select a ride type.")
    }
  }

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY
    startY.current = clientY
    initialDragY.current = dragY

    // Prevent default to avoid scrolling on mobile
    if ("touches" in event) {
      event.preventDefault()
    }
  }

  const handleDragMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY
    const deltaY = clientY - startY.current
    const newDragY = initialDragY.current + deltaY

    const maxDrag = 120
    setDragY(Math.max(0, Math.min(maxDrag, newDragY)))
  }

  const handleDragEnd = () => {
    setIsDragging(false)

    const snapThreshold = 60
    if (dragY > snapThreshold) {
      setDragY(120) // Minimized position - shows header, promo, and first ride option
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

  const formatScheduledDate = () => {
    if (!scheduledDate || !scheduledTime) return ""
    const date = new Date(scheduledDate)
    const timeString = new Date(`2000-01-01T${scheduledTime}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    return `${date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${timeString}`
  }

  return (
    <div className="relative bg-gray-100 min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-200">
        {/* Map-like background pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 400 800" className="text-gray-400">
            {/* Street lines */}
            <path d="M0 200 L400 200" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M0 400 L400 400" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M0 600 L400 600" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M100 0 L100 800" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M200 0 L200 800" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <path d="M300 0 L300 800" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            {/* Curved roads */}
            <path
              d="M50 100 Q 200 50 350 100 T 350 300 Q 200 350 50 300 T 50 500"
              stroke="#3B82F6"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,5"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Location markers */}
        <div className="absolute top-32 left-16 bg-white bg-opacity-90 text-gray-800 px-3 py-2 rounded-lg text-sm shadow-lg border">
          <div className="font-medium">{pickupLocation || "Ossining Public Library"}</div>
          <div className="text-xs opacity-75 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>8 MIN
          </div>
        </div>

        <div className="absolute top-48 right-20 bg-white bg-opacity-90 text-gray-800 px-3 py-2 rounded-lg text-sm shadow-lg border">
          <div className="font-medium">{dropoffLocation || "Sherwood Townhouses"}</div>
          <div className="text-xs opacity-75 flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Destination
          </div>
        </div>

        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 80 160 Q 200 120 320 200"
            stroke="#3B82F6"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,5"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={goBack}
          className="bg-white bg-opacity-90 text-gray-800 p-3 rounded-full hover:bg-opacity-100 transition-all shadow-lg border"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

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
          <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">Choose a ride</h1>

          {/* Ride options */}
          <div className="space-y-3 mb-6">
            {rideTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer bg-white border-gray-200 hover:bg-gray-50 transition-all ${
                  selectedRideType === type.id ? "border-blue-500 ring-2 ring-blue-200" : ""
                }`}
                onClick={() => handleSelectRide(type.id)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">{type.icon}</div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-800">{type.name}</h2>
                      <p className="text-xs text-gray-600">Arrival Time: {type.arrivalTime}</p>
                      <p className="text-xs text-gray-600">{type.awayTime}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-base font-bold text-gray-800">{type.price}</p>
                    {selectedRideType === type.id && <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Confirm button */}
          <Button
            onClick={handleConfirmRide}
            disabled={!selectedRideType}
            className="w-full h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isScheduled
              ? `Book ride for ${formatScheduledDate()}`
              : `Choose ${selectedRideType === "standard" ? "Car Type" : "Wheelchair Van"}`}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
