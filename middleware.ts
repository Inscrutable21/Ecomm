// middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ]
}