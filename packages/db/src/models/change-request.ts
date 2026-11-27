import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";
export type ChangeRequestDocument = {
  _id: Types.ObjectId; projectId: Types.ObjectId; requestedById: Types.ObjectId; title: string; description: string;
  status: string; decisionNote?: string | null; decidedById?: Types.ObjectId | null; decidedAt?: Date | null;
  createdAt: Date; updatedAt: Date;
};
const changeRequestSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  requestedById: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true }, description: { type: String, required: true },
  status: { type: String, enum: ["OPEN", "APPROVED", "REJECTED", "DONE"], default: "OPEN", index: true },
  decisionNote: { type: String, default: null }, decidedById: { type: Schema.Types.ObjectId, ref: "User", default: null },
  decidedAt: { type: Date, default: null },
}, { timestamps: true, collection: "changeRequests" });
export const ChangeRequest: Model<ChangeRequestDocument> = getModel<ChangeRequestDocument>("ChangeRequest", changeRequestSchema);
