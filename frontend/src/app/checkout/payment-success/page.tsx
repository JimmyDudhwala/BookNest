"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Package, Eye, Home } from "lucide-react"
import type { Order } from "@/lib/types/type"
import toast from "react-hot-toast"
import { useGetOrdersByIdQuery } from "@/store/api"
import { useDispatch } from "react-redux"
import { clearCart } from "@/store/slice/cartSlice"
import { resetCheckout } from "@/store/slice/checkoutSlice"

export default function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  const dispatch = useDispatch()

  const {
    data: orderData,
    isLoading,
    error,
  } = useGetOrdersByIdQuery(orderId || "", {
    skip: !orderId, // Skip the query if no orderId
  })

  useEffect(() => {
    if (!orderId) {
      toast.error("Order ID not found")
      router.push("/")
      return
    }
  }, [orderId, router])

  useEffect(() => {
    if (orderData) {
      if (orderData.success) {
        setOrderDetails(orderData.data)
        toast.success("Order details loaded successfully!")
      } else {
        toast.error(orderData.message || "Failed to load order details")
      }
    }
  }, [orderData])

  useEffect(() => {
    if (error) {
      console.error("Error fetching order details:", error)
      toast.error("Failed to load order details")
    }
  }, [error])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd"][
                  Math.floor(Math.random() * 6)
                ],
              }}
            />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
              <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed</p>
            </div>

            {orderDetails && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Order Details */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-sm">{orderDetails._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{formatDate(orderDetails.createdAt?.toString() || new Date().toISOString())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold">₹{formatAmount(orderDetails.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span>{Array.isArray(orderDetails.items) ? orderDetails.items.length : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="capitalize font-medium text-green-600">{orderDetails.paymentStatus}</span>
                    </div>
                  </div>
                </div>

                {/* What's Next */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">{"What's Next?"}</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700">You will receive an email confirmation shortly.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700">Your order will be processed and shipped soon.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700">You can track your order status in your account.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            {Array.isArray(orderDetails?.items) && orderDetails.items.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name || `Item ${index + 1}`}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                      </div>
                      <p className="font-semibold">₹{formatAmount(item.price || 0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Status */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Status</h3>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700 uppercase tracking-wide">
                  {orderDetails?.status || "CONFIRMED"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Button onClick={() => router.push("/orders")} className="bg-purple-600 hover:bg-purple-700">
                <Eye className="w-4 h-4 mr-2" />
                View Order Details
              </Button> */}
              <Button
                variant="outline"
                onClick={() => {
                  dispatch(clearCart());
                  dispatch(resetCheckout());
                  router.push("/");
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping/Go Back
              </Button>
            </div>

            {/* Additional Information */}
            {orderDetails && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-700">
                  If you have any questions about your order, please contact our support team with your Order ID:{" "}
                  <span className="font-mono font-semibold">{orderDetails._id}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
