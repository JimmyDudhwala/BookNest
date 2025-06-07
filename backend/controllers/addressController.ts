import type { Request, Response } from "express"
import { response } from "../utils/responseHandler"
import Address from "../models/Address"
import Users from "../models/Users"

export const createOrUpdateAddressByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.id
    const { addressLine1, addressLine2, city, state, pincode, addressesId } = req.body

    console.log("createOrUpdateAddressByUserId hit - userId:", userId)
    console.log("Request body:", req.body)

    if (!userId) {
      return response(res, 400, "User not found. Please enter a valid user ID.")
    }

    if (!addressLine1  || !city || !state || !pincode) {
      return response(res, 400, "Please enter all required address fields.")
    }

    if (addressesId) {
      // ✏️ Update existing address
      const existingAddress = await Address.findById(addressesId)
      if (!existingAddress) {
        return response(res, 404, "Address not found for update.")
      }

      existingAddress.addressLine1 = addressLine1
      existingAddress.addressLine2 = addressLine2
      existingAddress.city = city
      existingAddress.state = state
      existingAddress.pincode = pincode

      const updated = await existingAddress.save()
      return response(res, 200, "Address updated successfully.", updated)
    } else {
      // 🆕 Create new address
      const newAddress = await Address.create({
        userId,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
      })

      // 🔗 Push only the ObjectId to user.addresses
      await Users.findByIdAndUpdate(userId, {
        $addToSet: { addresses: newAddress._id }, // $addToSet avoids duplicates
      })

      return response(res, 200, "User address created successfully.", newAddress)
    }
  } catch (error) {
    console.error("createOrUpdateAddressByUserId error:", error)
    return response(res, 500, "Internal Server Error")
  }
}

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const userId = req.id

    if (!userId) {
      return response(res, 400, "User not found, please provide a valid id")
    }

    const user = await Users.findById(userId).populate("addresses")

    if (!user) {
      return response(res, 404, "User not found")
    }

    // Format the response to match what the frontend expects
    // The frontend expects { success: true, message: string, data: { address: Address[] } }
    return response(res, 200, "User addresses retrieved successfully", {
      address: user.addresses || [],
    })
  } catch (error) {
    console.error("getAddressById error:", error)
    return response(res, 500, "Internal Server Error")
  }
}
