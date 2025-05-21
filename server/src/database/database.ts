import mongoose from "mongoose";
export async function connectDb(url: string) {
  let db_connection = await mongoose.connect(url);
  console.log("sucessfully connected to the database");
}
