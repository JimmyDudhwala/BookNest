import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Users from "../models/Users";

export const updateUserProfile = async (req:Request, res:Response) => {
    try{
        const { userId } = req.params  // Extract userId from params object
        if(!userId){
            return response(res, 400, 'User Id is required')
        }

        const {name, email, phone}= req.body;  // Changed to match frontend

        const updateUser = await Users.findByIdAndUpdate(
            userId,  // Now this is a string, not an object
            { name, email, phone },  // Changed to match frontend
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -verificationToken -resetPasswordTokenExpire');
        
        if(!updateUser){
            return response(res, 400, 'User not found')
        }

        return response(res, 200, "User Profile updated successfully", updateUser)
    
    }catch(error){
        console.log(error)
        return response(res, 500, "Internal Server Error")
    }
}
