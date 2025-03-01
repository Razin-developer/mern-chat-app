import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getUser } from "../service/jwt.service.js";

declare global {
	namespace Express {
		export interface Request {
      users?: {
				_id: mongoose.Types.ObjectId;
				name: string;
				email: string;
				password: string;
				profileImage: string;
				createdAt: Date;
				updatedAt: Date;
			};
		}
	}
}

const authorize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      res.status(401).json({ status: false, error: "Unauthorized - No token provided" });
      return;
    }

    const decoded = getUser(token);

    if (!decoded) {
      res.status(401).json({ status: false, error: "Unauthorized - Invalid Token" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user._id || !user.name || !user.email || !user.password || !user.profileImage) {
      res.status(404).json({ status: false, error: "User not found" });
      return;
    }

    req.users = {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      profileImage: user.profileImage,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
    };

    next();
  } catch (error: any) {
    console.error("Error in authorize middleware", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authorize;
