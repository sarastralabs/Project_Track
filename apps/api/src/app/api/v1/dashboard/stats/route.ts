export const dynamic = "force-dynamic";

import { Client, Lead, Project, Task } from "@sarastra/db";
import { Action, ProjectStatus, TaskStatus, can } from "@sarastra/shared";

import { requireAuth } from "@/lib/auth-guard";
import { connectDb } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";

export const GET = withApi(async (request) => {
  await connectDb();
  const user = await requireAuth(request);
  if (!can(user.role, Action.DASHBOARD_READ)) {
    throw new AppError("FORBIDDEN", "Cannot view dashboard");
  }

  const [projectsActive, projectsTotal, clientsTotal, tasksOpen, leadsNew] = await Promise.all([
    Project.countDocuments({ status: ProjectStatus.ACTIVE, deactivatedAt: null }),
    Project.countDocuments({ deactivatedAt: null }),
    Client.countDocuments({ deactivatedAt: null }),
    Task.countDocuments({
      status: { $in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED] },
      deactivatedAt: null,
    }),
    Lead.countDocuments({ status: "NEW" }),
  ]);

  return ok({
    projectsActive,
    projectsTotal,
    clientsTotal,
    tasksOpen,
    leadsNew,
  });
});
