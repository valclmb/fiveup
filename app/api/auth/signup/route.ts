import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePassword } from '@/lib/auth/password'
import { sendVerificationEmail } from '@/lib/email/resend'
import { getSignupRateLimit, getClientIP, checkRateLimit } from '@/lib/rate-limit'
import { signupSchema } from '@/lib/auth/schemas'
import { Prisma } from '@prisma/client'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting : 3 inscriptions par heure par IP (désactivé en développement)
    const ip = getClientIP(req)
    const signupRateLimit = await getSignupRateLimit()
    const rateLimitResult = await checkRateLimit(signupRateLimit, ip)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Trop de tentatives. Veuillez réessayer plus tard.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      )
    }

    const body = await req.json()

    // 1. Validation avec Zod (email format, champs requis)
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    const { email, password, name } = validationResult.data

    // 2. Validation de la force du mot de passe
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(', ') },
        { status: 400 }
      )
    }

    // 3. Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // 4. Créer l'utilisateur (emailVerified = null car pas encore confirmé)
    // On utilise create directement - si l'email existe déjà, Prisma retournera une erreur P2002
    let user
    try {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          emailVerified: null, // ← Important : pas encore vérifié
        },
      })
    } catch (error) {
      // Gérer l'erreur P2002 (unique constraint violation - email déjà existant)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Protection contre l'énumération : même message d'erreur générique
        return NextResponse.json(
          { error: 'Une erreur est survenue lors de la création du compte' },
          { status: 400 }
        )
      }
      // Réenvoyer les autres erreurs
      throw error
    }

    // 5. Générer un token de vérification
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // 6. Envoyer l'email de vérification
    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        token,
      })
    } catch (emailError) {
      // On log l'erreur mais on ne bloque pas la création du compte
      // L'utilisateur pourra demander un nouvel email plus tard
      console.error('❌ Erreur envoi email de vérification:', emailError)
      // En production, vous pourriez vouloir utiliser un service de logging
      // comme Sentry ou logger dans une base de données
    }

    return NextResponse.json({
      success: true,
      message: 'Compte créé. Vérifiez votre email pour activer votre compte.',
    })
  } catch (error) {
    console.error('❌ Erreur signup:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}