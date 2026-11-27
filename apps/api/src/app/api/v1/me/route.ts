export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth-guard";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";

export const GET = withApi(async (request) => {
  const user = await requireAuth(request);
  return ok(user);
});
