import { headers } from "next/headers";

export type HubSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  session: {
    id: string;
    token?: string;
  };
};

function appOrigin() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
}

/** Server-side session via Better Auth (cookies forwarded through web → API rewrite). */
export async function getServerSession(): Promise<HubSession | null> {
  const headerStore = await headers();
  const cookie = headerStore.get("cookie") ?? "";
  if (!cookie) {
    return null;
  }

  const response = await fetch(`${appOrigin()}/api/auth/get-session`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as HubSession | null;
  if (!payload?.user?.id) {
    return null;
  }

  return payload;
}
