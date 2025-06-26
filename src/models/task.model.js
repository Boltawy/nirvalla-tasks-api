import mongoose, { model, Schema } from "mongoose";

const taskSchema = new Schema({
    title: { type: String, required: true, maxLength: 40 },
    description: { type: String, maxLength: 200 },
    taskListId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskList', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
    completedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    // deadlineDate: { type: Date, default: null },
    // scheduledDate: { type: Date, default: null },
    // status: { type: String, default: "not-started", enum: ["not-started", "queued", "in-progress", "completed"] },
    // priority: { type: String, default: "low", enum: ["none", "low", "medium", "high", "urgent"] },
    // project : { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
}, { timestamps: true })

const taskModel = mongoose.models.Task || model("Task", taskSchema)
export default taskModel

/* Notes:
    tasks should have tierlists/priorities, Maybe option to seperate tasks to tierlists via priority
*/