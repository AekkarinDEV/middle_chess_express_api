import mysql2 from "mysql2";
import { Client } from "pg";

export const DBclient = new Client({
  host: "localhost",
  port: 5432,
  password: "12345678",
  user: "postgres",
  database: "middle_chess_storage",
});

DBclient.connect();
