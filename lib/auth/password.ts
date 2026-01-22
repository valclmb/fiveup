import bcrypt from 'bcryptjs'

// Nombre de tours de hachage (12 = bon équilibre sécurité/performance)
const SALT_ROUNDS = 12

/**
 * Hache un mot de passe
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Vérifie qu'un mot de passe correspond au hash stocké
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Valide la force d'un mot de passe
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères')
  }

  if (password.length > 128) {
    errors.push('Le mot de passe ne peut pas dépasser 128 caractères')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}