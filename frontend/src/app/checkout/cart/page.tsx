'use client'
import CardItem from '@/app/components/CardItem';
import CheckoutAddress from '@/app/components/CheckoutAddress';
import NoData from '@/app/components/NoData';
import PriceDetails from '@/app/components/PriceDetails';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import BookLoader from '@/lib/BookLoader';
import { Address } from '@/lib/types/type';
import { useAddToWishlistMutation, useCreateOrUpdateOrderMutation, useCreateRazorpayPaymentMutation, useGetCartQuery, useGetOrdersByIdQuery, useRemoveFromCartMutation, useRemoveFromWishlistMutation } from '@/store/api';
import { clearCart, setCart } from '@/store/slice/cartSlice';
import { resetCheckout, setCheckoutStep, setOrderId } from '@/store/slice/checkoutSlice';
import { toggleLoginDialog } from '@/store/slice/userSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slice/wishlistSlice';
import { RootState } from '@/store/store';
import {  Dialog, DialogTitle } from '@radix-ui/react-dialog';
import {  ChevronRight, CreditCard, MapPin, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

declare global {
  interface Window {
    Razorpay:any;
  }
}

const page = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);
  const { orderId, step } = useSelector((state: RootState) => state.checkout);
  const [ShowAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: cartData, isLoading:isCartLoading } = useGetCartQuery(user?._id, { skip: !user })

  const [removeFromCartMutation] = useRemoveFromCartMutation()
  const [addToWishlistMutation] = useAddToWishlistMutation()
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation()

  const wishlist = useSelector((state: RootState) => state.wishlist.items)
  const cart = useSelector((state: RootState) => state.cart)

  const [createOrUpdateOrderMutation] = useCreateOrUpdateOrderMutation()
  const { data: orderData, isLoading: isOrderLoading } = useGetOrdersByIdQuery(orderId || ' ')

const  [createRazorpayPayment] = useCreateRazorpayPaymentMutation();

const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

useEffect(()=>{
  if(orderData && orderData.shippingAddress){
    setSelectedAddress(orderData.shippingAddress)
  }
},[orderData])

useEffect(()=> {
  if(step === 'addresses' && !selectedAddress){
    setShowAddressDialog(true)
  }
})
  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data))
    }
  }, [cartData, dispatch])

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const result = await removeFromCartMutation(cartItemId).unwrap();
      if (result.success) {
        dispatch(setCart(result.data));
        toast.success(result.message || 'Item removed successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error("Error removing item");
    }
  };


  




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



  const handleAddToWishList = async (id: string) => {
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(id))
      if (isWishlist) {
        const result = await removeFromWishlistMutation({ productId: id }).unwrap()
        if (result.success) {
          dispatch(removeFromWishlist(id))
          toast.success("Remove from WishList")
        } else {
          throw new Error(result.message || "Failed to remove from wishList")
        }
      } else {
        const result = await addToWishlistMutation({ productId: id }).unwrap();

        if (result.success) {
          dispatch(addToWishlist(result.data))

          toast.success("Add from WishList")
        } else {
          throw new Error(result.message || "Failed to Add from wishList")
        }
      }
    } catch (error) {
      const errorMessage = (error as any)?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage)
    }
  }

  const totalAmount = cart.items.reduce((acc, item) => acc + (item.product.finalPrice * item.quantity), 0)
  const totalOriginalAmount = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  const totalDiscount = totalOriginalAmount - totalAmount

  const shippingCharge = cart.items.map(item => {
    const shippingCharges = item.product.shippingCharges;
    return shippingCharges && typeof shippingCharges === 'string' && shippingCharges.toLowerCase() === 'free'
      ? 0
      : parseFloat(shippingCharges) || 0;
  });

  const MaximumShippingCharge = Math.max(...shippingCharge, 0)
  const finalAmount = totalAmount + MaximumShippingCharge

  const handleProceedToCheckout = async () => {
    if(step === 'cart'){
      try{
        console.log("clicked")
        
        // Fix: Match the RTK Query parameter structure
        const result = await createOrUpdateOrderMutation({
          orderData: {
            items: cart.items, // Note: changed from 'item' to 'items'
            totalAmount: finalAmount
          }
          // orderId: orderId // Include this if updating existing order
        }).unwrap();
        
        console.log("Frontend mutation completed")
        console.log(result)
        
        if(result.success){
          toast.success("Order created successfully")
          dispatch(setOrderId(result.data._id))
          dispatch(setCheckoutStep("addresses"))
        }else{
          throw new Error(result.message)
        }
      } catch(error){
        console.error("Frontend error:", error) // Use console.error for better visibility
        toast.error("Failed to create Order")
      }
    }else if(step === 'addresses'){
      if(selectedAddress){
        dispatch(setCheckoutStep("payment"))
      }else{
        setShowAddressDialog(true)
      }
    }else if(step === 'payment'){
      handlePayment()
    }
  }

  const handleSelectAddress = async (address: Address) => {
    console.log("hit")
    setSelectedAddress(address)
    setShowAddressDialog(false)
    if(orderId){
        try{
            // Fix: Pass data in the expected format
            await createOrUpdateOrderMutation({
                orderId, 
                orderData: { orderId, shippingAddress: address }
            }).unwrap()
            toast.success('Address updated successfully')
        }catch(error){
            console.log(error)
            toast.error('Failed to update Address')
        }
    }
}

 
const handlePayment = async () => {
  if (!orderId) {
    toast.error("No Order Found")
    return
  }

  setIsProcessing(true)

  try {
    // 1. Create Razorpay order
    const { data, error } = await createRazorpayPayment(orderId)

    if (error || !data?.success) {
      throw new Error("Failed to create payment")
    }

    const razorpayOrder = data.data

    // 2. Check if Razorpay is loaded
    if (typeof window.Razorpay === "undefined") {
      throw new Error("Razorpay SDK failed to load. Please check your internet connection.")
    }

    // 3. Configure Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Book Nest",
      description: "Book purchase",
      order_id: razorpayOrder.id,
      handler: async (response: any) => {
        try {
          // Important: Note the correct field names from Razorpay response
          const result = await createOrUpdateOrderMutation({
            orderData: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            orderId: orderId,
          }).unwrap()

          if (result.success) {
            dispatch(clearCart())
            dispatch(resetCheckout())
            toast.success("Payment Successful")
            router.push(`/checkout/payment-success?orderId=${orderId}`)
          } else {
            throw new Error(result.message)
          }
        } catch (error) {
          console.error(error)
          toast.error("Payment Successful, but failed to update Order")
        }
      },
      prefill: {
        name: orderData?.data?.user?.name || "",
        email: orderData?.data?.user?.email || "",
        contact: orderData?.data?.user?.phoneNumber || "",
      },
      theme: {
        color: "#3399cc",
      },
    }

    // 4. Initialize Razorpay
    const razorpay = new window.Razorpay(options)
    razorpay.on("payment.failed", (response: any) => {
      toast.error(`Payment Failed: ${response.error.description}`)
    })

    // 5. Open Razorpay
    razorpay.open()
  } catch (error) {
    console.error("Payment initialization error:", error)
    toast.error("Failed to initiate payment. Please try again.")
  } finally {
    setIsProcessing(false)
  }
}

      const SellerPhoneNumber = useSelector((state: RootState) => state.user.user)

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

      if(isCartLoading || isOrderLoading){
        return <BookLoader/>
      }
    

  return (
    <>
    
    <Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
   />
    <div className='min-h-screen bg-white'>
      <div className='bg-gray-100 py-4 px-6 mb-8'>
        <div className='container mx-auto  flex items-center'>
          <ShoppingCart className='h-6 w-6 mr-2 text-gray-600' />
          <span className='text-lg font-semibold text-gray-800'>
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in your cart
          </span>
        </div>
      </div>
      <div className='container mx-auto px-4 max-w-6xl'>
        <div className='mb-8'>
          <div className='flex justify-center items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className={`rounded-full p-3 ${step === "cart" ? "bg-blue-600 text-gray-100" : "bg-blue-200 text-gray-600"}`}>
                <ShoppingCart className='h-6 w-6' />
              </div>
              <span className='font-medium hidden md:inline'>
                cart
              </span>
            </div>
            <ChevronRight className='h-5 w-5 text-gray-400' />
            <div className='flex items-center gap-2'>
              <div className={`rounded-full p-3 ${step === "addresses" ? "bg-blue-600 text-gray-100" : "bg-blue-200 text-gray-600"}`}>
                <MapPin className='h-6 w-6' />
              </div>
              <span className='font-medium hidden md:inline'>
                Address
              </span>
            </div>
            <ChevronRight className='h-5 w-5 text-gray-400' />
            <div className='flex items-center gap-2'>
              <div className={`rounded-full p-3 ${step === "payment" ? "bg-blue-600 text-gray-100" : "bg-blue-200 text-gray-600"}`}>
                <CreditCard className='h-6 w-6' />
              </div>
              <span className='font-medium hidden md:inline'>
                cart
              </span>
            </div>

          </div>
        </div>
        <div className='grid gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <Card className='shadow-lg'>
              <CardHeader>
                <CardTitle className='text-2xl'>Order Summary</CardTitle>
                <CardDescription>Review Your items</CardDescription>
              </CardHeader>
              <CardContent>
                <CardItem
                  items={cart.items}
                  onRemoveItem={handleRemoveItem}
                  onToggleWishlist={handleAddToWishList}
                  wishlist={wishlist} />
              </CardContent>
            </Card>
          </div>
          <div>
            <PriceDetails
            totalOriginalAmount={totalOriginalAmount}
            totalDiscount={totalDiscount}
            totalAmount={finalAmount  }
            shippingCharge={MaximumShippingCharge}
            itemCount={cart.items.length}
            isProcessing={isProcessing}
            step={step} 
            onProceed={handleProceedToCheckout}
            onBack={()=>dispatch(setCheckoutStep(step === 'addresses' ? 'cart' : 'addresses'))}/>

            {
              selectedAddress && (
                <Card className='mt-6 mb-6 shadow-lg'>
                  <CardHeader>
                    <CardTitle className='text-xl'>
                      Delivery Address
                    </CardTitle>
                    <CardContent className='space-y-1'>
                      <p>{
                        selectedAddress?.state
                        }</p>
                        {
                          selectedAddress?.addressLine1 && (<p>
                            {selectedAddress.addressLine1}
                          </p>)
                        }
                        {
                         <p>
                          {selectedAddress.city}, {selectedAddress.state}{" "},
                          {selectedAddress.pincode}
                         </p> 
                        
                        }
                        {
                          <p>
                            Phone : {SellerPhoneNumber.phoneNumber}
                          </p>
                        }
                        <div>
                          <Button className="mt-4" variant='outline' onClick={()=>setShowAddressDialog(true)}>
                            <MapPin className='h-4 w-4 mr-2' /> Change Address
                          </Button>
                        </div>
                    
                    </CardContent>
                  </CardHeader>
                </Card>
              )
            }

          </div>
        </div>

            <Dialog open={ShowAddressDialog} onOpenChange={setShowAddressDialog}>
              <DialogContent className='sm:max-w-[600px'>

                <DialogHeader>
                  <DialogTitle>
                    Select or Add Delivery  Address
                  </DialogTitle>
                </DialogHeader>
                <CheckoutAddress
                  onAddressSelect={handleSelectAddress}
                  selectedAddress={selectedAddress?._id}
                />
              </DialogContent>
            </Dialog>

      </div>
    </div>
    </>
  )
}

export default page
