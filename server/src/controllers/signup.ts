import { Request, Response } from "express";
import { userModel } from "../Schema/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import z, { ZodError } from "zod";
export async function signUp(req: Request, res: Response) {
  try {
    let userSchema = z.object(
      {
        email: z
          .string({ required_error: "email is required" })
          .email({ message: "email is in invalid format" }),
        password: z
          .string({ required_error: "password is required" })
          .min(5, { message: "password must be more than 5 characters" }),
        userName: z.string({
          required_error: "username is required",
          invalid_type_error: "username is in invalid format",
        }),
      },
      {
        required_error: "object is required",
        invalid_type_error: "invalid format",
      }
    );

    let zodOutput = userSchema.safeParse(req.body);
    if (zodOutput.success === false) {
      throw new ZodError(zodOutput.error.issues);
    }
    let { email, password, userName } = req.body;

    let isUserExists = await userModel.findOne({email});
    
    if (isUserExists) {
      throw new Error("user already exists");
    }
    let hashedPassword = await bcrypt.hash(password, 8);
    let hashedToken = await bcrypt.hash(password, 8);
    let user = new userModel({email,
      userName,
      password: hashedPassword,
      verificationToken: hashedToken,
      isVerified: false,
      twoFactorAuthenticationToken: null,
      isSharing:false
    });
    console.log(user)
    await user.save();
    let jwtToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_KEY as string
    );
    res.cookie("token", jwtToken, {
      httpOnly: true, // cookie cannot be accessed by client side scripts

      secure: process.env.NODE_ENV === "production", // cookie will only be set on https

       // cookie will only be set on the same site

      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ success: true, message: "operation successful" });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.json({
        success: false,
        message: "provided credentials are in wrong format",
      });
      return;
    }
   
    res.json({ success: false, message: error.message });
  }
}
