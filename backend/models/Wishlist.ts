import mongoose, {Document, Schema} from "mongoose";


export interface IWHISHLIST extends Document{
    user:mongoose.Types.ObjectId,
    products:mongoose.Types.ObjectId[]
}


const whishlistSchema = new Schema<IWHISHLIST>({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    products:[{type:mongoose.Schema.Types.ObjectId, ref:'Product'}]
},{timestamps:true})

export default mongoose.model<IWHISHLIST>('Wishlist', whishlistSchema)