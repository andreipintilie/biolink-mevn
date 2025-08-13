import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel.js"; // Add this import

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ msg: "Authentication Invalid" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decode.userId;

    // Fetch the full user data from database
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Authentication Invalid" });
  }
};
