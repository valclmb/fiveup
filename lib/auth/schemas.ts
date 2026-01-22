import { z } from 'zod'

/**
 * Schéma de validation pour l'inscription
 */
export const signupSchema = z.object({
  email: z
    .string()
    .email({ message: 'Adresse email invalide' })
    .min(1, { message: 'Email requis' })
    .max(255, { message: 'Email trop long' })
    .toLowerCase()
    .trim(),
  
  password: z
    .string()
    .min(1, { message: 'Mot de passe requis' })
    .max(128, { message: 'Le mot de passe ne peut pas dépasser 128 caractères' }),
  
  name: z
    .string()
    .max(100, { message: 'Nom trop long' })
    .trim()
    .optional()
    .nullable(),
})

/**
 * Schéma de validation pour la connexion
 */
export const signinSchema = z.object({
  email: z
    .string()
    .email({ message: 'Adresse email invalide' })
    .min(1, { message: 'Email requis' })
    .toLowerCase()
    .trim(),
  
  password: z
    .string()
    .min(1, { message: 'Mot de passe requis' })
    .max(128, { message: 'Le mot de passe ne peut pas dépasser 128 caractères' }),
})

/**
 * Type TypeScript inféré depuis le schéma signup
 */
export type SignupInput = z.infer<typeof signupSchema>

/**
 * Type TypeScript inféré depuis le schéma signin
 */
export type SigninInput = z.infer<typeof signinSchema>
