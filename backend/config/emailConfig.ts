import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: process.env.Email_USER,
      pass: process.env.Email_PASS,
    },
  });

  transporter.verify((error, success)=>{
    if(error){
        console.log("gmail service is not ready to send the email. please check the configuration")
    }else{
        console.log("gmail service is ready to send the email")
    }
  })

  export const sendEmail = async (to:string, subject:string, body:string) => {
    await transporter.sendMail({
        from:`"Your BookKart " <${process.env.Email_USER}>`,
        to,
        subject,
        html:body,
    })
  }

  export const sendVerificationEmail= async (to:string, token:string) => {
    const verificationUrl = `${process.env.FRONTEND_URI}/verify-email/${token}`
    const html=`
        <h1>Welcome to your bookKart!</h1>
        <p>Thank you for registration. please click link below to verify your email</p>
        <a href="${verificationUrl}">click here to verify</a>
        <p>If you didn't request to ignore this and if you have already verified your email the also ignore it</p>
    `
    await transporter.sendMail({
        from:`"Your BookKart " <${process.env.Email_USER}>`,
        to,
        subject:"please verify your email",
        html
    })
  }

  export const resetPasswordLinkToEmail = async (to:string, token:string) => {
    const ResetUrl = `${process.env.FRONTEND_URI}/Reset-Password/${token}`
    const html=`
        <h1>Welcome to your bookKart!</h1>
        <p>You have requested to reset your password. Click below link to set new password</p>
        <a href="${ResetUrl}">click here to verify</a>
        <p>If you didn't request to ignore this and if you have already verified your email the also ignore it</p>
    `
    await transporter.sendMail({
        from:`"Your BookKart " <${process.env.Email_USER}>`,
        to,
        subject:"please reset your password",
        html
    })
  }