import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { MongoDuplicateKeyError } from "utils/mongoose_err_interface";

export const signupAttemp = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email,
    });

    const createdUser = await newUser.save();
    res.status(200).json({
      messege: "success",
    });
  } catch (err) {
    console.log(err);
    const error = err as MongoDuplicateKeyError;
    if (error?.code === 11000) {
      if (error?.errorResponse?.errmsg.includes("email")) {
        res.status(409).json({
          duplicate: "email",
        });
      }
      if (error?.errorResponse?.errmsg.includes("username")) {
        res.status(409).json({
          duplicate: "username",
        });
      }
    } else {
      res.status(500).json({
        error: "unknow",
      });
    }
  }
};

export const signinAttemp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const foundUser = await User.findOne({
      username: username,
    });
    if (!foundUser) {
      res.status(404).json({
        error: "user not found",
      });
      return;
    }
    const matchPassword = await bcrypt.compare(
      password,
      foundUser?.password as string
    );
    if (matchPassword) {
      const accessToken = jwt.sign(
        { username: foundUser?.username },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: "15m",
          algorithm: "HS256",
        }
      );
      const refreshToken = jwt.sign(
        { username: foundUser?.username },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
          expiresIn: "1h",
          algorithm: "HS256",
        }
      );

      await User.findOneAndUpdate(
        { username: username },
        { refresh_token: refreshToken }
      );

      res.status(200).json({
        messege: "success",
        user_id: foundUser?._id,
        username: foundUser?.username,
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      return;
    } else {
      res.status(400).json({
        messege: "wrong password",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

export const refreshTokenAttemp = async (req: Request, res: Response) => {
  const { username, refresh_token } = req.body;
  const foundUser = await User.findOne({
    username: username,
  });

  if (!foundUser) {
    res.status(404).json({
      messege: "user not found",
    });
    return;
  }

  const isRefreshMatch = foundUser?.refresh_token === refresh_token;
  if (isRefreshMatch) {
    const accessToken = jwt.sign(
      { username: foundUser?.username },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
        algorithm: "HS256",
      }
    );
    const refreshToken = jwt.sign(
      { username: foundUser?.username },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "1h",
        algorithm: "HS256",
      }
    );
    try {
      await User.findByIdAndUpdate(
        { username: username },
        { refresh_token: refreshToken }
      );
    } catch {
      res.status(500).json({
        messege: "store refrsh token fail",
      });
    }
    res.status(200).json({
      messege: "success",
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } else {
    res.status(401).json({
      messege: "invalid refresh token",
    });
  }
};
