import { auth } from "@/auth-edge"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Le middleware utilise seulement les cookies JWT, pas Prisma
  // Donc on peut utiliser auth() même dans Edge Runtime
  const session = await auth()
  
  // Si pas de session et qu'on essaie d'accéder au dashboard, rediriger vers signin
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
}