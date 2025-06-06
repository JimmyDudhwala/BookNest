import mongoose, {Document, Schema} from "mongoose"

export interface IADDRESS extends Document {
    user:mongoose.Types.ObjectId,
    addressLine1:string,
    addressLine2:string,
    phoneNumber:string,
    city:string,
    state:string,
    pincode:string,
}

const adressSchema = new Schema<IADDRESS>({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    addressLine1:{type:String, required:true},
    addressLine2:{type:String, default:null},
    city:{type:String, required:true},
    state:{type:String, required:true},
    pincode:{type:String, required:true},
}, {timestamps: true})


export default mongoose.model<IADDRESS>('Address', adressSchema)