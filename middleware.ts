import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove: (name, options) => {
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // check session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/admin-login", request.url))
  }

  // check admin role
  const { data: admin } = await supabase
    .from("admin_users")
    .select("role")
    .eq("email", user.email)
    .single()

  if (!admin) {
    return NextResponse.redirect(new URL("/admin-login", request.url))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
