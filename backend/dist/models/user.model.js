import { model, Schema } from "mongoose";
const userSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, require: true },
    profileImage: { type: String, default: "/default/default.png" }
}, { timestamps: true });
const User = model('User', userSchema);
export default User;
