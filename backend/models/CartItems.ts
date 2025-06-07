import mongoose, { Document, Schema, model, models } from "mongoose";

export interface ICARTItem extends Document {
    _id:string,
    product: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICART extends Document {
    user: mongoose.Types.ObjectId;
    items: ICARTItem[];
}

const cartItemSchema = new Schema<ICARTItem>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const cartSchema = new Schema<ICART>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [cartItemSchema], required: true }
}, { timestamps: true });

const Cart = models.Cart || model<ICART>('Cart', cartSchema);
export default Cart;
