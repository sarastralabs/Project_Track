export default function DashboardPage() {
  return (
    <div className="dash-grid">
      <section className="welcome">
        <h1>Good day</h1>
        <p>Owner overview — live stats will bind to `/api/v1/dashboard/stats` next.</p>
      </section>

      <section className="stat-row">
        <article className="stat-card">
          <span>Active projects</span>
          <strong>—</strong>
        </article>
        <article className="stat-card">
          <span>Open tasks</span>
          <strong>—</strong>
        </article>
        <article className="stat-card">
          <span>Clients</span>
          <strong>—</strong>
        </article>
        <article className="stat-card">
          <span>New leads</span>
          <strong>—</strong>
        </article>
      </section>

      <section className="panel">
        <h2 style={{ marginTop: 0, fontFamily: "var(--font-display)" }}>Projects</h2>
        <p style={{ color: "var(--ink-muted)", marginBottom: 0 }}>
          Soft Taskly-style shell is ready. Next: list projects from the API and fill these cards.
        </p>
      </section>
    </div>
  );
}
