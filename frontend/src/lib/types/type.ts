export interface  BookDetails {
    _id:string,
    title:string,
    images:string[],
    subject:string,
    category:string,
    condition:string,
    classType:string,
    price:number,
    author:string,
    edition?:string,
    description?:string,
    finalPrice:number,
    shippingCharge:string,
    seller:UserData,
    paymentMode:'UPI' | 'Bank Account',
    paymentDetails:{
        upiId?:string,
        bankDetails?:{
            accountNumber:string,
            ifscCode:string,
            bankName:string
        }
    },
    createdAt:Date
}

export interface UserData {
    name:string,
    email:string,
    profilePicture:string,
    address: Address[],
    phoneNumber:string
}

export interface Address {
    _id:string,
    addressLine1:string,
    addressLine2:string,
    phoneNumber:string,
    city:string,
    state:string,
    pincode:string,
}

export interface product {
    _id:string,
    images:string[],
    title:string[],
    price:number,
    finalPrice:number,
    shippingCharges:string,
}

export interface CartItem {
    _id:string,
    product:product,
    quantity:number,
}
export interface OrderItem {
    _id:string,
    product:BookDetails,
    quantity:number,
}

export interface paymentDetails {
    razorPay_order_id?:string
    razorPay_payment_id?:string
    razorPay_signature_id?:string
}

export interface Order {
    _id:string;
    user:UserData;
    items:OrderItem[];
    createdAt:Date
    totalAmount:number;
    shippingAddress:Address,
    paymentStatus:string,
    paymentMethod:string;
    paymentDetails:string
    status:string

}

export interface User {
    _id:string
    avatar?:string
    name: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    googleId: string;
    profilePicture?: string;
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    agreeTerms: boolean;
    addresses: Address[];
}