"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Car, ArrowLeft } from "lucide-react"
import type { Screen } from "@/app/page"

interface ReservationConfirmedScreenProps {
  onNavigate: (screen: Screen) => void
  reservationData?: {
    pickupLocation?: string
    dropoffLocation?: string
    scheduledDate?: string
    scheduledTime?: string
    rideType?: string
    price?: string
    isScheduled?: boolean
  }
}

export function ReservationConfirmedScreen({ onNavigate, reservationData }: ReservationConfirmedScreenProps) {
  const formatDateTime = () => {
    if (!reservationData?.scheduledDate || !reservationData?.scheduledTime) return "Today, 10:00am"

    const date = new Date(reservationData.scheduledDate)
    const timeString = new Date(`2000-01-01T${reservationData.scheduledTime}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    return `${date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} ${timeString}`
  }

  const confirmationNumber = `MR${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={() => onNavigate("dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-500 ml-4">Reservation Confirmed</h1>
        </div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your ride has been reserved</h1>
        </motion.div>

        {/* Reservation Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          {/* Date and Time */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{formatDateTime()}</h2>
          </div>

          {/* Route Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-gray-900">{reservationData?.pickupLocation || "Pickup Address"}</h3>
                <p className="text-sm text-gray-600">
                  Pickup at{" "}
                  {reservationData?.scheduledTime
                    ? new Date(`2000-01-01T${reservationData.scheduledTime}`).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "10:00am"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-gray-900">{reservationData?.dropoffLocation || "Dropoff Address"}</h3>
                <p className="text-sm text-gray-600">Destination</p>
              </div>
            </div>
          </div>

          {/* Ride Details */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Vehicle Type</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reservationData?.rideType || "Car Type"}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Price</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reservationData?.price || "$15.00"}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Confirmation #</span>
              </div>
              <span className="text-sm font-medium text-blue-600">{confirmationNumber}</span>
            </div>
          </div>

          {/* Details Button */}
          <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors">
            Details
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate("dashboard")}
            className="w-full h-12 bg-black text-white rounded-lg text-base font-medium hover:bg-gray-800"
          >
            Reserve another ride
          </Button>
        </div>
      </div>
    </div>
  )
}
