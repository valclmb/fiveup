import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Vérifier que l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Gérer les erreurs Google
  if (error) {
    console.error("Google OAuth error:", error)
    redirect(`/connections?error=google:${error}`)
  }

  // Vérifier le state CSRF
  const cookieStore = await cookies()
  const savedState = cookieStore.get("google_business_oauth_state")?.value
  cookieStore.delete("google_business_oauth_state")

  if (!state || state !== savedState) {
    console.error("Invalid state:", { state, savedState })
    redirect("/connections?error=google:invalid_state")
  }

  if (!code) {
    redirect("/connections?error=google:no_code")
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri =
    process.env.GOOGLE_BUSINESS_REDIRECT_URI ||
    `${process.env.BETTER_AUTH_URL}/api/google-business/callback`

  if (!clientId || !clientSecret) {
    redirect("/connections?error=google:not_configured")
  }

  try {
    // Échanger le code contre un access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      console.error("No access token in response:", tokens)
      redirect("/connections?error=google:no_access_token")
    }

    // Récupérer les comptes Business de l'utilisateur
    console.log("Fetching Google Business accounts with token:", tokens.access_token.substring(0, 20) + "...")
    
    const accountsResponse = await fetch(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    )

    console.log("Accounts response status:", accountsResponse.status)
    const accountsData = await accountsResponse.json()
    console.log("Accounts data:", JSON.stringify(accountsData, null, 2))

    // Gérer les erreurs de l'API Google
    if (accountsData.error) {
      console.error("Google API error:", accountsData.error)
      if (accountsData.error.code === 429) {
        redirect("/connections?error=google:rate_limit")
      }
      if (accountsData.error.code === 403) {
        redirect("/connections?error=google:access_denied")
      }
      redirect(`/connections?error=google:api_error_${accountsData.error.code}`)
    }

    if (!accountsData.accounts || accountsData.accounts.length === 0) {
      console.error("No business accounts found:", accountsData)
      redirect("/connections?error=google:no_business_account")
    }

    const account = accountsData.accounts[0] // Premier compte

    // Récupérer les locations du compte
    let locationId: string | null = null
    let locationName: string | null = null

    try {
      const locationsResponse = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations`,
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      )

      const locationsData = await locationsResponse.json()

      if (locationsData.locations && locationsData.locations.length > 0) {
        const location = locationsData.locations[0] // Première location
        locationId = location.name
        locationName = location.title || location.storefrontAddress?.locality
      }
    } catch (locError) {
      console.error("Error fetching locations:", locError)
      // Continue sans location, on pourra la récupérer plus tard
    }

    // Stocker en BDD
    await prisma.googleBusinessAccount.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        accountId: account.name,
        accountName: account.accountName || account.name,
        locationId,
        locationName,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
      update: {
        accountId: account.name,
        accountName: account.accountName || account.name,
        locationId,
        locationName,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
    })

    redirect("/connections?success=google")
  } catch (err) {
    console.error("Google Business callback error:", err)
    redirect("/connections?error=google:callback_failed")
  }
}
