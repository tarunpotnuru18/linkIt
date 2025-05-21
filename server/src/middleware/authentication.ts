import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface newReq extends Request {
  userId: string;
}
export async function authentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let { token } = req.cookies;
   
    let decodeToken = jwt.verify(
      token,
      process.env.JWT_KEY as string
    ) as JwtPayload;
  
    let userId = decodeToken.userId;
    (req as newReq).userId = userId;
    
    next();
  } catch (error: any) {
    res.json({ success: false, message: "unauthorized" });
  }
}
