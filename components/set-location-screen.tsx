"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Clock, Calendar, ChevronDown } from "lucide-react"
import type { Screen } from "@/app/page"
import { BackButton } from "./back-button"

interface SetLocationScreenProps {
  onNavigate: (screen: Screen, data?: any) => void
  initialPickup?: string
  initialDropoff?: string
  goBack: () => void
}

const locationSuggestions = [
  { id: 1, name: "Sherwood Townhouses", address: "7 Sherwood Ave, Ossining, NY", distance: "0.7 mi" },
  { id: 2, name: "Terminal 8", address: "John F. Kennedy International Airport (JFK)...", distance: "44 mi" },
  { id: 3, name: "5th Ave & E 72nd St", address: "New York, NY", distance: "35 mi" },
  { id: 4, name: "1400 2nd Ave", address: "New York, NY", distance: "35 mi" },
  { id: 5, name: "Terminal 4", address: "John F. Kennedy International Airport (JFK)...", distance: "44 mi" },
  { id: 6, name: "Lehman College", address: "250 Bedford Park Blvd W, Bronx, NY", distance: "26 mi" },
  { id: 7, name: "Grand Central Terminal", address: "89 E 42nd St, New York City, NY", distance: "37 mi" },
  { id: 8, name: "E 84th St & 5th Ave", address: "New York, NY", distance: "34 mi" },
  { id: 9, name: "Brooklyn Navy Yard - BLDG 269", address: "141 Flushing Ave, Brooklyn, NY", distance: "40 mi" },
  { id: 10, name: "LaGuardia Airport (LGA)", address: "Grand Central Pkwy, Queens, NY", distance: "34 mi" },
]

export function SetLocationScreen({
  onNavigate,
  initialPickup = "",
  initialDropoff = "",
  goBack,
}: SetLocationScreenProps) {
  const [pickupLocation, setPickupLocation] = useState(initialPickup)
  const [dropoffLocation, setDropoffLocation] = useState(initialDropoff)
  const [showTimingModal, setShowTimingModal] = useState(false)
  const [pickupTiming, setPickupTiming] = useState<"now" | "later">("now")

  useEffect(() => {
    if (pickupLocation.trim() && dropoffLocation.trim()) {
      const timer = setTimeout(() => {
        if (pickupTiming === "later") {
          onNavigate("schedule-ride", {
            pickupLocation,
            dropoffLocation,
          })
        } else {
          onNavigate("choose-ride", {
            pickupLocation,
            dropoffLocation,
            isScheduled: false,
          })
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [pickupLocation, dropoffLocation, pickupTiming, onNavigate])

  const handleLocationSelect = (location: (typeof locationSuggestions)[0]) => {
    if (!dropoffLocation) {
      setDropoffLocation(location.address)
    }
  }

  const handleTimingSelect = (timing: "now" | "later") => {
    setPickupTiming(timing)
    setShowTimingModal(false)
  }

  return (
    <div className="bg-gray-100 min-h-screen max-h-screen overflow-hidden">
      <div className="px-4 py-4 h-full flex flex-col">
        <BackButton onClick={goBack} className="mb-4" />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Plan your ride</h1>

          <div className="mb-6">
            <button
              onClick={() => setShowTimingModal(true)}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-3 rounded-full transition-colors shadow-sm border border-gray-200"
            >
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-900">
                {pickupTiming === "now" ? "Pickup now" : "Pickup later"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <Input
                    placeholder="Pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="border-0 p-0 text-base font-medium focus-visible:ring-0 text-gray-900"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-600 rounded-sm"></div>
                  <Input
                    placeholder="Where to?"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="border-0 p-0 text-base font-medium focus-visible:ring-0 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm">
            <div className="p-4">
              {locationSuggestions.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full flex items-center gap-3 px-0 py-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-b-0 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <span className="text-sm text-gray-500">{location.distance}</span>
                    </div>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {showTimingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

            <h2 className="text-xl font-bold text-gray-900 mb-6">When do you need a ride?</h2>

            <div className="space-y-3 mb-8">
              <button
                onClick={() => handleTimingSelect("now")}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">Now</h3>
                  <p className="text-gray-600 text-sm">Request a ride, hop-in, and go</p>
                </div>
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  {pickupTiming === "now" && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                </div>
              </button>

              <button
                onClick={() => handleTimingSelect("later")}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">Later</h3>
                  <p className="text-gray-600 text-sm">Reserve for extra peace of mind</p>
                </div>
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  {pickupTiming === "later" && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowTimingModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              Done
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
