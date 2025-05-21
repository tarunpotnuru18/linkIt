import { newReq } from "../middleware/authentication";
import { linkModel } from "../Schema/schema";
import { Request, Response } from "express";

export async function show(req: Request, res: Response) {
  try {
    let userId = (req as newReq).userId;
    console.log(userId);
    let links = await linkModel.find({ userId }).populate("userId","userName");
    if (!links) {
      throw new Error("error while fetching data");
    }

    res.json({
      links,
      success: true,
    });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
}
