import { NextResponse, type NextRequest } from "next/server";

const APP_PREFIXES = ["/dashboard", "/projects", "/tasks", "/team"];

function isAppPath(pathname: string) {
  return APP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

async function hasSession(request: NextRequest): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  if (!cookie) {
    return false;
  }

  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (!response.ok) {
      return false;
    }
    const payload = (await response.json()) as { user?: { id?: string } } | null;
    return Boolean(payload?.user?.id);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const onApp = isAppPath(pathname);
  const onLogin = pathname === "/login" || pathname.startsWith("/login/");

  if (!onApp && !onLogin) {
    return NextResponse.next();
  }

  const signedIn = await hasSession(request);

  if (onApp && !signedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (onLogin && signedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/projects/:path*", "/tasks/:path*", "/team/:path*"],
};
