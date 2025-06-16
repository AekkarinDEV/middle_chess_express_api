import dotenv from "dotenv";
import { Client } from "pg";
dotenv.config();

export const DBclient = new Client({
  host: process.env.DB_host,
  port: parseInt(process.env.DB_port as string),
  password: process.env.DB_password,
  user: process.env.DB_user,
  database: process.env.DB_database,
  ssl: { rejectUnauthorized: false },
});

DBclient.connect();
