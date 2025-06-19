import mongoose, { model, Schema } from "mongoose";

const taskSchema = new Schema({
    title: { type: String, required: true, maxLength: 40 },
    description: { type: String, maxLength: 200 },
    user: { type: ObjectId, ref: 'User', required: true },


}, { timestamps: true })

const Task = mongoose.models.Task || model("Task", taskSchema)
export default Task 