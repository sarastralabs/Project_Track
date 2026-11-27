import { ProjectStatus, ProjectType } from "@sarastra/shared";
import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";

export type ProjectDocument = {
  _id: Types.ObjectId; title: string; description?: string | null; type: string; status: string;
  clientId: Types.ObjectId; ownerId: Types.ObjectId; memberIds: Types.ObjectId[];
  milestones: Array<{ _id?: Types.ObjectId; title: string; description?: string | null; status: string; dueDate?: Date | null; completedAt?: Date | null; order: number }>;
  collegeInfo?: { collegeName?: string | null; course?: string | null; studentNames?: string[] } | null;
  tags: string[]; progressPercent: number; budgetInternal?: number | null; internalNotes?: string | null;
  templateId?: Types.ObjectId | null; deactivatedAt?: Date | null; createdAt: Date; updatedAt: Date;
};
const milestoneSchema = new Schema({
  title: { type: String, required: true, trim: true }, description: { type: String, default: null },
  status: { type: String, enum: ["PENDING", "IN_PROGRESS", "DONE"], default: "PENDING" },
  dueDate: { type: Date, default: null }, completedAt: { type: Date, default: null }, order: { type: Number, default: 0 },
}, { _id: true });
const collegeInfoSchema = new Schema({
  collegeName: { type: String, default: null }, course: { type: String, default: null }, studentNames: { type: [String], default: [] },
}, { _id: false });
const projectSchema = new Schema({
  title: { type: String, required: true, trim: true }, description: { type: String, default: null },
  type: { type: String, enum: Object.values(ProjectType), required: true, index: true },
  status: { type: String, enum: Object.values(ProjectStatus), required: true, default: ProjectStatus.LEAD, index: true },
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true, index: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  memberIds: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
  milestones: { type: [milestoneSchema], default: [] }, collegeInfo: { type: collegeInfoSchema, default: null },
  tags: { type: [String], default: [], index: true }, progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  budgetInternal: { type: Number, default: null }, internalNotes: { type: String, default: null },
  templateId: { type: Schema.Types.ObjectId, ref: "ProjectTemplate", default: null }, deactivatedAt: { type: Date, default: null },
}, { timestamps: true, collection: "projects" });
projectSchema.index({ clientId: 1, status: 1 });
projectSchema.index({ memberIds: 1, status: 1 });
export const Project: Model<ProjectDocument> = getModel<ProjectDocument>("Project", projectSchema);
