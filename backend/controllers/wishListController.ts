import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CartItems, { ICARTItem } from "../models/CartItems";
import Wishlist from "../models/Wishlist";


export const addToWhisList = async ( req:Request, res:Response) => {
    try{

        const userId = req.id
        const {productId, quantity} = req.body
        const product = await Products.findById(productId)

    if(!product){
        return response(res,400,"Product not Found")
    }

    if(product.seller.toString() === userId){
        return response(res,400,"You can not add your product to cart")
    }

    let wishList = await Wishlist.findOne({user:userId})

    if(!wishList){
        wishList = new Wishlist({user:userId, products:[]})
    }

    if(!wishList.products.includes(productId)){
        wishList.products.push(productId)
        await wishList.save()
    }
    
    await wishList.save()
    return response(res,200,'Product Added to whishList Successfully',wishList)
}catch(error){
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again")
}
}

export const removeFromWishList = async ( req:Request, res:Response) => {
    try{

        const userId = req.id
        const {productId} = req.params
        
    let wishList = await Wishlist.findOne({user:userId})

    if(!wishList){
       return response(res,400,"wishList not found for this user")
    }

    wishList.products = wishList.products.filter((id)=> id.toString() !== productId)

    await wishList.save()
    return response(res,200,'Product  removed from wishlist cart Successfully')
    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
}

export const getWishListByUser = async (req: Request, res: Response) => {
    try{

        const userId = req?.id

        let wishList = await Wishlist.findOne({user:userId}).populate('products')

    if(!wishList){
       return response(res,400,"wishList is Empty", {Products:[]})
    }

    await wishList.save()
    return response(res,200,'User wishList get Successfully', wishList)
}catch(error){
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again")
}

}