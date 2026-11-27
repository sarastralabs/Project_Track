export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth-guard";
import { connectDb } from "@/lib/db";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";
import { projectService } from "@/modules/projects/project.service";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApi<RouteContext>(async (request, ctx) => {
  await connectDb();
  const user = await requireAuth(request);
  const { id } = await ctx.params;
  return ok(await projectService.get(user, id));
});

export const PATCH = withApi<RouteContext>(async (request, ctx) => {
  await connectDb();
  const user = await requireAuth(request);
  const { id } = await ctx.params;
  const body = await request.json();
  return ok(await projectService.updateStatus(user, id, body));
});
