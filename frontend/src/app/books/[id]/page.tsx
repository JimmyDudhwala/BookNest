'use client'
import NoData from '@/app/components/NoData'
import { ShareButton } from '@/app/components/Share'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BookLoader from '@/lib/BookLoader'
import { BookDetails } from '@/lib/types/type'
import { useAddToCartMutation, useAddToWishlistMutation, useGetProductsByIdQuery, useRemoveFromWishlistMutation } from '@/store/api'
import { addToCart } from '@/store/slice/cartSlice'
import { setCheckoutStep } from '@/store/slice/checkoutSlice'
import { toggleLoginDialog } from '@/store/slice/userSlice'
import {  addToWishlist, removeFromWishlist } from '@/store/slice/wishlistSlice'
import { RootState } from '@/store/store'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, Heart, Loader2, MapPin, MessageCircle, ShoppingCart, User2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'  
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

const Page = () => {

  const params = useParams()
  const id = params.id
  const [selectedImage, setSelectedImage] = React.useState(0) 
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAddToCart, setIsAddToCart] = React.useState(false)

    const user = useSelector((state: RootState) => state.user.user);

  const [addToCartMutation] = useAddToCartMutation()
  const [addToWishlistMutation] = useAddToWishlistMutation()
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation()

  const wishlist = useSelector((state : RootState) => state.wishlist.items)




    const [book, setBook] = useState<BookDetails | null>()
    const { data: apiResponse = {}, isLoading, isError } = useGetProductsByIdQuery(id);

  
      useEffect(()=>{
          if(apiResponse.data){
              setBook(apiResponse.data)
          }
      },[apiResponse])
  
      



    const handleAddToCart =  async () => {
      if(book){
        setIsAddToCart(true)
        
        try{
          if(!user){
            toast.error("Please Login first")
            dispatch(toggleLoginDialog())
            return
          }
          const result = await addToCartMutation({
             productId:book?._id,
             quantity:1
          }).unwrap()
          if(result.success && result.data){
              dispatch(addToCart(result.data))
              dispatch(setCheckoutStep("cart"))
              toast.success(result.message || " Added to Cart Successfully")
          }else{
            throw new Error(result.message || "Failed to add Product")
          }
        }catch(error){
            const errorMessage =  "An unexpected error occurred";
            toast.error(errorMessage + error)
        }finally{
          setIsAddToCart(false)
        }
      }
    }
    const handleAddToWishList = async (id:string) => {
      try{
        if(!user){
          toast.error("Please Login first")
          dispatch(toggleLoginDialog())
          return
        }
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
        const errorMessage =  "An unexpected error occurred";
            toast.error(errorMessage + error) 
      }
    }

    const bookImage = book?.images || []

    if(isLoading){
      return <BookLoader/>
    }

  
    if (!book || isError) {
      return (
        <div className="my-10 max-w-3xl justify-center mx-auto">
          <NoData
            imageUrl="/images/no-book.jpg"
            message="Loading...."
            description="Wait, we are fetching book details"
            onClick={() => router.push("/book-sell")}
            buttonText="Sale Your First Book"
          />
        </div>
      );
    }
        const calculateDiscount = (price: number, finalPrice: number) => {
        return price > finalPrice && price > 0 ? Math.round(((price - finalPrice) / price) * 100) : 0;
      };
    
      const formatDates = (dateString:Date) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, {addSuffix:true})
      }

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='container mx-auto px-4 mb-10 '>
        <nav className='mb-8 flex item-center gap-2 text-sm text-muted-foreground pt-2'>
                <Link href='/' className="text-primary hover:underline">Home</Link>
                <span>/</span>
                <Link href='/books' className="text-primary hover:underline">Book</Link>
                <span>/</span>
                <span className='text-gray-600'>{book.category}</span>
                <span>/</span>
                <span className='text-gray-600'>{book.title}</span>
            </nav>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <div className='relative h-[400px] overflow-hidden rounded-lg'>
                    <Image
                    src={bookImage[selectedImage]}
                    alt='Book images'
                    fill
                    className='object-contain'/>
                      {calculateDiscount(book.price, book.finalPrice) > 0 &&  (
                        <Badge className='bg-orange-600/90 absolute rounded-r-lg px-2 py-1 text-xs font-medium left-0 top-2 text-white hover:bg-orange-700'>
                            {calculateDiscount(book.price, book.finalPrice)}% Off
                        </Badge>
                      )}
                  </div>
                  <div className='flex gap-2 overflow-x-auto overflow-hidden'>
                      {bookImage.map((images, index)=>(
                        <button key={index} onClick={()=>setSelectedImage(index)} className={`w-20 h-20 flex-shrink-0 relative transition-all duration-200 rounded-lg  ${selectedImage === index ? 'ring-2 ring-primary scale-105' : 'hover:scale-105'}`}>
                            <Image src={images} alt={`${book.title}+${index+1}`} fill className='object-cover'/>
                        </button>
                      ))}
                  </div>
                </div>

                {/* book details */}

                <div className='space-y-6'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-2'>
                      <h1 className='text-2xl font-bold'>
                        {book.title}
                      </h1>
                      <p className='text-sm text-muted-foreground'>
                        posted {formatDates(book.createdAt)} by {book.seller.name}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <ShareButton url={`${window.location.origin}/books/${book._id}`} title={`Checkout this book : ${book.title}`} text={`I found this intreating BookNEst : ${book.title}`}/>
                      <Button  variant='outline' size='sm' onClick={()=>handleAddToWishList(book._id)} >
                        <Heart size={20} className={`w-4 h-4 mr-1 fill-red-500 ${wishlist.some((w)=>w.products.includes(book._id)) ?"fill-red-500":" fill-white"}`}/>
                        <span className='hidden md:inline'>{wishlist.some((w)=>w.products.includes(book._id)) ?"Remove":"Add"}</span>
                      </Button> 
                    </div>
                    </div> 
                    <div className='space-y-4'>
                      <div className='flex items-baseline gap-2'>
                                    <span className='text-3xl font-bold'>₹{book.finalPrice}</span>
                                    {book.price && (
                                      <span className='text-sm text-muted-foreground line-through'>₹{book.price}</span>
                                    )}
                                  <Badge className='text-green-600' variant="secondary">Shipping Available</Badge>
                                  </div>
                                  <Button onClick={handleAddToCart} className='w-60 py-6 bg-blue-700'>
                                    {
                                      isAddToCart ? (
                                        <>
                                        <Loader2 className='animate-spin mr-2' size={20}/>
                                        Adding to Cart
                                        </>
                                      ) : (
                                        <>
                                        <ShoppingCart className='w-5 h-5 mr-2'/>
                                        Buy Now
                                        </>
                                      )
                                    }
                                  </Button>

                                  <Card className='border border-gray-200 shadow-sm'>
                                    <CardHeader>
                                        <CardTitle className='text-lg font-bold'>
                                          Book Details
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className='grid gap-4 '>
                                          <div className='grid grid-cols-2 gap-4 text-sm'>
                                            <div className='font-md text-muted-foreground'>
                                                Subject/Tittle
                                            </div>
                                            <div>
                                              {book.subject}
                                            </div>
                                            <div className='font-md text-muted-foreground'>
                                                Course
                                            </div>
                                            <div>
                                              {book.classType}
                                            </div>
                                            <div className='font-md text-muted-foreground'>
                                                Category
                                            </div>
                                            <div>
                                              {book.category}
                                            </div>
                                            <div className='font-md text-muted-foreground'>
                                                Author
                                            </div>
                                            <div>
                                              {book.author}
                                            </div>
                                            <div className='font-md text-muted-foreground'>
                                                edition
                                            </div>
                                            <div>
                                              {book.edition}
                                            </div>
                                            <div className='font-md text-muted-foreground'>
                                                Condition
                                            </div>
                                            <div>
                                              {book.condition}
                                            </div>
                                          </div>
                                      </CardContent>
                                  </Card> 

                    </div>
                </div>
            </div>

            <div className='mt-8 grid md:grid-cols-2 gap-8'>
              <Card className='border-none shadow-md'>
                  <CardHeader>
                    <CardTitle className='text-lg font-bold'>
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {book.description}
                      <div className='border-t pt-4 mt-4'>
                        <h3 className='font-medium mb-2'>
                          Our Community
                        </h3>
                        <p className='text-muted-foreground'>
                          We&apos;re not just another shopping website where you buy from professional sellers - we are a vibrant community of students, book lovers across India who deliver happiness to each other!
                        </p>
                      </div>
                      <div className='flex item-center gap-4 text-sm text-muted-foreground'>
                        <div>
                          Ad id : {book._id}
                        </div>
                        <div>
                          Posted : {formatDates(book.createdAt)}
                        </div>
                      </div>
                  </CardContent>
              </Card> 
              {/* book seller details */}
              <Card className='border-none shadow-md'>
                  <CardHeader>
                    <CardTitle className='text-lg font-bold'>
                      Sold By
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                                    
                      <div className='flex items-center justify-between'>
                                <div className='flex item-center gap-3'>
                                  <div className='w-12 h-12 rounded-full bg-blue-300  flex justify-center items-center'>
                                    <User2 className='h-6 w-6 text-blue-600'/>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <span className='font-medium'>
                                      {book.seller.name}
                                    </span>
                                    <Badge className='text-green-600' variant='secondary'>
                                      <CheckCircle2 size={16} className='h-3 w-3 mr-1'/>Verified
                                    </Badge>
                                  </div>
                                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                    <MapPin className='h-4 w-4'/>
                                    {
                                      book.seller?.address?.[0].city?
                                      `${book.seller?.address?.[0].city,book.seller?.address?.[0].state }`
                                      :
                                      "Location not specified"
                                    }
                                  </div>  
                                </div>
                      </div>
                      {
                        book.seller.phoneNumber && (
                          <div className='flex items-center gap-2 text-sm'>
                            <MessageCircle className='h-4 w-4 text-blue-600'/>
                            <span >
                              Contact :

                              {book.seller.phoneNumber}
                            </span> 
                          </div>
                        ) 
                      }
                  </CardContent>
              </Card> 
            </div>

            {/* How it Work  */}
            
            <section className='mt-16 '>
              <h2 className='mb-8 text-2xl font-bold'>How does it Works</h2>
              <div className='grid gap-8 md:grid-cols-3'>
                  {
                  [
    {
      step: "Step 1",
      title: "Seller posts an Ad",
      description:
        "Seller posts an ad on book kart to Sale their used books.",
      image: { src: "/icons/ads.png", alt: "Post Ad" },
    },
    {
      step: "Step 2",
      title: "Buyer Pays Online",
      description:
        "Buyer makes an online payment to book kart to buy those books.",
      image: { src: "/icons/pay_online.png", alt: "Payment" },
    },
    {
      step: "Step 3",
      title: "Seller ships the books",
      description: "Seller then ships the books to the buyer",
      image: { src: "/icons/fast-delivery.png", alt: "Shipping" },
    },
  ].map((item, index) => (
    <Card className='bg-gradient-to-br from-amber-50 to-amber-100 border-none shadow-md' key={index}>
                  <CardHeader>
                        <Badge className='w-fit mb-2'>{item.step}</Badge>
                    <CardTitle className='text-lg font-bold'>
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                        <Image src={item.image.src} alt={item.image.alt} width={120} height={120} className='mx-auto' />
                  </CardContent>
              </Card> 
                ))
                  }
              </div>
      
            </section>

      </div>
    </div>
  )
}

export default Page
