"use client"
import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useUpdateUserMutation, useGetAddressQuery, useAddOrUpdateAddressMutation } from "@/store/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { User, Mail, Phone, MapPin, Pencil, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import toast from "react-hot-toast"

interface Address {
  _id: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}


const AddressFormSchema = zod.object({
  addressLine1: zod.string().min(5, "Address Line 1 must be at least 5 characters"),
  addressLine2: zod.string().optional(),
  city: zod.string().min(2, "City must be at least 2 characters"),
  state: zod.string().min(2, "State must be at least 2 characters"),
  pincode: zod.string().min(6, "Pincode must be 6 characters"),
})

type AddressFormValues = zod.infer<typeof AddressFormSchema>

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const [updateUser, {isLoading}] = useUpdateUserMutation()
  const { data: addressData, refetch: refetchAddresses } = useGetAddressQuery(undefined)
  const [addOrUpdateAddress] = useAddOrUpdateAddressMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string>("")

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
  })

  const addresses = addressData?.data?.address || []

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      addressLine2: "",
    },
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      await updateUser({
        userId: user?._id,
        userData: formData,
      }).unwrap()
      toast.success("Profile updated successfully")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile" + error)
    }
  }

  const handleDiscard = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
    })
    setIsEditing(false)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    addressForm.reset({
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
    addressForm.reset({
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    })
    setShowAddressForm(true)
  }

  const onAddressSubmit = async (data: AddressFormValues) => {
    try {
      if (editingAddress) {
        const updateAddress = {
          ...data,
          addressesId: editingAddress._id,
        }
        await addOrUpdateAddress(updateAddress).unwrap()
        toast.success("Address updated successfully")
      } else {
        await addOrUpdateAddress(data).unwrap()
        toast.success("Address added successfully")
      }

      setShowAddressForm(false)
      setEditingAddress(null)
      addressForm.reset()
      refetchAddresses()
    } catch (error) {
      toast.error("Failed to save address")
      console.log("Error submitting address:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-pink-100">Manage your personal information and preferences</p>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Personal Information</h2>
            <p className="text-gray-600">Update your profile details and contact information</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="bg-pink-500 hover:bg-pink-600">
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                className="pl-10 bg-gray-50 border-gray-200"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className="pl-10 bg-gray-50 border-gray-200"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-medium">Phone number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                className="pl-10 bg-gray-50 border-gray-200"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Management Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Address Information</h2>
          <p className="text-gray-600">Manage your saved addresses</p>
        </div>

        {/* Address Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {addresses.map((address: Address) => (
            <Card
              key={address._id}
              className={`relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                selectedAddress === address._id
                  ? "border-pink-500 shadow-lg bg-pink-50"
                  : "border-gray-200 shadow-md hover:shadow-lg"
              }`}
              onClick={() => setSelectedAddress(address._id)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={selectedAddress === address._id}
                    onCheckedChange={() => setSelectedAddress(address._id)}
                    className="w-4 h-4"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditAddress(address)
                    }}
                  >
                    <Pencil className="h-4 w-4 text-gray-600 hover:text-pink-500" />
                  </Button>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      {address?.addressLine1 && <p className="font-medium">{address.addressLine1}</p>}
                      {address?.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Address Button */}
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
            <Form {...addressForm}>
              <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                <FormField
                  control={addressForm.control}
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
                  control={addressForm.control}
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
                    control={addressForm.control}
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
                    control={addressForm.control}
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
                  control={addressForm.control}
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
                  <Button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600"
                    disabled={addressForm.formState.isSubmitting}
                  >
                    {addressForm.formState.isSubmitting
                      ? "Saving..."
                      : editingAddress
                        ? "Update Address"
                        : "Add Address"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Action Buttons for Profile */}
      {isEditing && (
        <div className="flex gap-3 mt-6 justify-end">
          <Button variant="outline" onClick={handleDiscard} disabled={isLoading}>
            Discard Changes
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-pink-500 hover:bg-pink-600">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
