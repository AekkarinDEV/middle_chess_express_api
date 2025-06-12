import { Router, Request, Response } from "express";
import { createUser, loginAttemp } from "../controllers/auth_controller";

const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  createUser(req, res);
});

authRouter.post("/login", async (req: Request, res: Response) => {
  loginAttemp(req, res);
});
export default authRouter;
