import { z } from "zod";

/**
 * Auth roles for Sarastra Hub.
 * College vs business work is a project tag/type — not a separate client role (ADR 0001).
 */
export const UserRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  TEAM: "TEAM",
  CLIENT: "CLIENT",
} as const;

export const userRoleSchema = z.enum([
  UserRole.OWNER,
  UserRole.ADMIN,
  UserRole.TEAM,
  UserRole.CLIENT,
]);

export type UserRole = z.infer<typeof userRoleSchema>;
