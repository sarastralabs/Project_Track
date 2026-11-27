export const dynamic = "force-dynamic";

import { connectDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";
import { clientService } from "@/modules/clients/client.service";

export const GET = withApi(async (request) => {
  await connectDb();
  const user = await requireAuth(request);
  const data = await clientService.list(user);
  return ok(data);
});

export const POST = withApi(async (request) => {
  await connectDb();
  const user = await requireAuth(request);
  const body = await request.json();
  const data = await clientService.create(user, body);
  return ok(data, { status: 201 });
});
