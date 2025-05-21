import { Request, Response } from "express";

import { newReq } from "../middleware/authentication";
import { userModel } from "../Schema/schema";

export async function authValidator(req: Request, res: Response) {
  try {
    let userID = (req as newReq).userId;

    let user = await userModel.findById(userID);
    if (!user) {
      throw "user doesnt exist";
    }
    let userName = user?.userName;
    let isSharing = user.isSharing;
    res.json({ success: true, userName, isSharing });
  } catch (error) {
    res.json({ success: false });
  }
}
