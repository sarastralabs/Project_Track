import Link from "next/link";

import { apiGet } from "@/lib/api";
import { getServerSession } from "@/lib/session";

type DashboardStats = {
  projectsActive: number;
  projectsTotal: number;
  clientsTotal: number;
  tasksOpen: number;
  leadsNew: number;
};

type ProjectRow = {
  _id: string;
  title: string;
  type: string;
  status: string;
  progressPercent?: number;
  tags?: string[];
};

export default async function DashboardPage() {
  const session = await getServerSession();
  const firstName = session?.user.name?.split(" ")[0] ?? "there";

  let stats: DashboardStats | null = null;
  let projects: ProjectRow[] = [];
  let loadError: string | null = null;

  try {
    const [statsData, projectsData] = await Promise.all([
      apiGet<DashboardStats>("/api/v1/dashboard/stats"),
      apiGet<ProjectRow[]>("/api/v1/projects"),
    ]);
    stats = statsData;
    projects = projectsData.slice(0, 8);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load dashboard";
  }

  return (
    <div className="dash-grid">
      <section className="welcome">
        <h1>Good day, {firstName}</h1>
        <p>Live overview from Sarastra Hub API.</p>
      </section>

      {loadError ? <p className="form-error">{loadError}</p> : null}

      <section className="stat-row">
        <article className="stat-card">
          <span>Active projects</span>
          <strong>{stats?.projectsActive ?? "—"}</strong>
        </article>
        <article className="stat-card">
          <span>Open tasks</span>
          <strong>{stats?.tasksOpen ?? "—"}</strong>
        </article>
        <article className="stat-card">
          <span>Clients</span>
          <strong>{stats?.clientsTotal ?? "—"}</strong>
        </article>
        <article className="stat-card">
          <span>New leads</span>
          <strong>{stats?.leadsNew ?? "—"}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Projects</h2>
          <Link href="/projects" className="panel-link">
            View all
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="muted">No projects yet. Create one from the API or seed data.</p>
        ) : (
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project._id}>
                <div>
                  <strong>{project.title}</strong>
                  <span className="meta">
                    {project.type} · {project.status}
                  </span>
                </div>
                <span className="pill">{project.progressPercent ?? 0}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
