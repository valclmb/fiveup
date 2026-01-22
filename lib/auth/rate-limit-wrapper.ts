/**
 * Wrapper pour ajouter le rate limiting aux routes NextAuth
 * Note: NextAuth v5 gère ses propres routes, donc le rate limiting
 * sur signin doit être géré différemment (via middleware ou wrapper API)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSigninRateLimit, getClientIP, checkRateLimit } from '@/lib/rate-limit'

/**
 * Middleware pour protéger les routes de connexion NextAuth
 * À utiliser dans middleware.ts ou comme wrapper
 */
export async function withSignInRateLimit(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Rate limiting : 5 tentatives par 15 minutes par IP (désactivé en développement)
  const ip = getClientIP(request)
  const signinRateLimit = await getSigninRateLimit()
  const rateLimitResult = await checkRateLimit(signinRateLimit, ip)
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        error: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.',
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

  return handler(request)
}
