import { UserRole } from "@sarastra/shared";
import { Schema, type InferSchemaType, type Model } from "mongoose";
import { getModel } from "./get-model";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String, default: null },
    role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.TEAM, index: true },
    deactivatedAt: { type: Date, default: null, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", default: null, index: true },
  },
  { timestamps: true, collection: "user" },
);
userSchema.index({ role: 1, deactivatedAt: 1 });
export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Schema.Types.ObjectId };
export const User: Model<UserDocument> = getModel<UserDocument>("User", userSchema);
