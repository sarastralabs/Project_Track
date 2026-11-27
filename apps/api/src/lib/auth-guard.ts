import "server-only";

import { Action, can, UserRole, type UserRole as Role } from "@sarastra/shared";

import { auth } from "./auth";
import { AppError } from "./errors";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  clientId: string | null;
  deactivatedAt: string | null;
};

type ActionType = (typeof Action)[keyof typeof Action];

function asRole(value: unknown): Role {
  if (typeof value === "string" && Object.values(UserRole).includes(value as Role)) {
    return value as Role;
  }
  return UserRole.TEAM;
}

export async function getCurrentUser(request: Request): Promise<CurrentUser | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return null;
  }

  const user = session.user as {
    id: string;
    name: string;
    email: string;
    role?: unknown;
    clientId?: string | null;
    deactivatedAt?: string | null;
  };

  if (user.deactivatedAt) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: asRole(user.role),
    clientId: user.clientId ?? null,
    deactivatedAt: user.deactivatedAt ?? null,
  };
}

export async function requireAuth(request: Request): Promise<CurrentUser> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new AppError("UNAUTHORIZED", "Authentication required");
  }
  return user;
}

export async function requireRole(request: Request, roles: Role[]): Promise<CurrentUser> {
  const user = await requireAuth(request);
  if (!roles.includes(user.role)) {
    throw new AppError("FORBIDDEN", "Insufficient role");
  }
  return user;
}

export async function requirePermission(request: Request, action: ActionType): Promise<CurrentUser> {
  const user = await requireAuth(request);
  if (!can(user.role, action)) {
    throw new AppError("FORBIDDEN", `Missing permission: ${action}`);
  }
  return user;
}

export { Action };