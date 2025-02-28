import mongoose from "mongoose";

type User = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  post: mongoose.Types.ObjectId[];
  profileImage: string;
}

export default User;