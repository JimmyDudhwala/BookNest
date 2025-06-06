import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import Users from "../models/Users";

export const updateUserProfile = async (req:Request, res:Response) => {
    try{
        const userId = req.params
        if(!userId){
            return response(res, 400, 'User Id is required')
        }

        const {name, email, phoneNumber}= req.body;

        const updateUser = await Users.findByIdAndUpdate(
            userId,
            { name, email, phoneNumber },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken verificationToken -resetPasswordTokenExpire');
        
        if(!updateUser){
            return response(res, 400, 'User not found')
        }

        return response(res, 200, "User Profile updated successfully")
    
    }catch(error){
        console.log(error)
        return response(res, 500, "Internal Server Error")
    }
}

