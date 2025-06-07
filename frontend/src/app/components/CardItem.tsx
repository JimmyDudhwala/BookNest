
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CartItem } from '@/lib/types/type';
import { Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface CartItemsProp{
    items:CartItem[];
    onRemoveItem:(productId:string) => void;
    onToggleWishlist:(productId:string) => void;
    wishlist : {products:string[]}[]
}



const CartItem:React.FC<CartItemsProp> = ({items, onRemoveItem, onToggleWishlist, wishlist}) => {
  return (
    <ScrollArea className='h-[400px] pr-4'>     
            {items.map((item)=>(
                <div key={item._id} className="flex flex-col md:flex-row gap-4 py-4 border-b last:border-0">
                    <Link href={`/books/${item.product._id}`}>
                        <Image 
                        src={item.product?.images?.[0]}
                        alt={Array.isArray(item?.product?.title) ? item.product.title.join(', ') : (item?.product?.title || 'No title')}
                        width={80}
                        height={100}
                        className='object-contain w-60 md:m-48 rounded-xl'/>

                    </Link>
                    <div className='flex-1'>
                        <h3 className='font-medium'>
                            {item.product.title}
                            </h3>
                            <div className='mt-1 text-sm text-gray-500'>
                                Quantity : {item.quantity}
                            </div>
                            <div className='mt-1 font-medium'>
                                <span className='text-gray-500 line-through mr-2 '>
                                ₹{item.product.price}
                                </span>
                                ₹{item.product.finalPrice}
                            </div>
                            <div className='mt-1 text-sm text-green-600'>
                                {item.product.shippingCharges === undefined ? "Free Shipping" : `Shipping ₹${item.product.shippingCharges}`}
                            </div>
                            <div className='mt-2 flex gap-2 '>
                                <Button className='w-[100px] md:w-[200px]' variant='outline' size="sm" onClick={()=>onRemoveItem(item._id)}>
                                    <Trash2 className='w-4 h-4 mr-2'/>
                                    <span className='hidden md:inline'>Remove</span>
                                </Button>
                                <Button  variant='outline' size='sm' onClick={()=>onToggleWishlist(item.product._id)} >
                        <Heart size={20} className={`w-4 h-4 mr-1 fill-red-500 ${wishlist.some((w)=>w.products.includes(item.product._id)) ? "fill-red-500" : " fill-white"}`}/>
                        <span className='hidden md:inline'>{wishlist.some((w)=>w.products.includes(item.product._id)) ?"Remove from Wishlist":"Add to wishlist"}</span>
                      </Button>     
                            </div>
                        </div>

                </div>
            ))}
    </ScrollArea>
  )
}

export default CartItem
