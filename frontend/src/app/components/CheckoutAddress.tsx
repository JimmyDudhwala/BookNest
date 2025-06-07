"use client"
import { Address } from '@/lib/types/type'
import { useAddOrUpdateAddressMutation, useGetAddressQuery } from '@/store/api'
import React, { useState } from 'react'
import * as zod from 'zod' 
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import BookLoader from '@/lib/BookLoader'
import { Card, CardContent } from '@/components/ui/card'

interface AddressResponse {
    success:boolean,
    message:string,
    data:{
        address:Address[]
    }
}


interface CheckoutAddressProp {
    onAddressSelect:()=> void
    selectedAddress?: string
}


const CheckoutAddress:React.FC <CheckoutAddressProp> = ({onAddressSelect, selectedAddress}) => {

    const {data:addressData, isLoading} = useGetAddressQuery(undefined) as {
        data:AddressResponse | undefined
        isLoading:boolean
    }

    const [addOrUpdateAddress] = useAddOrUpdateAddressMutation()
    const [showAddressForm, setShowAddressForm ] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address|null>(null)

    const addresses = addressData?.data?.address || [];


const AddressFormSchema = zod.object({
    phoneNumber: zod.string().min(10, "Phone Number must be 10 digits"),
    addressLine1: zod.string().min(5, 'Address Line 1 at least 5 character'),
    addressLine2: zod.string().optional(),
    city:zod.string().min(2, "city at least 2 character"),
    state:zod.string().min(2, "state at least 2 character"),
    pincode:zod.string().min(6, "pincode must be 6 character")
})

type AddressFormValues = zod.infer<typeof AddressFormSchema>

const form = useForm<AddressFormValues>({
    resolver:zodResolver(AddressFormSchema),
    defaultValues:{
        phoneNumber: "",
        addressLine1: "",
        city: "",
        state: "",
         pincode: "",
          addressLine2: ""
    }
})

const handleEditAddress = (address:Address) => {
    setEditingAddress(address);
    form.reset(address);
    setShowAddressForm(true)
}

const onSubmit = async (data:AddressFormValues) => {
    try{
        let result
        if(editingAddress){
            const updateAddress = {...editingAddress, ...data, addressId:editingAddress._id}
            result = await addOrUpdateAddress(updateAddress).unwrap();
            
        }else{
            result = await addOrUpdateAddress(data).unwrap
        }

        setShowAddressForm(false)
        setEditingAddress(null)
    }catch(error){
        console.log("error")
    }
}

if(isLoading){
    return<BookLoader />
}


  return (
    <div >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            {
                addresses.map((address: Address) => {
                    return (
                        <Card key={address._id} className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${selectedAddress === address._id ? "border-blue-500 shadow-lg":"border-gray-200 shadow-md hover:shadow-lg"}`}>
                            <CardContent className='p-6 space-y-4'>
                                <div>
                                    
                                </div>
                            </CardContent>
                        </Card>
                    );
                })
            }
        </div>
    </div>
  )
}

export default CheckoutAddress
