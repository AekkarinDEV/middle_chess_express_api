import { Router, Request, Response } from "express";
import { signupAttemp, signinAttemp } from "../controllers/auth_controller";
import { jwtValidate } from "../middlewares/jwt_validate";
import { getUserById } from "../controllers/user_controller";

const userRouter = Router();

userRouter.get("/id", jwtValidate, (req: Request, res: Response) =>
  getUserById(req, res)
);
export default userRouter;
