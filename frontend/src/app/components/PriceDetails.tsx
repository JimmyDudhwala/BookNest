"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, CreditCard, Shield } from "lucide-react"
import type React from "react"

interface PriceDetailsProp {
  totalOriginalAmount: number
  totalAmount: number
  totalDiscount: number
  shippingCharge: number
  itemCount: number
  isProcessing: boolean
  step: "cart" | "addresses" | "payment"
  onProceed: () => void
  onBack: () => void
}

const PriceDetails: React.FC<PriceDetailsProp> = ({
  totalAmount,
  totalDiscount,
  shippingCharge,
  totalOriginalAmount,
  itemCount,
  isProcessing,
  step,
  onProceed,
  onBack,
}) => {
  // Format numbers to ensure they're always valid strings
  const formatCurrency = (value: number): string => {
    // Check if value is a valid number
    return isNaN(value) ? "0" : value.toFixed(2)
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Price Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between ">
          <span>Price ({itemCount} items)</span>
          <span>₹{formatCurrency(totalOriginalAmount)}</span>
        </div>
        <div className="flex justify-between text-green-600 ">
          <span className="">Discount</span>
          <span>-₹{formatCurrency(totalDiscount)}</span>
        </div>
        <div className="border-t-4 pt-4 font-medium flex justify-between">
          <span className="">Total Amount</span>
          <span>₹{formatCurrency(totalAmount)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
          disabled={isProcessing}
          onClick={onProceed}
        >
          {isProcessing ? (
            "Processing..."
          ) : step === "payment" ? (
            <>
              <CreditCard className="h-4 w-5 mr-2" />
              Continue To Pay
            </>
          ) : (
            <>
              <ChevronRight className="h-4 w-4 mr-2" />
              {step === "cart" ? "Proceed to checkout" : "Proceed To Payment"}
            </>
          )}
        </Button>
        {step !== "cart" && (
          <Button variant="outline" className="w-full" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="h-4 w-4" />
          <span>Safe and Secure Payment</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default PriceDetails
