import { Task } from "@sarastra/db";
import type { FilterQuery } from "mongoose";

export type TaskCreateInput = {
  projectId: string;
  title: string;
  description?: string | null;
  assigneeId?: string | null;
  dueDate?: Date | null;
  status: string;
};

export const taskRepository = {
  async create(input: TaskCreateInput) {
    return Task.create(input);
  },

  async list(filter: FilterQuery<Record<string, unknown>>, limit = 100) {
    return Task.find({ deactivatedAt: null, ...filter }).sort({ updatedAt: -1 }).limit(limit).lean();
  },

  async update(id: string, patch: Record<string, unknown>) {
    return Task.findOneAndUpdate({ _id: id, deactivatedAt: null }, { $set: patch }, { new: true }).lean();
  },
};
