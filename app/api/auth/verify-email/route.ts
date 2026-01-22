import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getVerifyEmailRateLimit, getClientIP, checkRateLimit } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  // Rate limiting : 5 tentatives par heure par IP (désactivé en développement)
  const ip = getClientIP(req)
  const verifyEmailRateLimit = await getVerifyEmailRateLimit()
  const rateLimitResult = await checkRateLimit(verifyEmailRateLimit, ip)
  
  if (!rateLimitResult.success) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/error?error=RateLimitExceeded`
    )
  }

  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  // 1. Vérifier que le token est présent
  if (!token) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/error?error=MissingToken`
    )
  }

  try {
    // 2. Chercher le token dans la BDD (optimisé : une seule query)
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: { token },
    })

    if (!tokenRecord) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/error?error=InvalidToken`
      )
    }

    // 3. Vérifier l'expiration
    if (tokenRecord.expires < new Date()) {
      // Supprimer le token expiré
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: tokenRecord.identifier,
            token: tokenRecord.token,
          },
        },
      })
      
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/error?error=TokenExpired`
      )
    }

    // 4. Mettre à jour l'utilisateur : emailVerified = maintenant
    await prisma.user.update({
      where: { email: tokenRecord.identifier },
      data: { emailVerified: new Date() },
    })

    // 5. Supprimer le token (il ne peut être utilisé qu'une fois)
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: tokenRecord.identifier,
          token: tokenRecord.token,
        },
      },
    })

    // 6. Rediriger vers la page de succès
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/verified`
    )
  } catch (error) {
    console.error('❌ Erreur vérification:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/error?error=VerificationFailed`
    )
  }
}