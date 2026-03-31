import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Determine correct public base URL (Vercel uses x-forwarded-host)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = isLocalEnv
    ? origin
    : forwardedHost
    ? `https://${forwardedHost}`
    : origin;

  if (code) {
    // Collect cookies set by Supabase during exchange
    const collectedCookies: { name: string; value: string; options: any }[] = [];

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
            // Collect, don't write yet — we'll attach to the final response
            collectedCookies.push(...cookiesToSet);
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const dashboardUrl = `${baseUrl}/dashboard`;

      // KEY FIX: Return an HTML 200 page instead of a 302 redirect.
      // This guarantees the browser fully processes Set-Cookie headers
      // BEFORE JavaScript navigates to the dashboard.
      // With a 302 redirect, on some mobile browsers cookies may not be
      // sent on the immediately-following redirect request.
      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Memproses login...</title>
  </head>
  <body>
    <script>
      window.location.replace("${dashboardUrl}");
    </script>
    <noscript>
      <meta http-equiv="refresh" content="0;url=${dashboardUrl}">
      <p>Redirecting...</p>
    </noscript>
  </body>
</html>`;

      const response = new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });

      // Attach session cookies to this HTML response
      collectedCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });

      return response;
    }
  }

  return NextResponse.redirect(new URL("/login?error=true", baseUrl));
}

