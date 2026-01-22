// Rate limiting désactivé en développement
// Les imports sont conditionnels pour éviter les erreurs si les packages ne sont pas installés
const isDevelopment = process.env.NODE_ENV === 'development'
const hasUpstash = !isDevelopment && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN

// Cache pour les instances de rate limiting (chargées de manière lazy)
let signupRateLimitInstance: any = null
let signinRateLimitInstance: any = null
let verifyEmailRateLimitInstance: any = null

// Fonction pour obtenir le rate limiter de signup (lazy loading)
export async function getSignupRateLimit() {
  if (isDevelopment || !hasUpstash) {
    return null
  }
  
  if (!signupRateLimitInstance) {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    
    signupRateLimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: '@upstash/ratelimit/signup',
    })
  }
  
  return signupRateLimitInstance
}

// Fonction pour obtenir le rate limiter de signin (lazy loading)
export async function getSigninRateLimit() {
  if (isDevelopment || !hasUpstash) {
    return null
  }
  
  if (!signinRateLimitInstance) {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    
    signinRateLimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: '@upstash/ratelimit/signin',
    })
  }
  
  return signinRateLimitInstance
}

// Fonction pour obtenir le rate limiter de vérification d'email (lazy loading)
export async function getVerifyEmailRateLimit() {
  if (isDevelopment || !hasUpstash) {
    return null
  }
  
  if (!verifyEmailRateLimitInstance) {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    
    verifyEmailRateLimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: true,
      prefix: '@upstash/ratelimit/verify-email',
    })
  }
  
  return verifyEmailRateLimitInstance
}

// Exports pour compatibilité (retournent null en développement)
export const signupRateLimit = null
export const signinRateLimit = null
export const verifyEmailRateLimit = null

/**
 * Extrait l'IP depuis une requête Next.js
 */
export function getClientIP(request: Request): string {
  // Vérifier les headers proxy (Vercel, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  // Fallback (devrait être géré par le serveur)
  return 'unknown'
}

/**
 * Vérifie le rate limit et retourne le résultat
 */
export async function checkRateLimit(
  limiter: any | null,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (!limiter || isDevelopment) {
    // En développement, on autorise tout
    // ⚠️ En production, Upstash doit être configuré
    if (process.env.NODE_ENV === 'production' && !hasUpstash) {
      console.warn('⚠️ Rate limiting désactivé en production - configurez Upstash Redis')
    }
    return { success: true, limit: Infinity, remaining: Infinity, reset: Date.now() }
  }

  const result = await limiter.limit(identifier)
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}
