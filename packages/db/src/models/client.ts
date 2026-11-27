import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";

export type ClientContact = { name: string; email: string; phone?: string | null; isPrimary?: boolean };
export type ClientDocument = {
  _id: Types.ObjectId; name: string; company?: string | null; contacts: ClientContact[];
  notes?: string | null; deactivatedAt?: Date | null; createdAt: Date; updatedAt: Date;
};
const contactSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: null },
  isPrimary: { type: Boolean, default: false },
}, { _id: false });
const clientSchema = new Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, default: null, trim: true },
  contacts: { type: [contactSchema], default: [] },
  notes: { type: String, default: null },
  deactivatedAt: { type: Date, default: null, index: true },
}, { timestamps: true, collection: "clients" });
clientSchema.index({ name: 1 });
export const Client: Model<ClientDocument> = getModel<ClientDocument>("Client", clientSchema);
