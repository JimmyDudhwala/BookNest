import { Request, Response } from "express";
import CartItems from "../models/CartItems";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";
import Razorpay from "razorpay";
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()


const razorpay  = new Razorpay({
    key_id:process.env.RAZORPAY_KEY as string,
    key_secret:process.env.RAZORPAY_KEY_SECRET as string,
})

export const createOrUpdateOrder = async (res:Response, req:Request) => {
 try{
    const userId = req.id
    const {orderId, shippingAddress, paymentMethod, totalAmount, paymentDetails } = req.body

    const cart = await CartItems.findOne({ user: userId }).populate('items.product');

    if(!cart || cart.items.length === 0){
        return response(res, 400, 'Cart is empty')
    }

    let order = await Order.findOne({_id:orderId})

    if(order){
        order.shippingAddress = shippingAddress || order.shippingAddress
        order.paymentMethod = paymentMethod || order.paymentMethod
        order.totalAmount = totalAmount || order.totalAmount

        if(paymentDetails){
            order.paymentDetails = paymentDetails 
            order.paymentStatus = "Complete"
            order.status = 'processing'
        }
    }else{
        order =  new Order({
            user: userId,
            items:cart.items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentDetails ? 'Complete' : 'pending'
        })
    }

    await order.save()

    if(paymentDetails){
        await CartItems.findOneAndUpdate({user: userId}, { $set: { items: [] } })
    }

    response(res,200,"order created or updated successfully", order)

 }catch(error){
    console.log(error)
    return response(res, 500, 'Internal server Error')
 }
}

export const getOrderbyUser = async (res:Response, req:Request) =>{
    try{
        const userId = req.id;
     const order = await Order.find({
        user:userId
     })
     .sort({createdAt : -1})
     .populate('user', 'name email')
     .populate('shippingAddress')
     .populate({
        path:'item-product',
        model:'Product'
     })
     if(!order){
        return response(res, 400, "Order Not found for this id")
     }

     response(res,200, 'products fetched SuccessFully', order)
    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
}

export const getOrderById = async (res:Response, req:Request) =>{
    try{
     const order = await Order.findById(req.params.id)
     .populate('user', 'name email')
     .populate('shippingAddress')
     .populate({
        path:'item-product',
        model:'Product'
     })

     if(!order){
        return response(res, 400, "Order Not found for this id")
     }

     response(res,200, 'Order fetched by id SuccessFully', order)
    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
}

export const createPaymentWithRazorpay = async (req:Request, res:Response) => {
    try{
        const {orderId} = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return response(res, 400, "Order Not found for this id");
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100), // Corrected property name
            currency: "INR", // Added required field
            receipt:order?._id.toString(),
        });

        response(res, 200, "Razorpay order created successfully", razorpayOrder);

    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
}

export const handleRazorPayWebhook = async (req:Request, res:Response) => {

    try{
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string
        const shasum = crypto.createHmac('sha256', secret)
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex')

        if(digest === req.headers["x-razorpay-signature"]){
            const paymentId = req.body.payload.payment.entity.id
            const orderId = req.body.payload.payment.entity.order.Id

            await Order.findOneAndUpdate(
                {'paymentDetails.razorpay_order_id' : orderId},
                {
                    paymentStatus:'complete',
                    status:'processing',
                    'paymentDetails.razorpay_payment_id':paymentId
                }
            )

            return response(res, 200, "WebBook processed successful")

        }else{
            return response(res, 400, "invalid signature")
        }

    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
       }
