// Configuration NextAuth pour Edge Runtime (middleware)
// Ne pas importer Prisma ici car Edge Runtime ne le supporte pas
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// Configuration minimale pour Edge Runtime (sans adapter Prisma)
// L'adapter n'est pas nécessaire pour la fonction auth() dans Edge Runtime
// car elle lit seulement les cookies JWT
export const { auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Cette fonction ne sera jamais appelée dans Edge Runtime
      // car les credentials sont gérés par les routes API
      async authorize() {
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})
