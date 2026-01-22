import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { verifyPassword } from "@/lib/auth/password"

// Fonction helper pour obtenir Prisma (utilisé dans les callbacks)
// Ce fichier n'est utilisé que dans Node.js runtime, donc Prisma est toujours disponible
async function getPrisma() {
  return prisma
}

// Pour l'adapter, on doit l'initialiser de manière synchrone
// L'adapter est nécessaire pour OAuth (Google) car il doit créer/lier les comptes
// Ce fichier auth.ts n'est utilisé que dans Node.js runtime (routes API), pas en Edge Runtime
// Donc on peut importer Prisma directement
import { prisma } from "@/lib/prisma"

// Initialiser l'adapter directement
// L'adapter est obligatoire pour OAuth, donc on l'initialise toujours
const adapterInstance = PrismaAdapter(prisma)

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter seulement si Prisma est disponible (Node.js runtime)
  adapter: adapterInstance,
  
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    
    // ✨ Nouveau : Credentials Provider
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        // 1. Vérifier que les champs sont remplis
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis")
        }

        // 2. Chercher l'utilisateur dans la BDD
        const prismaClient = await getPrisma()
        if (!prismaClient) {
          throw new Error("Database not available in Edge Runtime")
        }
        const user = await prismaClient.user.findUnique({
          where: { email: (credentials.email as string).toLowerCase().trim() },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            emailVerified: true,
            password: true,
            subscription: true,
          },
        })

        // 3. Vérifier que l'utilisateur existe et a un mot de passe
        // Protection contre l'énumération : même message d'erreur si utilisateur inexistant ou pas de mot de passe
        if (!user || !user.password) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // 4. Vérifier le mot de passe
        const isPasswordValid = await verifyPassword(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // 5. ⚠️ IMPORTANT : Vérifier que l'email est confirmé
        // Protection contre l'énumération : même message générique
        if (!user.emailVerified) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // 6. Retourner l'utilisateur (SANS le mot de passe!)
        // Inclure subscription pour le cache dans le JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
          subscription: user.subscription,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 jours (session totale)
    updateAge: 24 * 60 * 60, // Renouvellement automatique toutes les 24h
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Mettre en cache toutes les données utilisateur dans le JWT
        // pour éviter les requêtes BDD à chaque chargement de page
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.emailVerified = user.emailVerified
        token.subscription = (user as any).subscription || 'free'
        
        // Pour les providers OAuth (Google, etc.), récupérer les données complètes de l'utilisateur
        // car l'adapter Prisma peut ne pas retourner toutes les données
        if (account?.provider !== 'credentials') {
          try {
            const prismaClient = await getPrisma()
            if (prismaClient && user.email) {
              // Récupérer les données complètes de l'utilisateur depuis la BDD
              const dbUser = await prismaClient.user.findUnique({
                where: { email: user.email },
                select: {
                  emailVerified: true,
                  subscription: true,
                },
              })
              
              if (dbUser) {
                // Mettre à jour emailVerified si nécessaire (OAuth emails sont déjà vérifiés)
                if (!dbUser.emailVerified) {
                  await prismaClient.user.update({
                    where: { email: user.email },
                    data: { emailVerified: new Date() },
                  })
                  token.emailVerified = new Date()
                } else {
                  token.emailVerified = dbUser.emailVerified
                }
                
                // Mettre à jour subscription depuis la BDD
                token.subscription = dbUser.subscription || 'free'
              }
            }
          } catch (error) {
            console.error('Erreur récupération données OAuth:', error)
            // En cas d'erreur, utiliser les valeurs par défaut
            token.subscription = token.subscription || 'free'
          }
        }
      }
      return token
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        // Utiliser les données du JWT (cache) au lieu de faire une requête BDD
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string | null
        session.user.image = token.image as string | null
        session.user.emailVerified = token.emailVerified as Date | null
        session.user.subscription = token.subscription as string
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})