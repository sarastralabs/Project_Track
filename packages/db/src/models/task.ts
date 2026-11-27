import { TaskStatus } from "@sarastra/shared";
import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";
export type TaskDocument = {
  _id: Types.ObjectId; projectId: Types.ObjectId; title: string; description?: string | null; status: string;
  assigneeId?: Types.ObjectId | null; dueDate?: Date | null; deactivatedAt?: Date | null; createdAt: Date; updatedAt: Date;
};
const taskSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  title: { type: String, required: true, trim: true }, description: { type: String, default: null },
  status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.TODO, index: true },
  assigneeId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
  dueDate: { type: Date, default: null }, deactivatedAt: { type: Date, default: null },
}, { timestamps: true, collection: "tasks" });
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1, status: 1 });
export const Task: Model<TaskDocument> = getModel<TaskDocument>("Task", taskSchema);
