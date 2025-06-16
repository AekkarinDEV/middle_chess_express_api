import axios, { AxiosError } from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { console } from "inspector";

dotenv.config();

export const googleUserAuth = async (req: Request, res: Response) => {
  console.log(req.body);
  const code = req.body.code;
  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        grant_type: "authorization_code",
        code,
        client_id: process.env.GCP_CLIENT_ID,
        client_secret: process.env.GCP_CLIENT_SECRET,
        redirect_uri: `${process.env.WEB_DOMAIN}/integrations/google/oauth2/callback`,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;
    const expires_in = response.data.expires_in;
    console.log("access :", access_token);
    console.log("refresh :", refresh_token);
    console.log("expires :", expires_in);
    console.log("Bearer " + access_token);
    const resAccount = await axios.get(
      `https://openidconnect.googleapis.com/v1/userinfo`,
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    const { email } = resAccount.data;
    console.log(email);
    res.status(200).json("google auth success");
  } catch (error) {
    const err = error as AxiosError;
    console.log(error);
    res.status(401).json({
      messege: err.response?.data,
    });
  }
};
