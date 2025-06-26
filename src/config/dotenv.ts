import dotenv from "dotenv";

dotenv.config();

module.exports = {
  port: process.env.PORT || 4000,
  mongoURI: process.env.DB_MONGO,
};
