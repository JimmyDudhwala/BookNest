"use client"
import type { Address } from "@/lib/types/type"
import { useAddOrUpdateAddressMutation, useGetAddressQuery } from "@/store/api"
import type React from "react"
import { useState } from "react"
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import BookLoader from "@/lib/BookLoader"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface AddressResponse {
  success: boolean
  message: string
  data: {
    address: Address[]
  }
}

interface CheckoutAddressProp {
    onAddressSelect: (address: Address) => void
    selectedAddress?: string
  }

const CheckoutAddress: React.FC<CheckoutAddressProp> = ({ onAddressSelect, selectedAddress }) => {
  const { data: addressData, isLoading } = useGetAddressQuery(undefined) as {
    data: AddressResponse | undefined
    isLoading: boolean
  }

  const [addOrUpdateAddress] = useAddOrUpdateAddressMutation()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  // Make sure we're accessing the address array correctly
  const addresses = addressData?.data?.address || []

  console.log("Address data from API:", addressData)
  console.log("Parsed addresses:", addresses)

  const AddressFormSchema = zod.object({
    addressLine1: zod.string().min(5, "Address Line 1 must be at least 5 characters"),
    addressLine2: zod.string().optional(),
    city: zod.string().min(2, "City must be at least 2 characters"),
    state: zod.string().min(2, "State must be at least 2 characters"),
    pincode: zod.string().min(6, "Pincode must be 6 characters"),
  })

  type AddressFormValues = zod.infer<typeof AddressFormSchema>

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      addressLine2: "",
    },
  })

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    form.reset({
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    })
    setShowAddressForm(true)
  }

  const handleAddNewAddress = () => {
    setEditingAddress(null)
    form.reset({
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    })
    setShowAddressForm(true)
  }

  const onSubmit = async (data: AddressFormValues) => {
    try {
      if (editingAddress) {
        // For updating, we need to send the addressId as addressesId (note the plural)
        const updateAddress = {
          ...data,
          addressesId: editingAddress._id, // Use addressesId as expected by the backend
        }
        await addOrUpdateAddress(updateAddress).unwrap()
      } else {
        await addOrUpdateAddress(data).unwrap()
      }

      setShowAddressForm(false)
      setEditingAddress(null)
      form.reset()
    } catch (error) {
      console.log("Error submitting address:", error)
    }
  }

  if (isLoading) {
    return <BookLoader />
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {addresses.map((address: Address) => {
          return (
            <Card
              key={address._id}
              className={`relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                selectedAddress === address._id
                  ? "border-blue-500 shadow-lg bg-blue-50"
                  : "border-gray-200 shadow-md hover:shadow-lg"
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={selectedAddress === address._id}
                    onCheckedChange={() => onAddressSelect(address)}
                    className="w-5 h-5"
                  />
                  <div className="flex items-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditAddress(address)
                      }}
                    >
                      <Pencil className="h-4 w-4 text-gray-600 hover:text-blue-500" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  {address?.addressLine1 && <p className="font-medium">{address.addressLine1}</p>}
                  {address?.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.pincode}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline" onClick={handleAddNewAddress}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Street address, House number" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment, suite, unit, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="6-digit pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CheckoutAddress
