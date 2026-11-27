/**
 * Root page is intentionally minimal.
 * Real work lives under /api/v1/* route handlers — not a web UI.
 */
export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "40rem" }}>
      <h1>Sarastra Hub API</h1>
      <p>
        This Next.js app is <strong>API-only</strong>. Use route handlers under <code>/api/v1</code>
        . The owner dashboard and client portal will be a separate <code>apps/web</code> later.
      </p>
    </main>
  );
}
