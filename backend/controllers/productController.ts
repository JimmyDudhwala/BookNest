import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudnaryConfig";
import products from "../models/Products";
import Products from "../models/Products";

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body
        const  sellerId = req.id
        const images = req.files as Express.Multer.File[]

        if (!images || images.length === 0) {
            return response(res, 400, 'images are required')
        }
        let parsedPaymentsDetails = JSON.parse(paymentDetails)

        if (paymentMode === 'UPI' && (!parsedPaymentsDetails || !parsedPaymentsDetails.upiId)) {
            return response(res, 400, 'UPI ID is required for payment');
        }

        if (paymentMode === 'Bank Account' && (
            !parsedPaymentsDetails || !parsedPaymentsDetails.bankDetails || !parsedPaymentsDetails.bankDetails.accountNumber || !parsedPaymentsDetails.bankDetails.ifscCode || !parsedPaymentsDetails.bankDetails.bankName)
        )
            return response(res, 400, "bank account details is required for payment")

        const uploadPromise = images.map(file => uploadToCloudinary(file as any));
        const uploadImages = await Promise.all(uploadPromise)
        const imageUrl = uploadImages.map(image => image.secure_url)

        const product = new Products({
            title,
            description,
            classType,
            price,
            subject,
            finalPrice,
            shippingCharge,
            category,
            condition,
            paymentMode,
            paymentDetails:parsedPaymentsDetails,
            author,
            edition,
            seller:sellerId,
            images:imageUrl
        })

        await product.save()

        return response(res,200, "product created successFully",product)

    } catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
} 

export const getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await Products.find()
        .sort({ createdAt: -1 })
        .populate('seller', 'name email');
  
      response(res, 200, 'Products fetched successfully', products);
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Internal Server Error, please try again');
    }
  };
  

  export const getProductById = async (req: Request, res: Response) => {
    try {
      const product = await Products.findById(req.params.id)

        .populate({
          path: "seller",
          select: 'name email profilePicture PhoneNumber addresses',
          populate: {
            path: "addresses",
            model: "Address"
          }
        });
  
      if (!product) {
        return response(res, 400, "Product not found for this ID");
      }
  
      return response(res, 200, "Product fetched by ID successfully", product);
    } catch (error) {
      console.error(error);
      return response(res, 500, "Internal Server Error, please try again");
    }
  };
  
  

export const deleteProduct = async (req:Request, res:Response) => {
    try{
        const product = await Products.findByIdAndDelete(req.params.productId)
   
        if(!product){
           return response(res, 400, "Product Not found for this id")
        }
   
        response(res,200, 'products Deleted SuccessFully', products)
       }catch(error){
           console.log(error);
           return response(res, 500, "Internal Server Error, please try again")
       }
}

export const getProductBySellerId = async (req:Request, res:Response) =>{
    try{
        const sellerId = req.params.sellerId;

        if(!sellerId){
            return response(res, 400, "No Seller found provide valid Seller Id")
        }

     const product = await Products.find({seller:sellerId})
     .sort({createdAt : -1})
     .populate('seller', 'name email profilePicture PhoneNumber addresses')


     if(!product){
        return response(res, 400, "Products Not found by this Seller Id for this id")
     }

     response(res,200, 'products fetched by sellers id SuccessFully', product)
    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
}