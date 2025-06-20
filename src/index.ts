import bodyParser from "body-parser";
import express from "express";
import http from "http";
import authRouter from "./routes/auth";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import userRouter from "./routes/user";
import morgan from "morgan";
import mongoose from "mongoose";

morgan.token("user-id", (req: any) => req.user?.id || "anonymous");
morgan.token("body", (req: any) => JSON.stringify(req.body));

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan(":method :url UserID=:user-id Body=:body"));
app.use(bodyParser.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

try {
  mongoose
    .connect(process.env.DB_MONGO as string)
    .then(() => console.log("Connected to MongoDB"));
} catch (err) {
  console.error("Failed to connect to MongoDB", err);
}

const PORT = process.env.APP_PORT || 4000;

const server = http.createServer(app);
export const io = new Server(server);

server.listen(PORT, () => {
  console.log("run on " + PORT);
});
