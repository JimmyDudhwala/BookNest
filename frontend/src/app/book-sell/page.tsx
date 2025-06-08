"use client"
import type { BookDetails } from "@/lib/types/type"
import { useAddProductsMutation } from "@/store/api"
import { toggleLoginDialog } from "@/store/slice/userSlice"
import type { RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import NoData from "../components/NoData"
import Link from "next/link"
import { BookOpen, Camera, ChevronRight, CreditCard, HelpCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { filters } from "@/lib/Constant"
import Image from "next/image"

const SellPage = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [addProducts, {isLoading}] = useAddProductsMutation()
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<BookDetails>({
    defaultValues: {
      images: [],
      condition: "Excellent",
      paymentMode: "UPI",
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      const currentFiles = watch("images") || []

      setUploadedImages((prevImage) => {
        return [...prevImage, ...newFiles.map((file) => URL.createObjectURL(file))].slice(0, 4)
      })

      setValue("images", [...currentFiles, ...newFiles].slice(0, 4) as string[])
    }
  }

  const removeImages = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i != index))

    const currentFiles = watch("images") || []
    const uploadFiles = currentFiles.filter((_, i) => i != index)
    setValue("images", uploadFiles)
  }

  const onsubmit = async (data: BookDetails) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images" && value) {
          formData.append(key, String(value));

        }
      })

      if (data.paymentMode == "UPI") {
        formData.set("paymentDetails", JSON.stringify({ upiId: data.paymentDetails.upiId }))
      } else if (data.paymentMode == "Bank Account") {
        formData.set("paymentDetails", JSON.stringify({ bankDetails: data.paymentDetails.bankDetails }))
      }

      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((image) => formData.append("images", image))
      }

for (const [key, value] of formData.entries()) {
  
}


      const result = await addProducts(formData).unwrap()
      if (result.success) {
        router.push(`books/${result.data._id}`)
        toast.success("Book added successfully")
        reset()
      }
    } catch (error) {
      toast.error("Failed to list the book, please try again later")
      console.error("Error submitting form:", error)
    }
  }

  const paymentMode = watch("paymentMode")

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog())
  }

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-600">Sale Your Used Books</h1>
          <p className="text-gray-600 mb-4">Submit a free classified ad to Sale your used books for cash in India</p>
          <Link href="#" className="text-blue-500 hover:underline inline-flex items-center">
            Learn how it works
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onsubmit)} className="space-y-8">
          {/* Book Details Section */}
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 flex flex-row items-center">
              <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
              <CardTitle className="text-blue-600">Book Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Ad Title */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="title" className="md:w-1/4 font-medium text-gray-700">
                  Ad Title
                </Label>
                <div className="md:w-3/4">
                  <Input
                    id="title"
                    {...register("title", {
                      required: "Ad title is required",
                    })}
                    placeholder="Enter your ad title"
                    className="w-full"
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>
              </div>

              {/* Book Type */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="bookType" className="md:w-1/4 font-medium text-gray-700">
                  Book Type
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Book type is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Please select book type" />
                        </SelectTrigger>
                        <SelectContent>
                         {
                          filters.category.map((category)=>(
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                           
                         }
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>
              </div>

              {/* Book Condition */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="condition" className="md:w-1/4 font-medium text-gray-700">
                  Book Condition
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="condition"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup key="field" onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-6">
                        {
                          filters.condition.map((condition)=>(
                            <div key={condition} className="flex items-center space-x-2">
                            <RadioGroupItem value={condition} id={condition} />
                            <Label htmlFor="excellent">{condition}</Label>
                          </div>
                          ))
                           
                         }
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>

              {/* For Class */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="classType" className="md:w-1/4 font-medium text-gray-700">
                  For Class
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="classType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Please select class" />
                        </SelectTrigger>
                        <SelectContent>
                        {
                          filters.classType.map((classType)=>(
                            <SelectItem key={classType} value={classType}>
                              {classType}
                            </SelectItem>
                          ))
                           
                         }
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Book Title/Subject */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="subject" className="md:w-1/4 font-medium text-gray-700">
                  Book Title/Subject
                </Label>
                <div className="md:w-3/4">
                  <Input
                    id="subject"
                    {...register("subject", {
                      required: "Book title is required",
                    })}
                    placeholder="Enter book name"
                    className="w-full"
                  />
                  {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
                </div>
              </div>

              {/* Upload Photos */}
              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="images" className="md:w-1/4 font-medium text-gray-700 pt-2">
                  Upload Photos
                </Label>
                <div className="md:w-3/4">
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Camera className="h-10 w-10 mx-auto text-blue-500 mb-2" />
                      <p className="text-blue-600 font-medium">Click here to upload up to 4 images</p>
                      <p className="text-gray-500 text-sm">(Size: 15MB max. each)</p>
                    </label>
                  </div>

                  {/* Display uploaded images */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={(image as string) || "/placeholder.svg"}
                            alt={`Uploaded ${index + 1}`}
                            width={96}
                            height={96}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImages(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional Details Section */}
          <Card className="shadow-lg border-t-4 border-t-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 flex flex-row items-center">
              <HelpCircle className="mr-2 h-6 w-6 text-green-600" />
              <CardTitle className="text-green-600">Optional Details</CardTitle>
              <p className="text-sm text-green-600 ml-2">(Description, MRP, Author, etc...)</p>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="book-info">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="font-medium text-gray-700">Book Information</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="author" className="font-medium text-gray-700 mb-1 block">
                            Author
                          </Label>
                          <Input id="author" {...register("author")} placeholder="Enter author name" />
                        </div>
                        <div>
                          <Label htmlFor="edition" className="font-medium text-gray-700 mb-1 block">
                          Edition (Year)
                          </Label>
                          <Input id="publisher" {...register("edition")} placeholder="Enter publisher name" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                          <Label htmlFor="price" className="font-medium text-gray-700 mb-1 block">
                            MRP (₹)
                          </Label>
                          <Input id="price" type="number" {...register("price")} placeholder="Enter original price" />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ad-description">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="font-medium text-gray-700">Ad Description</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      {...register("description")}
                      placeholder="Describe your book in detail (condition, highlights, etc.)"
                      className="min-h-[120px]"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Pricing Details Section */}
          <Card className="shadow-lg border-t-4 border-t-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 flex flex-row items-center">
              <CreditCard className="mr-2 h-6 w-6 text-yellow-600" />
              <CardTitle className="text-yellow-600">Pricing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Your Price */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="finalPrice" className="md:w-1/4 font-medium text-gray-700">
                  Your final Price (₹)
                </Label>
                <div className="md:w-3/4">
                  <Input
                    id="finalPrice"
                    type="number"
                    {...register("finalPrice", {
                      required: "final Price is required",
                      min: {
                        value: 1,
                        message: "final Price must be greater than 0",
                      },
                    })}
                    placeholder="Enter your ad finalPrice"
                    className="w-full"
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>
              </div>

              {/* Shipping Charges */}
              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="shippingCharges" className="md:w-1/4 font-medium text-gray-700 pt-2">
                  Shipping Charges
                </Label>
                <div className="md:w-3/4">
                  <div className="flex items-center space-x-4">
                    <Input
                      id="shippingCharges"
                      type="number"
                      {...register("shippingCharge")}
                      placeholder="Enter shipping charges"
                      className="w-full"
                      disabled={watch("shippingCharge") === 'free'}
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">or</span>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="shippingCharge"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="freeShipping"
                              checked={field.value === 'free'}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? 'free' : "")
                              }}
                            />
                          )}
                        />
                        <Label htmlFor="freeShipping">Free Shipping</Label>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Buyers prefer free shipping or low shipping charges.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details Section */}
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 flex flex-row items-center">
              <CreditCard className="mr-2 h-6 w-6 text-blue-600" />
              <CardTitle className="text-blue-600">Bank Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Payment Mode */}
              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">Payment Mode</Label>
                <div className="md:w-3/4">
                  <p className="text-gray-700 mb-3">
                    After your book is sold, in what mode would you like to receive the payment?
                  </p>
                  <Controller
                    name="paymentMode"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="UPI" id="upi" />
                          <Label htmlFor="upi">UPI Number</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Bank Account" id="bank" />
                          <Label htmlFor="bank">Bank Account</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {/* Conditional fields based on payment mode */}
                  <div className="mt-4">
                    {paymentMode === "UPI" && (
                      <div>
                        <Label htmlFor="upiId" className="font-medium text-gray-700 mb-1 block">
                          UPI ID
                        </Label>
                        <Input
                          id="upiId"
                          {...register("paymentDetails.upiId", {
                            required: "UPI ID is required",
                          })}
                          placeholder="Enter your UPI ID"
                          className="w-full"
                        />
                        {errors.paymentDetails?.upiId && (
                          <p className="text-red-500 text-sm">{errors.paymentDetails.upiId.message}</p>
                        )}
                      </div>
                    )}

                    {paymentMode === "Bank Account" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="accountNumber" className="font-medium text-gray-700 mb-1 block">
                            Account Number
                          </Label>
                          <Input
                            id="accountNumber"
                            {...register("paymentDetails.bankDetails.accountNumber", {
                              required: "Account number is required",
                            })}
                            placeholder="Enter your account number"
                            className="w-full"
                          />
                          {errors.paymentDetails?.bankDetails?.accountNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.paymentDetails.bankDetails.accountNumber.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="ifscCode" className="font-medium text-gray-700 mb-1 block">
                            IFSC Code
                          </Label>
                          <Input
                            id="ifscCode"
                            {...register("paymentDetails.bankDetails.ifscCode", {
                              required: "IFSC code is required",
                            })}
                            placeholder="Enter IFSC code"
                            className="w-full"
                          />
                          {errors.paymentDetails?.bankDetails?.ifscCode && (
                            <p className="text-red-500 text-sm">{errors.paymentDetails.bankDetails.ifscCode.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="BankName" className="font-medium text-gray-700 mb-1 block">
                          Bank Name
                          </Label>
                          <Input
                            id="accountHolderName"
                            {...register("paymentDetails.bankDetails.bankName", {
                              required: "Account holder name is required",
                            })}
                            placeholder="Enter account holder name"
                            className="w-full"
                          />
                          {errors.paymentDetails?.bankDetails?.bankName && (
                            <p className="text-red-500 text-sm">
                              {errors.paymentDetails.bankDetails.bankName.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col items-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-10 rounded-md text-lg font-medium w-full md:w-auto"
            >
              {
                isLoading ? (
                  <>
                  <Loader2 className="animate-spin mr-2" size={20}/> 
                  saving
                  </>
                ):(
                  <>
                  Post your Book
                  </>
                )
              }
            </Button>
            <p className="text-gray-600 text-sm mt-4 text-center">
              By clicking &quot;Post Your Book&quot;, you agree to our{" "}
              <Link href="/terms-of-use" className="text-blue-500 hover:underline">
                Terms of Use
              </Link>
              ,{" "}
              <Link href="/privacy-policy" className="text-blue-500 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellPage
