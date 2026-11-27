export const dynamic = "force-dynamic";

import { connectDb, isDbConnected } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { ok } from "@/lib/responses";
import { withApi } from "@/lib/with-api";

export const GET = withApi(async () => {
  await connectDb();

  if (!isDbConnected()) {
    throw new AppError("SERVICE_UNAVAILABLE", "Database is not connected");
  }

  return ok({
    status: "ok",
    service: "sarastra-hub-api",
    db: "connected",
    time: new Date().toISOString(),
  });
});
