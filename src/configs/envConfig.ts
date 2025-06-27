import dotenv from "dotenv";

dotenv.config();

const appEnv = {
  port: process.env.PORT || 4000,
};

export default appEnv;
