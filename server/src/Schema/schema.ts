import mongoose, { Document, model, Schema } from "mongoose";
import { title } from "process";
import { boolean, string } from "zod";
// export interface Iuser extends Document {
//   username: string;
//   email: string;
//   password: string;
//   verificationToken: string;
//   isVerified: string;
//   twoFactorAuthenticationToken: string;
// }
let userSchema = new Schema({
  userName: String,
  email: { type: String, unique: true },
  password: String,
  verificationToken: String,
  isVerified: String,
  twoFactorAuthenticationToken: String,
  isSharing: Boolean,
});
export let userModel = model("users", userSchema);

let linkSchema = new Schema({
  link: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  tags: { type:[mongoose.Schema.Types.String], default: [] },
  category: String,
  title: String,
  description: String,
});

export let linkModel = model("link", linkSchema);

let shareSchema = new Schema({
  shareId: String,
  userId: mongoose.Schema.Types.ObjectId,
});

export let shareModel = model("share", shareSchema);
