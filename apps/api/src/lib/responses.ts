import { NextResponse } from "next/server";

import { AppError, type ErrorCode } from "./errors";

export type SuccessBody<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type ErrorBody = {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
};

export function ok<T>(data: T, init?: { status?: number; meta?: Record<string, unknown> }) {
  const body: SuccessBody<T> = { data };
  if (init?.meta) {
    body.meta = init.meta;
  }
  return NextResponse.json(body, { status: init?.status ?? 200 });
}

export function fail(error: AppError | Error, requestId?: string) {
  if (error instanceof AppError) {
    const body: ErrorBody = {
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    };
    return NextResponse.json(body, {
      status: error.status,
      headers: requestId ? { "x-request-id": requestId } : undefined,
    });
  }

  const body: ErrorBody = {
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
  };
  return NextResponse.json(body, {
    status: 500,
    headers: requestId ? { "x-request-id": requestId } : undefined,
  });
}
