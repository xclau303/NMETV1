"use client"
import { motion } from "framer-motion"
import type React from "react"

import { MapPin, Check } from "lucide-react"
import { useState } from "react"
import type { Screen } from "@/app/page"
import { BackButton } from "./back-button"

interface ConfirmLocationScreenProps {
  onNavigate: (screen: Screen, data?: any) => void
  pickupLocation?: string
  dropoffLocation?: string
  goBack: () => void
}

export function ConfirmLocationScreen({
  onNavigate,
  pickupLocation = "My Location",
  dropoffLocation = "",
  goBack,
}: ConfirmLocationScreenProps) {
  const [selectedLocation, setSelectedLocation] = useState<"pickup" | "dropoff" | null>(null)
  const [adjustedPickup, setAdjustedPickup] = useState(pickupLocation)
  const [adjustedDropoff, setAdjustedDropoff] = useState(dropoffLocation)
  const [mapPosition, setMapPosition] = useState({ x: 50, y: 50 })

  const handleConfirm = () => {
    onNavigate("choose-ride", {
      pickupLocation: adjustedPickup,
      dropoffLocation: adjustedDropoff,
      isScheduled: false,
    })
  }

  const handleLocationSelect = (locationType: "pickup" | "dropoff") => {
    setSelectedLocation(locationType)
    if (locationType === "pickup") {
      setMapPosition({ x: 25, y: 25 })
    } else {
      setMapPosition({ x: 75, y: 75 })
    }
  }

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedLocation) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setMapPosition({ x, y })

    const mockAddresses = [
      "123 Main Street, City",
      "456 Oak Avenue, Town",
      "789 Pine Road, Village",
      "321 Elm Street, District",
      "654 Maple Drive, Area",
    ]
    const randomAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)]

    if (selectedLocation === "pickup") {
      setAdjustedPickup(randomAddress)
    } else {
      setAdjustedDropoff(randomAddress)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="px-4 py-4 h-screen flex flex-col">
        <BackButton onClick={goBack} className="mb-4" />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirm your trip</h1>
          <p className="text-gray-600 mb-6">
            {selectedLocation ? "Drag the map to adjust your location" : "Tap a location below to adjust it on the map"}
          </p>

          {/* Interactive Map */}
          <div
            className="bg-white rounded-xl shadow-sm mb-6 h-64 relative overflow-hidden cursor-pointer"
            onClick={handleMapClick}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
              {/* Street grid pattern */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(8)].map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-0.5 bg-gray-400" style={{ top: `${i * 12.5}%` }} />
                ))}
                {[...Array(6)].map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-0.5 bg-gray-400" style={{ left: `${i * 16.67}%` }} />
                ))}
              </div>

              {/* Street labels */}
              <div className="absolute top-4 left-4 text-xs font-medium text-gray-600 transform -rotate-12">
                Main St
              </div>
              <div className="absolute top-16 right-8 text-xs font-medium text-gray-600">Oak Ave</div>
              <div className="absolute bottom-16 left-8 text-xs font-medium text-gray-600 transform rotate-12">
                Pine Rd
              </div>
            </div>

            {/* Moveable pin */}
            <motion.div
              className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-full"
              style={{ left: `${mapPosition.x}%`, top: `${mapPosition.y}%` }}
              animate={{ scale: selectedLocation ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin
                className={`h-6 w-6 ${selectedLocation === "pickup" ? "text-green-500" : selectedLocation === "dropoff" ? "text-red-500" : "text-blue-500"} drop-shadow-lg`}
              />
            </motion.div>

            {/* Instruction overlay */}
            {selectedLocation && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">
                  Adjusting {selectedLocation === "pickup" ? "pickup" : "destination"} location
                </p>
                <p className="text-xs text-gray-600">Tap anywhere on the map to set the exact location</p>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="space-y-4">
              {/* Pickup Location */}
              <button
                onClick={() => handleLocationSelect("pickup")}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedLocation === "pickup" ? "bg-green-50 border-2 border-green-200" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Pickup location</p>
                    <p className="font-medium text-gray-900">{adjustedPickup}</p>
                    {adjustedPickup === "My Location" && (
                      <p className="text-xs text-blue-600 mt-1">Using your current location</p>
                    )}
                  </div>
                  {selectedLocation === "pickup" && <div className="text-green-600 text-xs font-medium">Adjusting</div>}
                </div>
              </button>

              {/* Divider line */}
              <div className="ml-1.5 w-0.5 h-6 bg-gray-200"></div>

              {/* Dropoff Location */}
              <button
                onClick={() => handleLocationSelect("dropoff")}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedLocation === "dropoff" ? "bg-red-50 border-2 border-red-200" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-sm mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Destination</p>
                    <p className="font-medium text-gray-900">{adjustedDropoff}</p>
                  </div>
                  {selectedLocation === "dropoff" && <div className="text-red-600 text-xs font-medium">Adjusting</div>}
                </div>
              </button>
            </div>

            {/* Clear selection button */}
            {selectedLocation && (
              <button
                onClick={() => setSelectedLocation(null)}
                className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Done adjusting
              </button>
            )}
          </div>

          {/* Confirm Button */}
          <div className="mt-auto">
            <button
              onClick={handleConfirm}
              disabled={!adjustedDropoff}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Check className="h-5 w-5" />
              Continue to ride selection
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
