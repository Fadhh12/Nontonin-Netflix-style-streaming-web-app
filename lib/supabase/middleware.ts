import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require a logged-in user (SRS G01). /browse, /title, /search
// stay public for guests (SRS F08).
const PROTECTED_PATHS = ["/profiles", "/my-list"];

/** Only accept relative paths for returnTo, to prevent open redirects (SRS 2.3). */
function isSafeReturnTo(path: string | null): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//");
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fail open to guest browsing while Supabase isn't configured yet, instead
  // of crashing every route. Guest-facing pages (SRS F08) must keep working;
  // protected pages just redirect to /login until real credentials land.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[middleware] Supabase env vars are not set — skipping session refresh, treating every request as a guest.",
      );
    }
    return handleProtectedRedirect(request, response, null);
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return handleProtectedRedirect(request, response, user ? {} : null);
}

/** Redirects guests away from protected paths with a safe returnTo (SRS G01, FR-A4). */
function handleProtectedRedirect(
  request: NextRequest,
  response: NextResponse,
  user: object | null,
) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    const returnTo = pathname + request.nextUrl.search;
    if (isSafeReturnTo(returnTo)) {
      loginUrl.searchParams.set("returnTo", returnTo);
    }
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
