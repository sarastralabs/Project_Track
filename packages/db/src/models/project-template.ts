import { ProjectType } from "@sarastra/shared";
import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";
export type ProjectTemplateDocument = {
  _id: Types.ObjectId; name: string; type: string; description?: string | null;
  defaultMilestones: Array<{ title: string; description?: string | null; order: number }>;
  deactivatedAt?: Date | null; createdAt: Date; updatedAt: Date;
};
const templateMilestoneSchema = new Schema({
  title: { type: String, required: true }, description: { type: String, default: null }, order: { type: Number, default: 0 },
}, { _id: false });
const projectTemplateSchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: Object.values(ProjectType), required: true, index: true },
  description: { type: String, default: null }, defaultMilestones: { type: [templateMilestoneSchema], default: [] },
  deactivatedAt: { type: Date, default: null },
}, { timestamps: true, collection: "projectTemplates" });
export const ProjectTemplate: Model<ProjectTemplateDocument> = getModel<ProjectTemplateDocument>("ProjectTemplate", projectTemplateSchema);
