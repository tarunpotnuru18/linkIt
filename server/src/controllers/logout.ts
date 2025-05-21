import { Request,Response } from "express";
export async function logout(req:Request,res:Response) {
   res.clearCookie("token").json({
    success:true,message:"logout successful"
   })   
}