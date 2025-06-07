"use client"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useGetWishlistQuery, useRemoveFromWishlistMutation, useAddToCartMutation, useGetCartQuery } from "@/store/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Trash2, ShoppingCart, Check, IndianRupee } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

const page = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const { data: wishlist, isLoading, refetch } = useGetWishlistQuery(user?._id)
  const { data: cart } = useGetCartQuery(user?._id)
  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const [addToCart] = useAddToCartMutation()

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap()
      toast.success("Removed from wishlist")
      refetch()
    } catch (error) {
      toast.error("Failed to remove from wishlist")
      console.error(error)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({
        userId: user?._id,
        productId: productId,
        quantity: 1,
      }).unwrap()
      toast.success("Added to cart")
    } catch (error) {
      toast.error("Failed to add to cart")
      console.error(error)
    }
  }

  const isInCart = (productId: string) => {
    return cart?.items?.some((item: any) => item.product._id === productId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading wishlist...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-red-100 mt-1">Your saved items and favorites</p>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist?.items?.length > 0 ? (
          wishlist.items.map((item: any) => (
            <Card key={item._id} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={item.product?.images?.[0] || "/placeholder.svg?height=200&width=300"}
                    alt={item.product?.title || "Product"}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">{item.product?.title || "Product Title"}</h3>

                  {/* Price */}
                  <div className="flex items-center text-lg font-bold text-gray-800">
                    <IndianRupee className="h-4 w-4" />
                    {item.product?.price || "0.00"}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRemoveFromWishlist(item.product._id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {isInCart(item.product._id) ? (
                      <Button disabled size="sm" className="flex-1 bg-gray-500 hover:bg-gray-500">
                        <Check className="h-4 w-4 mr-2" />
                        Item in Cart
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleAddToCart(item.product._id)}
                        size="sm"
                        className="flex-1 bg-black hover:bg-gray-800"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border border-gray-200">
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500">Save items you love to your wishlist</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default page
