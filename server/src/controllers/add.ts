import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel, linkModel } from "../Schema/schema";
import { newReq } from "../middleware/authentication";
export async function add(req: Request, res: Response) {
  try {
    let userId = (req as newReq).userId;
    let user = await userModel.findById(userId);
    console.log(user);
    if (!user) {
      throw new Error("user doesnt exist");
    }
    let { link, tags, title, description, category } = req.body;

    let linkTest = await linkModel.create({
      userId,
      link,
      tags,
      title,
      description,
      category,
    });

    res.json({
      success: true,
      message: "operation successful",
      linkItem: {
        link: linkTest.link,
        id: linkTest._id,
        tags: linkTest.tags,
        title: linkTest.title,
        description: linkTest.description,
        category: linkTest.category,
      },
    });
  } catch (error: any) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}
