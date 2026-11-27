import { ZodError } from "zod";

import { AppError } from "./errors";
import { logger } from "./logger";
import { getRequestId } from "./request-id";
import { fail } from "./responses";

type ApiHandler<TContext> = (
  request: Request,
  context: { requestId: string } & TContext,
) => Promise<Response>;

/** Wraps route handlers with request IDs, Zod/AppError mapping, and logging. */
export function withApi<TContext extends object = object>(handler: ApiHandler<TContext>) {
  return async (request: Request, routeContext: TContext): Promise<Response> => {
    const requestId = getRequestId(request);
    const started = Date.now();
    const context = { requestId, ...routeContext };

    try {
      const response = await handler(request, context);
      response.headers.set("x-request-id", requestId);
      logger.info("request.completed", {
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        status: response.status,
        ms: Date.now() - started,
      });
      return response;
    } catch (error) {
      if (error instanceof ZodError) {
        const appError = new AppError("VALIDATION_ERROR", "Validation failed", error.flatten());
        logger.warn("request.validation_failed", { requestId, details: error.flatten() });
        const response = fail(appError, requestId);
        response.headers.set("x-request-id", requestId);
        return response;
      }

      if (error instanceof AppError) {
        logger.warn("request.app_error", {
          requestId,
          code: error.code,
          message: error.message,
        });
        const response = fail(error, requestId);
        response.headers.set("x-request-id", requestId);
        return response;
      }

      logger.error("request.unhandled_error", {
        requestId,
        err: error instanceof Error ? error.message : String(error),
      });
      const response = fail(error instanceof Error ? error : new Error(String(error)), requestId);
      response.headers.set("x-request-id", requestId);
      return response;
    }
  };
}