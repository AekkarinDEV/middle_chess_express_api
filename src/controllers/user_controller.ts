import { Request, Response } from "express";

export const getUserById = async (req: Request, res: Response) => {
  res.json("hellow world");
};
