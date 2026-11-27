import { Lead } from "@sarastra/db";
import { Action, UserRole, can } from "@sarastra/shared";
import { z } from "zod";

import type { CurrentUser } from "@/lib/auth-guard";
import { AppError } from "@/lib/errors";

const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  message: z.string().min(1),
  source: z.string().optional(),
});

export const leadService = {
  async createPublic(body: unknown) {
    const input = createLeadSchema.parse(body);
    return Lead.create({ ...input, status: "NEW" });
  },

  async list(user: CurrentUser) {
    if (!can(user.role, Action.CLIENT_READ) || user.role === UserRole.CLIENT) {
      throw new AppError("FORBIDDEN", "Cannot list leads");
    }
    return Lead.find().sort({ createdAt: -1 }).limit(100).lean();
  },
};
