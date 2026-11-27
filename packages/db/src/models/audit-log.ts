import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";
export type AuditLogDocument = {
  _id: Types.ObjectId; actorId?: Types.ObjectId | null; action: string; resourceType: string; resourceId?: string | null;
  meta?: unknown; ip?: string | null; createdAt: Date;
};
const auditLogSchema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
  action: { type: String, required: true, index: true }, resourceType: { type: String, required: true },
  resourceId: { type: String, default: null }, meta: { type: Schema.Types.Mixed, default: null }, ip: { type: String, default: null },
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "auditLogs" });
export const AuditLog: Model<AuditLogDocument> = getModel<AuditLogDocument>("AuditLog", auditLogSchema);
