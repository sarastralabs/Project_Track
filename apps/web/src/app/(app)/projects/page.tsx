import { apiGet } from "@/lib/api";

type ProjectRow = {
  _id: string;
  title: string;
  type: string;
  status: string;
  progressPercent?: number;
  tags?: string[];
  description?: string | null;
};

export default async function ProjectsPage() {
  let projects: ProjectRow[] = [];
  let loadError: string | null = null;

  try {
    projects = await apiGet<ProjectRow[]>("/api/v1/projects");
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load projects";
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h1>Projects</h1>
      </div>

      {loadError ? <p className="form-error">{loadError}</p> : null}

      {projects.length === 0 && !loadError ? (
        <p className="muted">No projects found.</p>
      ) : (
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project._id}>
              <div>
                <strong>{project.title}</strong>
                <span className="meta">
                  {project.type} · {project.status}
                  {project.tags?.length ? ` · ${project.tags.join(", ")}` : ""}
                </span>
                {project.description ? <span className="meta">{project.description}</span> : null}
              </div>
              <span className="pill">{project.progressPercent ?? 0}%</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
