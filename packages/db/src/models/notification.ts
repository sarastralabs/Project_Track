import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";
export type NotificationDocument = {
  _id: Types.ObjectId; userId: Types.ObjectId; title: string; body: string; type: string; href?: string | null;
  readAt?: Date | null; meta?: unknown; createdAt: Date; updatedAt: Date;
};
const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true }, body: { type: String, required: true }, type: { type: String, required: true },
  href: { type: String, default: null }, readAt: { type: Date, default: null, index: true }, meta: { type: Schema.Types.Mixed, default: null },
}, { timestamps: true, collection: "notifications" });
notificationSchema.index({ userId: 1, createdAt: -1 });
export const Notification: Model<NotificationDocument> = getModel<NotificationDocument>("Notification", notificationSchema);
