import { Router } from "express";
import authRouter from "./authRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.json(200);
});

router.use("/auth", authRouter);

export default router;
