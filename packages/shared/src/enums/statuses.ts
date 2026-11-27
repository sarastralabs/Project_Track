import { z } from "zod";

export const ProjectStatus = {
  LEAD: "LEAD",
  ACTIVE: "ACTIVE",
  ON_HOLD: "ON_HOLD",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const projectStatusSchema = z.enum([
  ProjectStatus.LEAD,
  ProjectStatus.ACTIVE,
  ProjectStatus.ON_HOLD,
  ProjectStatus.COMPLETED,
  ProjectStatus.CANCELLED,
]);

export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  BLOCKED: "BLOCKED",
  DONE: "DONE",
  CANCELLED: "CANCELLED",
} as const;

export const taskStatusSchema = z.enum([
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.DONE,
  TaskStatus.CANCELLED,
]);

export type TaskStatus = z.infer<typeof taskStatusSchema>;
