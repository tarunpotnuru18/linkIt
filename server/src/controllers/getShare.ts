import { Request, Response } from "express";
import { linkModel, shareModel, userModel } from "../Schema/schema";
export async function getShare(req: Request, res: Response) {
  try {
    const { shareId } = req.params;
    console.log(shareId);
    let shareData = await shareModel.findOne({ shareId });
    if (shareData) {
      let userData = await userModel.findById(shareData.userId);
      if (userData) {
        let linkData = await linkModel
          .find({ userId: userData._id })
          .select("-userId");
        res.json({
          success: true,
          userName: userData.userName,
          links: linkData,
        });
      } else {
        throw new Error("error while getting useData");
      }
    } else {
      throw new Error("error while getting sharedtaa");
    }
  } catch (error) {
    console.log(error);
    res.send("error while fetching links");
  }
}
