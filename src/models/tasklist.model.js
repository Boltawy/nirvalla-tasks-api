import mongoose, { model, Schema } from "mongoose";

const taskListSchema = new Schema({
    title: { type: String, maxLength: 40, required: true },
    description: { type: String, maxLength: 200 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

const TaskList = mongoose.models.TaskList || model("TaskList", taskListSchema)
export default TaskList 