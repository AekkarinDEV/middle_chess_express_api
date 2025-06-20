import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { DatabaseError } from "pg";
import jwt from "jsonwebtoken";
import { User } from "models";

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
    res.status(500).json({
      error: err,
    });
  }
};

export const signinAttemp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const { rows } = await DBclient.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const result = rows[0];
    if (!result) {
      res.status(404).json({
        messege: "user not found",
      });
      return;
    }
    const matchPassword = await bcrypt.compare(password, result?.password);
    if (matchPassword) {
      const accessToken = jwt.sign(
        { username: result.username },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: "15m",
          algorithm: "HS256",
        }
      );
      const refreshToken = jwt.sign(
        { username: result.username },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
          expiresIn: "1h",
          algorithm: "HS256",
        }
      );
      try {
        await DBclient.query(
          "UPDATE users SET refresh_token = $1 WHERE id = $2",
          [refreshToken, result.id]
        );
      } catch {
        res.status(500).json({
          messege: "store refrsh token fail",
        });
      }
      res.status(200).json({
        messege: "success",
        user_id: result.id,
        username: result.username,
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
    const error = err as DatabaseError;
    res.status(500).json({
      messege: "db error",
      error: error,
    });
  }
};

export const refreshTokenAttemp = async (req: Request, res: Response) => {
  const { username, refresh_token } = req.body;
  const { rows } = await DBclient.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  const result = rows[0];
  if (!result) {
    res.status(404).json({
      messege: "user not found",
    });
    return;
  }

  const isRefreshMatch = result.refresh_token === refresh_token;
  if (isRefreshMatch) {
    const accessToken = jwt.sign(
      { username: result.username },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
        algorithm: "HS256",
      }
    );
    const refreshToken = jwt.sign(
      { username: result.username },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "1h",
        algorithm: "HS256",
      }
    );
    try {
      await DBclient.query(
        "UPDATE users SET refresh_token = $1 WHERE id = $2",
        [refreshToken, result.id]
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
