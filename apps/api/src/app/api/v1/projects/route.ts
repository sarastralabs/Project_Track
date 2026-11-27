export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth-guard";
import { connectDb } from "@/lib/db";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";
import { projectService } from "@/modules/projects/project.service";

export const GET = withApi(async (request) => {
  await connectDb();
  const user = await requireAuth(request);
  return ok(await projectService.list(user));
});

export const POST = withApi(async (request) => {
  await connectDb();
  const user = await requireAuth(request);
  const body = await request.json();
  return ok(await projectService.create(user, body), { status: 201 });
});
