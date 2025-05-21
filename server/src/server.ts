import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/database";
import { router } from "./Routes/route";
import cookie from "cookie-parser";
import cors from "cors";
dotenv.config();
let app = express();
app.use(express.json());

connectDb(process.env.Mongo_url as string); // as string is because intially it is undefined
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookie());
app.use("/", router);


app.listen(process.env.port, () => {
  console.log("server started at " + process.env.port);
});
