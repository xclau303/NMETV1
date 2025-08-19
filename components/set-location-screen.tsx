"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Clock, MapPin } from "lucide-react"
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
  const [pickupLocation, setPickupLocation] = useState(initialPickup || "My Location")
  const [dropoffLocation, setDropoffLocation] = useState(initialDropoff)

  useEffect(() => {
    if (pickupLocation.trim() && dropoffLocation.trim()) {
      const timer = setTimeout(() => {
        onNavigate("confirm-location", {
          pickupLocation,
          dropoffLocation,
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [pickupLocation, dropoffLocation, onNavigate])

  const handleLocationSelect = (location: (typeof locationSuggestions)[0]) => {
    if (!dropoffLocation) {
      setDropoffLocation(location.address)
    }
  }

  const handleMapPinSelect = () => {
    const locationType = !dropoffLocation ? "destination" : "pickup"

    onNavigate("map-location", {
      locationType,
      currentPickup: pickupLocation,
      currentDropoff: dropoffLocation,
    })
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

          <div className="flex-1 bg-white rounded-xl shadow-sm">
            <div className="p-4">
              {locationSuggestions.slice(0, 6).map((location) => (
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

              <button
                onClick={handleMapPinSelect}
                className="w-full flex items-center gap-3 px-0 py-4 hover:bg-blue-50 text-left rounded-lg border-t border-gray-200 mt-2"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-blue-600">Set location on map</p>
                  <p className="text-sm text-gray-500">Choose your location using the map</p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
