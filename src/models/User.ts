import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    unique: true,
    type: String,
    require: true,
  },
  username: {
    unique: true,
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  refresh_token: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);
