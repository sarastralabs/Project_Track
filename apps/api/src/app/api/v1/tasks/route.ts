export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth-guard";
import { connectDb } from "@/lib/db";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";
import { taskService } from "@/modules/tasks/task.service";

export const GET = withApi(async (request) => {
  await connectDb();
  const user = await requireAuth(request);
  const projectId = new URL(request.url).searchParams.get("projectId");
  if (projectId) {
    return ok(await taskService.listForProject(user, projectId));
  }
  return ok(await taskService.myTasks(user));
});

export const POST = withApi(async (request) => {
  await connectDb();
  const user = await requireAuth(request);
  const body = await request.json();
  return ok(await taskService.create(user, body), { status: 201 });
});
