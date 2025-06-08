import {Request, Response} from "express"
import Users from "../models/Users"
import { response } from "../utils/responseHandler";
import crypto from 'crypto'
import { resetPasswordLinkToEmail, sendVerificationEmail } from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";

export const register = async (req:Request, res:Response) => {
    try{
        const {name, email, password, agreeTerms} = req.body    
        
        const existingUser = await Users.findOne({email});

        if(existingUser){
            return response(res, 400, "user already exist")
        }

        const verificationToken = crypto.randomBytes(20).toString('hex')
        const user = new Users({name, email, password, agreeTerms, verificationToken})

        await user.save();

      if (user.email) {
          const result = await sendVerificationEmail(user.email, verificationToken);
          console.log(result)
      } else {
          return response(res, 400, "User email is missing");
      }


        return response(res, 200, "User registration successful, Please check your email to verify  account")

    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
  
      const user = await Users.findOne({ verificationToken: token });
      if (!user) {
        return response(res, 400, "Invalid or expired verification token");
      }
  
      user.isVerified = true;
      user.verificationToken = undefined;
  
      const accessToken = generateToken(user);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite:"none",
        secure:true,
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      await user.save();
      return response(res, 200, "Email verified successfully");
    } catch (error) {
      console.log(error);
      return response(res, 500, "Internal Server Error, please try again");
    }
  };
  

export const login =  async (req:Request, res:Response) => {
    try{
    const {email, password} = req.body;
    const user = await Users.findOne({email});
    if (!user || !(await user.comparePassword(password))) {
        return response(res, 400, "Invalid Email or Password ");
    }

    if(!user.isVerified){
        return response(res, 400, "Please verified your email. check your email inbox to verify")
    }

    const accessToken  = generateToken(user)
    res.cookie("accessToken", accessToken,{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        maxAge:24*60*60*1000
    })

    return response(res, 200, "Login successfully", {user:{name:user.name, email:user.email}})

}catch(error){
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again")
}
}

export const forgotPassword = async (req:Request, res:Response) => {

   try{ 
    const {email} = req.body
    const user = await Users.findOne({email:email});
    if(!user){
        return response(res, 400, "No account Found")
    }

    const resetPasswordToken = crypto.randomBytes(20).toString('hex')
    console.log("resetPasswordToken : - " + resetPasswordToken)
    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordExpires = new Date(Date.now() + 3600000)
    await user.save()

    if (user.email) {
        await resetPasswordLinkToEmail(user.email, resetPasswordToken);
        return response(res, 200, "A password reset link has been sent to your email address");
    } else {
        return response(res, 400, "User email is missing");
    }

}catch(error){
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again")
}

}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    console.log("Received token:", token);

    const user = await Users.findOne({
      resetPasswordToken: token, // make sure this is correct
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return response(res, 400, "Invalid or expired reset password token");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return response(res, 200, "Password reset successful");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};


export const logout = async (req:Request, res:Response) => {
    try{
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/", // or exact path used when setting it
          });
          return response(res, 200, "Successfully logged out");
          
    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
}

export const checkUSerAuth = async (req:Request, res:Response) =>{
    try{
        const userId = req?.id;
        if(!userId){
            return response(res,400,"unauthiticated please login to access our data")

        }
        const user = await Users.findById(userId).select('-password -resetPasswordToken -verificationToken -resetPasswordTokenExpire ' )

        if(!user){
            return response(res,400,'user Not Found')
        }

        return response(res,201, "User retrieved Successfully ", user)
    }catch(error){
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again")
    }
} 