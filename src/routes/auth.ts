import { Router, Request, Response } from "express";
import {
  signupAttemp,
  signinAttemp,
  refreshTokenAttemp,
} from "../controllers/auth_controller";
import { googleUserAuth } from "../services/google_auth";

const authRouter = Router();

authRouter.post("/sign_up", async (req: Request, res: Response) =>
  signupAttemp(req, res)
);

authRouter.post("/sign_in", async (req: Request, res: Response) =>
  signinAttemp(req, res)
);

authRouter.post("/refresh", async (req: Request, res: Response) => {
  refreshTokenAttemp(req, res);
});

authRouter.post("/google_auth", async (req: Request, res: Response) => {
  googleUserAuth(req, res);
});
export default authRouter;
