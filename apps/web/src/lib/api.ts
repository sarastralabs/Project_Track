import { headers } from "next/headers";

function appOrigin() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
}

type ApiSuccess<T> = { data: T; meta?: Record<string, unknown> };
type ApiFailure = { error: { code: string; message: string } };

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** Authenticated server fetch to our API (via same-origin rewrite). */
export async function apiGet<T>(path: string): Promise<T> {
  const headerStore = await headers();
  const cookie = headerStore.get("cookie") ?? "";

  const response = await fetch(`${appOrigin()}${path}`, {
    headers: { cookie, accept: "application/json" },
    cache: "no-store",
  });

  const body = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (!response.ok || !("data" in body)) {
    const failure = body as ApiFailure;
    throw new ApiRequestError(
      response.status,
      failure.error?.code ?? "INTERNAL_ERROR",
      failure.error?.message ?? "Request failed",
    );
  }

  return body.data;
}
