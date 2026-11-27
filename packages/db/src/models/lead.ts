import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";
export type LeadDocument = {
  _id: Types.ObjectId; name: string; email: string; phone?: string | null; company?: string | null; message: string;
  source: string; status: string; convertedClientId?: Types.ObjectId | null; convertedProjectId?: Types.ObjectId | null;
  createdAt: Date; updatedAt: Date;
};
const leadSchema = new Schema({
  name: { type: String, required: true, trim: true }, email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: null }, company: { type: String, default: null }, message: { type: String, required: true },
  source: { type: String, default: "website" },
  status: { type: String, enum: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"], default: "NEW", index: true },
  convertedClientId: { type: Schema.Types.ObjectId, ref: "Client", default: null },
  convertedProjectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
}, { timestamps: true, collection: "leads" });
leadSchema.index({ email: 1, createdAt: -1 });
export const Lead: Model<LeadDocument> = getModel<LeadDocument>("Lead", leadSchema);
