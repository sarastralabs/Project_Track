export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth-guard";
import { connectDb } from "@/lib/db";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";
import { taskService } from "@/modules/tasks/task.service";

type RouteContext = { params: Promise<{ id: string }> };

export const PATCH = withApi<RouteContext>(async (request, ctx) => {
  await connectDb();
  const user = await requireAuth(request);
  const { id } = await ctx.params;
  const body = await request.json();
  return ok(await taskService.updateStatus(user, id, body));
});
