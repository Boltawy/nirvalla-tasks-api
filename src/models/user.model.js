import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    userName: { type: String, required: true, minLength: 3, maxLength: 25, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, minLength: 8 },
    photo: { type: String },
    // phone: { type: String, minLength: 8, maxLength: 20},
}, { timestamps: true })

const userModel = mongoose.models.User || model("User", userSchema)
export default userModel