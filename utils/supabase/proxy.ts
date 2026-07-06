import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Local env files are not uploaded to Vercel. Keep public routes available
  // when a deployment environment has not been configured yet.
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    // Verifies the access token and refreshes auth cookies when necessary.
    await supabase.auth.getClaims();
  } catch (error) {
    // A temporary auth-provider failure must not take down every application
    // route. Authentication checks still happen at protected data boundaries.
    console.error(
      "Supabase session refresh failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  return supabaseResponse;
}
