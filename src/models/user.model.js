import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    userName: { type: String, required: true, minLength: 3, maxLength: 25, trim: true, unique: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    phone: { type: String, minLength: 8, maxLength: 20, unique: true },
}, { timestamps: true })

const User = mongoose.models.User || model("User", userSchema)
export default User