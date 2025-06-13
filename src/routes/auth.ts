import { Router, Request, Response } from "express";
import {
  createUser,
  loginAttemp,
  refreshTokenAttemp,
} from "../controllers/auth_controller";

const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  console.log("POST /register");
  createUser(req, res);
});

authRouter.post("/login", async (req: Request, res: Response) => {
  loginAttemp(req, res);
});

authRouter.post("/refresh", async (req: Request, res: Response) => {
  refreshTokenAttemp(req, res);
});
export default authRouter;
