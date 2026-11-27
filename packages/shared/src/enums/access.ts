import { UserRole, type UserRole as UserRoleType } from "./roles";

/** Actions the API can authorize centrally. */
export const Action = {
  USER_READ: "user:read",
  USER_INVITE: "user:invite",
  USER_UPDATE: "user:update",
  USER_DEACTIVATE: "user:deactivate",
  CLIENT_READ: "client:read",
  CLIENT_WRITE: "client:write",
  PROJECT_READ: "project:read",
  PROJECT_WRITE: "project:write",
  TASK_READ: "task:read",
  TASK_WRITE: "task:write",
  UPDATE_READ: "update:read",
  UPDATE_WRITE: "update:write",
  COMMENT_READ: "comment:read",
  COMMENT_WRITE: "comment:write",
  FILE_READ: "file:read",
  FILE_WRITE: "file:write",
  NOTIFICATION_READ: "notification:read",
  AUDIT_READ: "audit:read",
  DASHBOARD_READ: "dashboard:read",
  LEAD_WRITE: "lead:write",
  TEMPLATE_WRITE: "template:write",
} as const;

export type ActionName = (typeof Action)[keyof typeof Action];

const ALL_INTERNAL: ActionName[] = Object.values(Action).filter((a) => a !== Action.LEAD_WRITE);

const ROLE_ACTIONS: Record<UserRoleType, readonly ActionName[]> = {
  [UserRole.OWNER]: ALL_INTERNAL,
  [UserRole.ADMIN]: ALL_INTERNAL,
  [UserRole.TEAM]: [
    Action.USER_READ,
    Action.CLIENT_READ,
    Action.PROJECT_READ,
    Action.PROJECT_WRITE,
    Action.TASK_READ,
    Action.TASK_WRITE,
    Action.UPDATE_READ,
    Action.UPDATE_WRITE,
    Action.COMMENT_READ,
    Action.COMMENT_WRITE,
    Action.FILE_READ,
    Action.FILE_WRITE,
    Action.NOTIFICATION_READ,
    Action.DASHBOARD_READ,
  ],
  [UserRole.CLIENT]: [
    Action.PROJECT_READ,
    Action.UPDATE_READ,
    Action.COMMENT_READ,
    Action.COMMENT_WRITE,
    Action.FILE_READ,
    Action.NOTIFICATION_READ,
  ],
};

export function can(role: UserRoleType, action: ActionName): boolean {
  return ROLE_ACTIONS[role]?.includes(action) ?? false;
}

/** Clients only see rows marked client-visible. */
export function clientVisibilityFilter(role: UserRoleType): { clientVisible?: true } | Record<string, never> {
  if (role === UserRole.CLIENT) {
    return { clientVisible: true };
  }
  return {};
}
