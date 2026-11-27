import { Action, TaskStatus, UserRole, can } from "@sarastra/shared";
import { z } from "zod";

import type { CurrentUser } from "@/lib/auth-guard";
import { AppError } from "@/lib/errors";
import { projectRepository } from "@/modules/projects/project.repository";

import { taskRepository } from "./task.repository";

const createTaskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const taskService = {
  async listForProject(user: CurrentUser, projectId: string) {
    if (user.role === UserRole.CLIENT) {
      throw new AppError("FORBIDDEN", "Tasks are internal and not visible to clients");
    }
    if (!can(user.role, Action.TASK_READ)) {
      throw new AppError("FORBIDDEN", "Cannot read tasks");
    }
    const project = await projectRepository.findById(projectId);
    if (!project) throw new AppError("NOT_FOUND", "Project not found");
    return taskRepository.list({ projectId });
  },

  async myTasks(user: CurrentUser) {
    if (user.role === UserRole.CLIENT) {
      throw new AppError("FORBIDDEN", "Tasks are internal and not visible to clients");
    }
    if (!can(user.role, Action.TASK_READ)) {
      throw new AppError("FORBIDDEN", "Cannot read tasks");
    }
    return taskRepository.list({ assigneeId: user.id });
  },

  async create(user: CurrentUser, body: unknown) {
    if (!can(user.role, Action.TASK_WRITE)) {
      throw new AppError("FORBIDDEN", "Cannot create tasks");
    }
    const input = createTaskSchema.parse(body);
    const project = await projectRepository.findById(input.projectId);
    if (!project) throw new AppError("NOT_FOUND", "Project not found");
    return taskRepository.create({
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      status: TaskStatus.TODO,
    });
  },

  async updateStatus(user: CurrentUser, id: string, body: unknown) {
    if (!can(user.role, Action.TASK_WRITE)) {
      throw new AppError("FORBIDDEN", "Cannot update tasks");
    }
    const { status } = z
      .object({
        status: z.enum([
          TaskStatus.TODO,
          TaskStatus.IN_PROGRESS,
          TaskStatus.BLOCKED,
          TaskStatus.DONE,
          TaskStatus.CANCELLED,
        ]),
      })
      .parse(body);
    const updated = await taskRepository.update(id, { status });
    if (!updated) throw new AppError("NOT_FOUND", "Task not found");
    return updated;
  },
};
