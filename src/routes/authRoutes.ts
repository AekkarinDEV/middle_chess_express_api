import { Router } from "express";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.json("hello from auth router");
});

export default authRouter;
