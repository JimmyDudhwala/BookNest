"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CartItem } from "@/lib/types/type"
import { Heart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type React from "react"

interface CartItemsProps {
  items: CartItem[]
  onRemoveItem: (productId: string) => void
  onToggleWishlist: (productId: string) => void
  wishlist: { products: string[] }[]
}

const CartItemsComponent: React.FC<CartItemsProps> = ({ items, onRemoveItem, onToggleWishlist, wishlist }) => {
  // Early return if items array is empty
  if (!items || items.length === 0) {
    return <div className="py-8 text-center text-gray-500">Your cart is empty</div>
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      {items.map((item) => {
        // Skip rendering if item or product is undefined
        if (!item || !item.product) return null

        // Get safe values with fallbacks
        const productId = item._id || ""
        const productTitle = item.product.title || "Untitled Book"
        const productImage = item.product.images?.[0] || "/placeholder.svg?height=100&width=80"
        const productPrice = item.product.price || 0
        const productFinalPrice = item.product.finalPrice || 0
        const productShipping = item.product.shippingCharges
        const quantity = item.quantity || 1

        // Check if this product is in wishlist
        const isInWishlist =
          wishlist?.some((w) => Array.isArray(w.products) && w.products.includes(item.product._id)) || false

        return (
          <div key={productId} className="flex flex-col md:flex-row gap-4 py-4 border-b last:border-0">
            <Link href={`/books/${item.product._id}`}>
              <Image
                src={productImage || "/placeholder.svg"}
                alt={typeof productTitle === "string" ? productTitle : "Book cover"}
                width={80}
                height={100}
                className="object-contain w-60 md:m-48 rounded-xl"
              />
            </Link>
            <div className="flex-1">
              <h3 className="font-medium">{productTitle}</h3>
              <div className="mt-1 text-sm text-gray-500">Quantity: {quantity}</div>
              <div className="mt-1 font-medium">
                {productPrice > 0 && <span className="text-gray-500 line-through mr-2">₹{productPrice}</span>}₹
                {productFinalPrice}
              </div>
              <div className="mt-1 text-sm text-green-600">
                {productShipping === undefined ? "Free Shipping" : `Shipping ₹${productShipping}`}
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  className="w-[100px] md:w-[200px]"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveItem(productId)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Remove</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => onToggleWishlist(item.product._id)}>
                  <Heart size={20} className={`w-4 h-4 mr-1 ${isInWishlist ? "fill-red-500" : "fill-white"}`} />
                  <span className="hidden md:inline">{isInWishlist ? "Remove from Wishlist" : "Add to wishlist"}</span>
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </ScrollArea>
  )
}

export default CartItemsComponent
