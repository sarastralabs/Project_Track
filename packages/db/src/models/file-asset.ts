import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";
export type FileAssetDocument = {
  _id: Types.ObjectId; projectId: Types.ObjectId; uploadedById: Types.ObjectId; fileName: string; contentType: string;
  sizeBytes: number; storageKey: string; version: number; clientVisible: boolean; deactivatedAt?: Date | null;
  createdAt: Date; updatedAt: Date;
};
const fileAssetSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  uploadedById: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true }, contentType: { type: String, required: true }, sizeBytes: { type: Number, required: true },
  storageKey: { type: String, required: true, unique: true }, version: { type: Number, default: 1 },
  clientVisible: { type: Boolean, default: false, index: true }, deactivatedAt: { type: Date, default: null },
}, { timestamps: true, collection: "files" });
export const FileAsset: Model<FileAssetDocument> = getModel<FileAssetDocument>("FileAsset", fileAssetSchema);
