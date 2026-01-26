import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextRequest } from "next/server"

// Helper pour rafraîchir le token si expiré
async function refreshAccessToken(account: {
  id: string
  refreshToken: string | null
}) {
  if (!account.refreshToken) {
    throw new Error("No refresh token available")
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: account.refreshToken,
      grant_type: "refresh_token",
    }),
  })

  const tokens = await response.json()

  if (!tokens.access_token) {
    throw new Error("Failed to refresh token")
  }

  // Mettre à jour le token en BDD
  await prisma.googleBusinessAccount.update({
    where: { id: account.id },
    data: {
      accessToken: tokens.access_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  })

  return tokens.access_token
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Récupérer le compte Google Business de l'utilisateur
  const account = await prisma.googleBusinessAccount.findUnique({
    where: { userId: session.user.id },
  })

  if (!account) {
    return Response.json(
      { error: "No Google Business account connected" },
      { status: 404 }
    )
  }

  if (!account.locationId) {
    return Response.json(
      { error: "No location configured" },
      { status: 400 }
    )
  }

  try {
    // Vérifier si le token est expiré et le rafraîchir si nécessaire
    let accessToken = account.accessToken
    if (new Date() >= account.expiresAt) {
      accessToken = await refreshAccessToken(account)
    }

    // Récupérer les avis
    const reviewsResponse = await fetch(
      `https://mybusinessaccountmanagement.googleapis.com/v1/${account.locationId}/reviews`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    const reviewsData = await reviewsResponse.json()

    if (reviewsData.error) {
      console.error("Google API error:", reviewsData.error)
      return Response.json(
        { error: reviewsData.error.message },
        { status: reviewsData.error.code || 500 }
      )
    }

    return Response.json({
      reviews: reviewsData.reviews || [],
      totalReviewCount: reviewsData.totalReviewCount || 0,
      averageRating: reviewsData.averageRating || 0,
      nextPageToken: reviewsData.nextPageToken,
    })
  } catch (err) {
    console.error("Error fetching reviews:", err)
    return Response.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}
