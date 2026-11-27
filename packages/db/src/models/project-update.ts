import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";
export type ProjectUpdateDocument = {
  _id: Types.ObjectId; projectId: Types.ObjectId; authorId: Types.ObjectId; body: string; clientVisible: boolean;
  attachmentFileIds: Types.ObjectId[]; deactivatedAt?: Date | null; createdAt: Date; updatedAt: Date;
};
const projectUpdateSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true }, body: { type: String, required: true },
  clientVisible: { type: Boolean, default: false, index: true },
  attachmentFileIds: [{ type: Schema.Types.ObjectId, ref: "FileAsset" }], deactivatedAt: { type: Date, default: null },
}, { timestamps: true, collection: "updates" });
projectUpdateSchema.index({ projectId: 1, clientVisible: 1, createdAt: -1 });
export const ProjectUpdate: Model<ProjectUpdateDocument> = getModel<ProjectUpdateDocument>("ProjectUpdate", projectUpdateSchema);
