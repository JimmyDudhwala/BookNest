"use client"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useGetProductsBySellerIdQuery, useDeleteProductByIdMutation } from "@/store/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Package, IndianRupee } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

const Page = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const { data: products, isLoading, refetch } = useGetProductsBySellerIdQuery(user?._id)

  const productList = products?.data
  console.log(productList)
  console.log(products)
  const [deleteProduct] = useDeleteProductByIdMutation()

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap()
      toast.success("Product deleted successfully")
      refetch()
    } catch (error) {
      toast.error("Failed to delete product")
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Selling Products</h1>
        <p className="text-green-100">Manage your listed products and inventory</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productList?.length > 0 ? (
          productList.map((product: any) => (
            <Card key={product._id} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Product Header */}
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Package className="h-4 w-4" />
                    <span className="font-medium text-sm">{product.category || "General"}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{product.subcategory || "hello"}</p>
                </div>

                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.images?.[0] || "/placeholder.svg?height=200&width=300"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      Category: {product.category || "Exam/Test Preparation Books"}
                    </p>
                    <p className="text-sm text-gray-600">Class: {product.class || "B.Com"}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-purple-600 font-bold text-lg">
                      <IndianRupee className="h-4 w-4" />
                      {product.price}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="flex items-center text-gray-400 line-through text-sm">
                        <IndianRupee className="h-3 w-3" />
                        {product.originalPrice}
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <Button
                    onClick={() => handleDelete(product._id)}
                    variant="destructive"
                    size="sm"
                    className="w-full bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border border-gray-200">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No products listed</h3>
                <p className="text-gray-500">Start selling by adding your first product</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
