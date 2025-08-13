"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock } from "lucide-react"
import type { Screen } from "@/app/page"
import { BackButton } from "./back-button"
import { cn } from "@/lib/utils"

interface BookLaterScreenProps {
  onNavigate: (screen: Screen, data?: any) => void
  goBack: () => void
}

export function BookLaterScreen({ onNavigate, goBack }: BookLaterScreenProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>("09:00 AM")

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleConfirmBooking = () => {
    if (date && time) {
      const bookingDateTime = `${formatDate(date)} at ${time}`
      onNavigate("set-location", { bookingDateTime })
    } else {
      alert("Please select both a date and a time.")
    }
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i % 12 === 0 ? 12 : i % 12
        const minute = j === 0 ? "00" : "30"
        const ampm = i < 12 ? "AM" : "PM"
        slots.push(`${hour}:${minute} ${ampm}`)
      }
    }
    return slots
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="px-6 py-4">
        <BackButton onClick={goBack} className="mb-4" />
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Schedule your ride</h1>

          <div className="space-y-6 mb-8">
            {/* Date Picker */}
            <div>
              <p className="text-lg font-medium text-gray-900 mb-3">Select Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 text-base",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {date ? formatDate(date) : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div>
              <p className="text-lg font-medium text-gray-900 mb-3">Select Time</p>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-12 text-base">
                  <Clock className="mr-2 h-5 w-5 text-gray-600" />
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {generateTimeSlots().map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleConfirmBooking}
            className="w-full h-12 bg-black text-white rounded-full text-base font-medium"
          >
            Confirm Booking
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
