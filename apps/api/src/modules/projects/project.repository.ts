import { Project } from "@sarastra/db";
import type { FilterQuery } from "mongoose";

export type ProjectCreateInput = {
  title: string;
  description?: string | null;
  type: string;
  status: string;
  clientId: string;
  ownerId: string;
  memberIds?: string[];
  tags?: string[];
  collegeInfo?: {
    collegeName?: string | null;
    course?: string | null;
    studentNames?: string[];
  } | null;
  progressPercent?: number;
  milestones?: Array<{
    title: string;
    status?: string;
    order?: number;
  }>;
  templateId?: string | null;
};

export const projectRepository = {
  async create(input: ProjectCreateInput) {
    return Project.create(input);
  },

  async findById(id: string) {
    return Project.findOne({ _id: id, deactivatedAt: null }).lean();
  },

  async list(filter: FilterQuery<Record<string, unknown>> = {}, limit = 50) {
    return Project.find({ deactivatedAt: null, ...filter })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
  },

  async update(id: string, patch: Record<string, unknown>) {
    return Project.findOneAndUpdate({ _id: id, deactivatedAt: null }, { $set: patch }, { new: true }).lean();
  },
};
