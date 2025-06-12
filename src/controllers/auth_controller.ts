import { Request, Response } from "express";
import { DBclient } from "../config/db_client";
import bcrypt from "bcryptjs";
import { GennerateUDI } from "../utils/unique_id";
import { DatabaseError } from "pg";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const id = GennerateUDI();
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await DBclient.query(
      "INSERT INTO users (id,username,password,email) VALUES ($1,$2,$3,$4)",
      [id, username, hashedPassword, email]
    );
    res.status(200).json({
      messege: "success",
    });
  } catch (err) {
    console.log(err);
    const error = err as DatabaseError;
    if (
      error.detail?.includes("exists") &&
      error.detail?.includes("username")
    ) {
      res.status(409).json({
        conflict: "username",
      });
    } else if (
      error.detail?.includes("exists") &&
      error.detail?.includes("email")
    ) {
      res.status(409).json({
        conflict: "email",
      });
    } else {
      res.status(400).json({
        error: err,
      });
    }
  }
};

export const loginAttemp = async (req: Request, res: Response) => {
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
      const token = jwt.sign(
        { username: result.username },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        messege: "success",
        token: token,
      });
      return;
    } else {
      res.status(400).json({
        messege: "wrong password",
      });
    }
    res.status(200).json({ messege: "found" });
  } catch (err) {
    console.log(err);
    const error = err as DatabaseError;
    res.status(500).json({
      messege: "db error",
      error: error,
    });
  }
};
