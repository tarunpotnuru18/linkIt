import { Request, Response } from "express";
import { newReq } from "../middleware/authentication";
import { linkModel } from "../Schema/schema";
export async function del(req: Request, res: Response) {
  try {
    let { linkId } = req.params;
    console.log("i am the link id ",linkId)
    let link = await linkModel.deleteOne({ _id: linkId });
    res.json({ success: true, message: "deletion successful" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "deletion failed" });
  }
}
