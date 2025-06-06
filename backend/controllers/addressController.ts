import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import Users from "../models/Users";

export const createOrUpdateAddressByUserId = async (req:Request, res:Response) => {
    try{
        const userId = req.id;
        const {addressLine1, addressLine2, phoneNumber, city, state, pincode, addressesId } = req.body;

        if(!userId){
            return response(res, 400, 'User not found please enter valid user id')
        }

        if(!addressLine1 || !phoneNumber || city || state ||pincode ){
            return response(res, 400, 'please enter all values to create new address')
        }

        if(!addressesId){
            const existingAddress = await Address.findById(addressesId)

            if(!existingAddress){
                return response(res, 400, 'Address not found')
            }

            existingAddress.addressLine1 = addressLine1,
            existingAddress.addressLine2 = addressLine2,
            existingAddress.phoneNumber = phoneNumber,
            existingAddress.city = city,
            existingAddress.state = state
            existingAddress.pincode = pincode

            await existingAddress.save()
            return response(res, 200, 'Address updated successfully')

        }else{
            const newAddress = await new Address({
                userId:userId,
                 addressLine1,
                  addressLine2,
                  state,
                  city,
                  phoneNumber,
                  pincode  
            })

            await newAddress.save()

            await Users.findByIdAndUpdate(
                userId,
                { $push: { addresses: newAddress._id } },
                {new:true}
            );

            return response(res, 200, "User Address Created Successfully", newAddress)
        }
    }catch(error){
        console.log(error)
        return response(res, 500, "Internal Server Error")
    }
}

export const getAddressById = async (req:Request, res:Response) => {
    try{
        const userId = req.id

        if(!userId){
            return response(res, 400, 'user not found, please provide a valid id');
        }

        const address = await Users.findById(userId).populate('addresses');

        if(!address){
            return response(res, 400, 'Address not found')
        }

        return response(res, 200, "User Address get Successfully")
    }catch(error){
        return response(res, 500, "Internal Server Error")
    }
}