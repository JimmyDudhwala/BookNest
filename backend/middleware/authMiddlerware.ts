import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
import jwt from "jsonwebtoken";
import { response } from "../utils/responseHandler";

export const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
 
  const token = req.cookies.accessToken;
  if (!token) {
    return response(res, 401, "User Not authenticated, or no token available");
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if (!decode) {
      return response(res, 400, "Not authorized, User not found");
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    return response(res, 400, "Not Authorized, Not valid or expired");
  }
}
