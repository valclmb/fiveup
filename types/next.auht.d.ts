import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      emailVerified: Date | null
      subscription: string
    } & DefaultSession["user"]
  }

  interface User {
    emailVerified: Date | null
    subscription?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name?: string | null
    image?: string | null
    emailVerified: Date | null
    subscription: string
  }
}