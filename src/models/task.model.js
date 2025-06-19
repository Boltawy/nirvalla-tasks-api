import mongoose, { model, Schema } from "mongoose";

const taskSchema = new Schema({
    title: { type: String, required: true, maxLength: 40 },
    description: { type: String, maxLength: 200 },
    isCompleted: { type: Boolean, default: false },
    taskList: { type: ObjectId, ref: 'TaskList', required: true },
    user: { type: ObjectId, ref: 'User', required: true },
    // status: { type: String, default: "pending", enum: ["not-started", "pending", "in-progress", "completed"] },
    // priority: { type: String, default: "low", enum: ["none", "low", "medium", "high", "urgent"] },
    // sortOrder: { type: Number, default: 0 },



}, { timestamps: true })

const Task = mongoose.models.Task || model("Task", taskSchema)
export default Task 