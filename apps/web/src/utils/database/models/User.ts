import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

type User = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const UserSchema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = model<User>("User", UserSchema);
export default User;
