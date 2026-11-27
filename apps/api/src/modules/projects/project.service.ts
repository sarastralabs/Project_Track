import { Action, ProjectStatus, ProjectType, UserRole, can } from "@sarastra/shared";
import { z } from "zod";

import type { CurrentUser } from "@/lib/auth-guard";
import { AppError } from "@/lib/errors";

import { projectRepository } from "./project.repository";

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  type: z.enum([
    ProjectType.WEBSITE,
    ProjectType.CUSTOM_SOFTWARE,
    ProjectType.MOBILE_APP,
    ProjectType.DIGITAL_MARKETING,
    ProjectType.AI_AGENT,
    ProjectType.COLLEGE,
    ProjectType.OTHER,
  ]),
  clientId: z.string().min(1),
  memberIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  collegeInfo: z
    .object({
      collegeName: z.string().nullable().optional(),
      course: z.string().nullable().optional(),
      studentNames: z.array(z.string()).optional(),
    })
    .nullable()
    .optional(),
});

function assertCanReadProject(user: CurrentUser, project: { clientId: unknown; memberIds?: unknown[] }) {
  if (user.role === UserRole.CLIENT) {
    if (!user.clientId || String(project.clientId) !== user.clientId) {
      throw new AppError("FORBIDDEN", "Clients can only view their own projects");
    }
    return;
  }
  if (!can(user.role, Action.PROJECT_READ)) {
    throw new AppError("FORBIDDEN", "Cannot read projects");
  }
}

export const projectService = {
  async list(user: CurrentUser) {
    if (user.role === UserRole.CLIENT) {
      if (!user.clientId) return [];
      return projectRepository.list({ clientId: user.clientId });
    }
    if (!can(user.role, Action.PROJECT_READ)) {
      throw new AppError("FORBIDDEN", "Cannot list projects");
    }
    return projectRepository.list();
  },

  async get(user: CurrentUser, id: string) {
    const project = await projectRepository.findById(id);
    if (!project) throw new AppError("NOT_FOUND", "Project not found");
    assertCanReadProject(user, project);

    if (user.role === UserRole.CLIENT) {
      const { budgetInternal: _b, internalNotes: _n, ...safe } = project as typeof project & {
        budgetInternal?: unknown;
        internalNotes?: unknown;
      };
      return safe;
    }
    return project;
  },

  async create(user: CurrentUser, body: unknown) {
    if (!can(user.role, Action.PROJECT_WRITE)) {
      throw new AppError("FORBIDDEN", "Cannot create projects");
    }
    const input = createProjectSchema.parse(body);
    return projectRepository.create({
      ...input,
      ownerId: user.id,
      status: ProjectStatus.LEAD,
      progressPercent: 0,
      milestones: [],
    });
  },

  async updateStatus(user: CurrentUser, id: string, body: unknown) {
    if (!can(user.role, Action.PROJECT_WRITE)) {
      throw new AppError("FORBIDDEN", "Cannot update projects");
    }
    const { status } = z
      .object({
        status: z.enum([
          ProjectStatus.LEAD,
          ProjectStatus.ACTIVE,
          ProjectStatus.ON_HOLD,
          ProjectStatus.COMPLETED,
          ProjectStatus.CANCELLED,
        ]),
      })
      .parse(body);
    const updated = await projectRepository.update(id, { status });
    if (!updated) throw new AppError("NOT_FOUND", "Project not found");
    return updated;
  },
};
