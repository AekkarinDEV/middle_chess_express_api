import { Router } from "express";
import { jwtValidate } from "../middlewares/jwt_validate";
import { getUserById } from "../controllers/user_controller";

const userRouter = Router();

userRouter.get("/id", jwtValidate, getUserById);

export default userRouter;
