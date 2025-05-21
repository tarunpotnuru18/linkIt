import { Request, Response } from "express";
import { linkModel } from "../Schema/schema";
export async function update(req: Request, res: Response) {
  try {
    let linkId = req.params.id;
    console.log(" i am executed")
    let { link, title, description, tags } = req.body;
    let linkItem = await linkModel.findById(linkId);
    if (linkItem) {
      linkItem.link = link;
      linkItem.title = title;
      linkItem.description = description;
      linkItem.tags = tags;
      await linkItem.save();
    } else {
      throw new Error("error ocuured while updating");
    }
    res.json({
      success: true,
      message: "document successfully updated",
      linkItem,
    });
  } catch (error) {
    console.log("error in update", error);
    res.json({ success: false, message: "error while updating" });
  }
}
