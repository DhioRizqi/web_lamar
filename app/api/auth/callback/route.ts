import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    // Determine the correct base URL.
    // On Vercel, request.url may contain an internal hostname; use
    // the x-forwarded-host header to get the real public hostname.
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    const baseUrl = isLocalEnv
      ? origin
      : forwardedHost
      ? `https://${forwardedHost}`
      : origin;

    const redirectUrl = new URL(next, baseUrl);
    const redirectResponse = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieOptions: {
          maxAge: 7 * 24 * 60 * 60,
        },
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirectResponse;
    }
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const errorBase =
    process.env.NODE_ENV === "development"
      ? origin
      : forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  return NextResponse.redirect(new URL("/login?error=true", errorBase));
}

