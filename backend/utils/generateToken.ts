import jwt from 'jsonwebtoken'
import { IUSER } from '../models/Users'
import dotenv from 'dotenv'

dotenv.config()

export const generateToken = (user:IUSER) : string => {
    return jwt.sign({userId: user ? user._id : null}, process.env.JWT_SECRET as string, {expiresIn: '1d'})
}