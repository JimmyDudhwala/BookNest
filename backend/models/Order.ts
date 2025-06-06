import mongoose, { Schema } from "mongoose";
import { IADDRESS } from "./Address";

export interface IOrderItem extends Document {
    product:mongoose.Types.ObjectId
    quantity:number
}

export interface IOrder extends Document {
    _id:mongoose.Types.ObjectId;
    user:mongoose.Types.ObjectId;
    items:IOrderItem[];
    totalAmount:number;
    shippingAddress:mongoose.Types.ObjectId | IADDRESS
    paymentStatus:'pending' | "failed" | "Complete"
    paymentMethod:string;
    paymentDetails:{
        razorPay_order_id?:string
        razorPay_payment_id?:string
        razorPay_signature_id?:string
    };
    status:'processing' | 'shipped' | 'delivered' | 'cancelled'

}

const OrderItemsSchema = new Schema<IOrderItem>({
    product:{type:Schema.Types.ObjectId, ref:'Product', required:true},
    quantity:{type:Number, required:true}
})

const OrderSchema = new Schema<IOrder>({
    user:{type:Schema.Types.ObjectId, ref:'User', required:true},
    items:{OrderItemsSchema},
    totalAmount:{type:Number},
    shippingAddress:{type:Schema.Types.ObjectId, ref:"Address"},
    paymentStatus:{type:String, enum:["pending", 'complete', 'failed'], default:"pending"},
    paymentMethod:{type:String},
    paymentDetails:{
        razorPay_order_id:{type:String},
        razorPay_payment_id:{type:String},
        razorPay_signature_id:{type:String}
    },
    status:{type:String, enum:["processing", 'shipped', 'delivered', 'cancelled'], default:null},
},{timestamps:true})


export default mongoose.model<IOrder>('Order', OrderSchema)