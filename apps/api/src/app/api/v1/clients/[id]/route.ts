export const dynamic = "force-dynamic";

import { connectDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";
import { clientService } from "@/modules/clients/client.service";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApi<RouteContext>(async (request, ctx) => {
  await connectDb();
  const user = await requireAuth(request);
  const { id } = await ctx.params;
  const data = await clientService.get(user, id);
  return ok(data);
});

export const PATCH = withApi<RouteContext>(async (request, ctx) => {
  await connectDb();
  const user = await requireAuth(request);
  const { id } = await ctx.params;
  const body = await request.json();
  const data = await clientService.update(user, id, body);
  return ok(data);
});

export const DELETE = withApi<RouteContext>(async (request, ctx) => {
  await connectDb();
  const user = await requireAuth(request);
  const { id } = await ctx.params;
  const data = await clientService.remove(user, id);
  return ok(data);
});
