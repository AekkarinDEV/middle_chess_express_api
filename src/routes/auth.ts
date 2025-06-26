import { Router, Request, Response } from "express";
import {
  signupAttemp,
  signinAttemp,
  refreshTokenAttemp,
} from "../controllers/auth_controller";
import { googleUserAuth } from "../services/google_auth";

const authRouter = Router();

authRouter.post("/sign_up", signupAttemp);
authRouter.post("/sign_in", signinAttemp);
authRouter.post("/refresh", refreshTokenAttemp);

// google authen
authRouter.post("/google_auth", googleUserAuth);

export default authRouter;
