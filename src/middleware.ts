import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/config";

/**
 * Route security model
 *
 * PUBLIC         — no auth needed, accessible by anyone
 * AUTH_REQUIRED  — must be signed in, redirect → /auth/login
 * MOD_REQUIRED   — must be signed in AND admin (email in ADMIN_EMAILS)
 *                  page-level check handles the admin gate; middleware
 *                  only enforces the signed-in part here.
 *
 * The feed (/unilag), post detail, search, leaderboard etc. all require
 * a signed-in account — CampusBoard is not public-read.
 */
const PUBLIC_PREFIXES = [
  "/",
  "/about",
  "/how-it-works",
  "/rules",
  "/privacy",
  "/terms",
  "/contact",
  "/faq",
  "/transparency",
  "/maintenance",
  "/auth",
  "/invite",
  // Next internals
  "/_next",
  "/api/auth",    // OAuth redirect handler
  "/favicon.ico",
  "/icon",
  "/apple-icon",
];

function isPublic(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (p) => p !== "/" && pathname.startsWith(p)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Maintenance mode kill switch
  if (process.env.MAINTENANCE === "1" && pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // Skip protection in demo mode (no Supabase configured)
  if (!isSupabaseConfigured) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session on every request
  const { data: { user } } = await supabase.auth.getUser();

  // If signed in and hitting login → redirect to feed
  if (user && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/unilag", request.url));
  }

  // If not signed in and hitting a protected route → redirect to login
  if (!user && !isPublic(pathname)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Mod routes — must be signed in (admin gate is at page level)
  // If not signed in hitting /mod → login
  if (!user && pathname.startsWith("/mod")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
"// v1.0"  
