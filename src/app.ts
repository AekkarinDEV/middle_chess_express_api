import bodyParser from "body-parser";
import express from "express";
import authRouter from "./routes/auth";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("run on 8080");
});
