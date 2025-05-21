import { Request, Response } from "express";
import { shareModel, userModel } from "../Schema/schema";
import { v4 as randomHashGenerator } from "uuid";
export interface newReq extends Request {
  userId: string;
}
export async function share(req: Request, res: Response) {
  try {
    let { share } = req.body;
    console.log(req.body)
    let userId = (req as newReq).userId;
    let user = await userModel.findById(userId);
    if (!user) {
      throw new Error("user does not exist");
    }
    let randomNumber = randomHashGenerator().substring(0, 9);
    if (share === true) {
      let shareCheck = await shareModel.findOne({ userId });
      if (shareCheck) {
        res.json({
          success: true,
          message: "switching on share successful",
          shareId: shareCheck.shareId,
        });
        return;
      }
      let shareData = await shareModel.create({
        userId,
        shareId: randomNumber,
      });
      user.isSharing = true;
      await user.save();
      res.json({
        success: true,
        message: "switching on share successful",
        shareId: randomNumber,
      });
      return;
    } else {
      user.isSharing = false;
      await user.save();
      await shareModel.deleteOne({ userId });
      res.json({ success: true, message: "switching off share successful" });
      return;
    }
  } catch (error) {
    console.log("error from share handler");

    res.json({
      success: false,
      message: "error while doing the share operation",
    });
  }
}
