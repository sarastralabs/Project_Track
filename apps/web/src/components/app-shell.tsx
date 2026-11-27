"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" },
  { href: "/team", label: "Team" },
];

export function AppShell({
  children,
  userName,
}: {
  children: ReactNode;
  userName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Sarastra Hub</div>
        <ul className="nav-list">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={pathname.startsWith(item.href) ? "active" : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="btn-primary" type="button" onClick={signOut} style={{ marginTop: "auto" }}>
          Sign out
        </button>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <input className="search" placeholder="Search projects, tasks…" aria-label="Search" />
          <div className="user-chip">{userName ?? "Team member"}</div>
        </header>
        {children}
      </div>
    </div>
  );
}
