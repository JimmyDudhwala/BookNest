"use client"
import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useGetUserOrdersQuery } from "@/store/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Order, OrderItem } from "@/lib/types/type"

const Page = () => {
    const router  = useRouter()
  const user = useSelector((state: RootState) => state.user.user)
  const { data: orders, isLoading } = useGetUserOrdersQuery(user?._id)
 
  const [showAll, setShowAll] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const orderList = orders?.data
  const displayedOrders = showAll ? orderList : Array.isArray(orderList) ? orderList.slice(0, 3) : []
 
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-orange-100">View and manage your recent purchases</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayedOrders?.length > 0 ? (
          displayedOrders.map((order: Order) => (
            <Card key={order._id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    {/* Order Header */}
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-600 text-lg">Order #{order._id?.slice(-6)}</h3>
                    </div>

                    {/* Order Date */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items?.map((item: OrderItem, index: number) => (
                        <div key={index}>
                          <h4 className="font-medium text-gray-800">{item.product?.title || "Product"}</h4>
                          <p className="text-sm text-gray-600">
                            {item.product?.description || "No description available"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">Total: ₹{order.totalAmount}</span>
                    </div>

                    {/* Order Status */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge className={getStatusColor(order.status)}>{order.status || "Processing"}</Badge>
                    </div>
                    {/* {router.push(`/books/${order.items[0].product._id} */}
                    <Button variant="outline" size="sm" className="mt-2" onClick={()=>router.push(`/books/${order.items[0].product._id}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border border-gray-200">
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500">Your order history will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Show More/Less Button */}
      {orders && orders.length > 3 && (
        <div className="flex justify-end">
          <Button onClick={() => setShowAll(!showAll)} className="bg-purple-600 hover:bg-purple-700">
            {showAll ? "Show Less" : "View All Orders"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Page
