export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth-guard";
import { connectDb } from "@/lib/db";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";
import { leadService } from "@/modules/leads/lead.service";

/** Public website form — auth not required. Rate limiting can be added later. */
export const POST = withApi(async (request) => {
  await connectDb();
  const body = await request.json();
  return ok(await leadService.createPublic(body), { status: 201 });
});

export const GET = withApi(async (request) => {
  await connectDb();
  const user = await requireAuth(request);
  return ok(await leadService.list(user));
});
