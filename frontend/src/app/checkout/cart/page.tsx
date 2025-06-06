'use client'
import NoData from '@/app/components/NoData';
import { useAddToWishlistMutation, useGetCartQuery, useRemoveFromCartMutation, useRemoveFromWishlistMutation } from '@/store/api';
import { setCart } from '@/store/slice/cartSlice';
import { toggleLoginDialog } from '@/store/slice/userSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slice/wishlistSlice';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user.user);
    const {orderId, step}  =  useSelector((state: RootState) => state.checkout);
    const [ShowAddressDialog, setShowAddressDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false)

      const {data:cartData} = useGetCartQuery(user?._id, {skip:!user})
      
        const [removeFromCartMutation] = useRemoveFromCartMutation()
        const [addToWishlistMutation] = useAddToWishlistMutation()
        const [removeFromWishlistMutation] = useRemoveFromWishlistMutation()

          const wishlist = useSelector((state : RootState) => state.wishlist.items)
          const cart = useSelector((state : RootState) => state.cart)
        
        
          useEffect(()=>{
            if(cartData?.success && cartData?.data){
              dispatch(setCart(cartData.data))
            }
          },[cartData, dispatch])

          const handleRemoveItem = async(productId:string) => {
            try{
                const  result = await removeFromCartMutation(productId).unwrap();
                if(result.success && result.data){
                    dispatch(setCart(result.data))
                    toast.success(result.message || 'Item removed successfully')
                }
            }catch(error){
                console.log(error)
                toast.error("error")
            }
          }


    if (cart.items.length === 0) {
        return (
          <NoData
            message="Your cart is empty."
            description="Looks like you haven't added any items yet. 
            Explore our collection and find something you love!"
            buttonText="Browse Books"
            imageUrl="/images/cart.webp" 
            onClick={() => router.push('/books')}
          />
        );
      }


        const handleOpenLogin = () => {
          dispatch(toggleLoginDialog());
          console.log('Login Clicked');
          // setIsLoginOpen(true);
        };
      


  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }



        const handleAddToWishList = async (id:string) => {
            try{
              const isWishlist = wishlist.some((item)=>
              item.products.includes(id))
              if(isWishlist){
                const result = await removeFromWishlistMutation({ productId: id }).unwrap()
                if(result.success){
                  dispatch(removeFromWishlist(id))
                  toast.success("Remove from WishList")
                }else{
                  throw new Error(result.message || "Failed to remove from wishList")
                }
              }else{
               const result =  await addToWishlistMutation({ productId: id }).unwrap();
      
                if(result.success){
                  dispatch(addToWishlist(result.data))
      
                  toast.success("Add from WishList")
                }else{
                  throw new Error(result.message || "Failed to Add from wishList")
                }
              }
            }catch(error){
              const errorMessage = (error as any)?.data?.message || "An unexpected error occurred";
                  toast.error(errorMessage) 
            }
          }

  return (
    <div>
      
    </div>
  )
}

export default page
