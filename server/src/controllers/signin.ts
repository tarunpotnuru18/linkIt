import { Request, Response } from "express";
import z from "zod";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel } from "../Schema/schema";
export async function signIn(req: Request, res: Response) {
  try {
    let { email, password } = req.body;
    console.log(email, password);
    let userSchema = z.object(
      {
        email: z
          .string({
            required_error: "email is required",
            invalid_type_error: "email is not in correct format",
          })
          .email({ message: "email is not in correct format" }),
        password: z
          .string({
            required_error: "password is required",
            invalid_type_error: "password is not in correct format",
          })
          .min(5, { message: "password must be more than 5 characters" }),
      },
      {
        required_error: "object is required",
        invalid_type_error: "body is not in correct format",
      }
    );

    let schemaValidation = userSchema.safeParse(req.body);

    if (schemaValidation.success === false) {
      console.log(schemaValidation.error.issues);
      throw new Error("provided credentials are in wrong format");
    }
    let user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("user doesnt exist");
    }
    /*
    if(user?.password){
        throw new error     
    }  
        concept of typeguard
    let passwordCheck = await bcrypt.compare(password, user.password);
    
    */
    let passwordCheck = await bcrypt.compare(password, user.password as string);
    if (passwordCheck === false) {
      throw new Error("provided credentials are wrong");
    }

    let jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_KEY as string
    );
    res
      .cookie("token", jwtToken, {
        httpOnly: true, // cookie cannot be accessed by client side scripts

        secure: process.env.NODE_ENV === "production", // cookie will only be set on https

        sameSite: "strict", // cookie will only be set on the same site

        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        success: true,
        message: "signin successful",
      });
  } catch (error: any) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}
