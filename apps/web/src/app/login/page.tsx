import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="login-shell">
      <section className="login-hero" aria-label="Sarastra Hub">
        <p className="brand-mark">Sarastra Hub</p>
        <h1>Track every project from lead to launch.</h1>
        <p className="hero-copy">
          Owners, team, and clients share one calm workspace — with the right visibility for each.
        </p>
      </section>

      <section className="login-panel" aria-label="Sign in">
        <LoginForm />
      </section>
    </main>
  );
}
