import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set(name, value, options)
        },
        remove(name, options) {
          response.cookies.set(name, "", options)
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // ✅ allow login page
  if (pathname === "/admin-login") {
    return response
  }

  // 🔒 protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin-login", request.url))
    }

    // ✅ optional: check admin in DB
    const { data: admin } = await supabase
      .from("admin_users")
      .select("role_id")
      .eq("email", session.user.email)
      .single()

    if (!admin) {
      return NextResponse.redirect(new URL("/admin-login", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}