import { auth } from "@/auth"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export async function GET() {
  // Vérifier que l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/connections")
  }

  // Générer un state pour la protection CSRF
  const state = crypto.randomUUID()

  // Stocker le state dans un cookie
  const cookieStore = await cookies()
  cookieStore.set("google_business_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  })

  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri =
    process.env.GOOGLE_BUSINESS_REDIRECT_URI ||
    `${process.env.BETTER_AUTH_URL}/api/google-business/callback`

  if (!clientId) {
    return Response.json(
      { error: "Google Business not configured" },
      { status: 500 }
    )
  }

  // Construire l'URL d'autorisation Google
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set(
    "scope",
    "https://www.googleapis.com/auth/business.manage"
  )
  authUrl.searchParams.set("access_type", "offline") // Pour obtenir refresh_token
  authUrl.searchParams.set("prompt", "consent") // Force le consent pour avoir refresh_token
  authUrl.searchParams.set("state", state)

  redirect(authUrl.toString())
}
