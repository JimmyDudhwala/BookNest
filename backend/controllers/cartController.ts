import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CartItems, { ICARTItem } from "../models/CartItems";


export const addToCart = async (req:Request, res:Response) => {
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

    let cart = await CartItems.findOne({user:userId})

    if(!cart){
        cart = new CartItems({user:userId, items:[]})
    }

    const existingItem = cart.items.find((item : ICARTItem)=>{
        item.product.toString() === productId
    })

    if(existingItem){
        existingItem.quantity+=quantity
    }else{
        const newItem = {
            product:productId,
            quantity:quantity
        }
        cart.items.push(newItem as ICARTItem)
    }
    
    await cart.save()
    return response(res,200,'Item Added to cart Successfully',cart)
}catch(error){
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again")
}
}

export const removeFromCart = async (res:Response, req:Request) => {
    try{

        const userId = req.id
        const {productId} = req.params
        
    let cart = await CartItems.findOne({user:userId})

    if(!cart){
       return response(res,400,"cart not found for this user")
    }

    cart.items = cart.items.filter((item:ICARTItem)=> item.product.toString() !== productId)

    await cart.save()
    return response(res,200,'Item removed to cart Successfully')
    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
}

export const getCartByUser = async (res:Response, req:Request) => {
    try{

        const userId = req.params.userId
        
        let cart = await CartItems.findOne({user:userId})

    if(!cart){
       return response(res,400,"cart is Empty", {item:[]})
    }

    await cart.save()
    return response(res,200,'User cart get Successfully', cart)
}catch(error){
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again")
}

}