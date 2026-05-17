import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

interface AuthRequest extends Request {
  user?: any;
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token"
      });
    }

    const token = authHeader.split(" ")[1];


    const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!);


    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {

    return res.status(401).json({
      message: "Not authorized"
    });
  }
};

export default protect;
