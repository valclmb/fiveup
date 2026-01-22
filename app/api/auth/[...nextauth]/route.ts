import { handlers } from "@/auth" // Assure-toi que le chemin vers auth.ts est bon

export const { GET, POST } = handlers

// Force le runtime Node.js pour cette route (nécessaire pour Prisma)
export const runtime = 'nodejs'