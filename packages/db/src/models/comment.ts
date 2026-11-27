import { Schema, type Model, type Types } from "mongoose";
import { getModel } from "./get-model";
export type CommentDocument = {
  _id: Types.ObjectId; projectId: Types.ObjectId; authorId: Types.ObjectId; body: string; clientVisible: boolean;
  parentId?: Types.ObjectId | null; deactivatedAt?: Date | null; createdAt: Date; updatedAt: Date;
};
const commentSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true }, body: { type: String, required: true },
  clientVisible: { type: Boolean, default: false, index: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, deactivatedAt: { type: Date, default: null },
}, { timestamps: true, collection: "comments" });
commentSchema.index({ projectId: 1, clientVisible: 1, createdAt: -1 });
export const Comment: Model<CommentDocument> = getModel<CommentDocument>("Comment", commentSchema);
