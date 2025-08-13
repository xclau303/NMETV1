"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Screen } from "@/app/page"
import { BackButton } from "./back-button"

interface InsuranceScreenProps {
  onNavigate: (screen: Screen) => void
  onUpdateData: (data: any) => void
  goBack: () => void
}

export function InsuranceScreen({ onNavigate, onUpdateData, goBack }: InsuranceScreenProps) {
  const [insuranceProvider, setInsuranceProvider] = useState("")
  const [policyNumber, setPolicyNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

  const handleContinue = () => {
    if (insuranceProvider && policyNumber && expiryDate) {
      onUpdateData({ insuranceProvider, policyNumber, expiryDate })
      onNavigate("guardian") // Next step in signup flow
    } else {
      alert("Please fill in all insurance details.")
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="px-6 py-4">
        <BackButton onClick={goBack} className="mb-4" />
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Insurance Information</h1>

          <div className="space-y-6 mb-8">
            <div>
              <Label htmlFor="insuranceProvider" className="text-base font-medium text-gray-900 mb-2 block">
                Insurance Provider
              </Label>
              <Input
                id="insuranceProvider"
                placeholder="e.g., Blue Cross Blue Shield"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                className="h-12 text-base border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="policyNumber" className="text-base font-medium text-gray-900 mb-2 block">
                Policy Number
              </Label>
              <Input
                id="policyNumber"
                placeholder="Enter policy number"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="h-12 text-base border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="expiryDate" className="text-base font-medium text-gray-900 mb-2 block">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                placeholder="MM/DD/YYYY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="h-12 text-base border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!insuranceProvider || !policyNumber || !expiryDate}
            className="w-full h-12 bg-black text-white rounded-full text-base font-medium disabled:bg-gray-300"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
