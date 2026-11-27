/**
 * Runs once when the Next.js server starts.
 * Forces env validation early so we fail fast on bad/missing config.
 */
export async function register(): Promise<void> {
  await import("./lib/env");
}
