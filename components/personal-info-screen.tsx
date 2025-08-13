"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Screen } from "@/app/page"
import { BackButton } from "./back-button"

interface PersonalInfoScreenProps {
  onNavigate: (screen: Screen) => void
  onUpdateData: (data: any) => void
  goBack: () => void
}

export function PersonalInfoScreen({ onNavigate, onUpdateData, goBack }: PersonalInfoScreenProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthDay, setBirthDay] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [gender, setGender] = useState("")

  const handleContinue = () => {
    if (firstName && lastName && birthMonth && birthDay && birthYear && gender) {
      onUpdateData({ firstName, lastName, birthMonth, birthDay, birthYear, gender })
      onNavigate("location") // Next step in signup flow
    } else {
      alert("Please fill in all personal information.")
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="px-6 py-4">
        <BackButton onClick={goBack} className="mb-4" />
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Personal Information</h1>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-base font-medium text-gray-900 mb-2 block">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 text-base border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-base font-medium text-gray-900 mb-2 block">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 text-base border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div>
              <Label className="text-base font-medium text-gray-900 mb-2 block">Date of Birth</Label>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="MM"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  maxLength={2}
                  className="h-12 text-center bg-gray-100 border-0 rounded-lg"
                />
                <Input
                  placeholder="DD"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  maxLength={2}
                  className="h-12 text-center bg-gray-100 border-0 rounded-lg"
                />
                <Input
                  placeholder="YYYY"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  maxLength={4}
                  className="h-12 text-center bg-gray-100 border-0 rounded-lg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="gender" className="text-base font-medium text-gray-900 mb-2 block">
                Gender
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-12 text-base border-gray-200 rounded-lg">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!firstName || !lastName || !birthMonth || !birthDay || !birthYear || !gender}
            className="w-full h-12 bg-black text-white rounded-full text-base font-medium disabled:bg-gray-300"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
