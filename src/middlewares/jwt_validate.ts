import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: any;
}

export const jwtValidate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.headers["authorization"]) {
      res.status(401).json({
        messege: "no token in header",
      });
    } else {
      const token = req.headers["authorization"].replace("Bearer ", "");

      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err, decoded) => {
          if (err) throw new Error(err.message);
          next();
        }
      );
    }
  } catch (error) {
    res.status(403).json({
      messege: "token expired",
    });
  }
};

const jwtRefreshTokenValidate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.headers["authorization"]) {
      res.sendStatus(401);
      return;
    }

    const token = req.headers["authorization"].replace("Bearer ", "");

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err, decoded) => {
        if (err) {
          res.sendStatus(403);
          return;
        }

        const { exp, iat, ...rest } = decoded as any;
        req.user = {
          ...rest,
          token,
        };
        next();
      }
    );
  } catch (error) {
    res.sendStatus(403);
  }
};
