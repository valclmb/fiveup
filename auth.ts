import {
  ensurePlanUpgradeBonus,
  ensureSignupBonus,
  getBalance,
} from "@/lib/tokens";
import { getActivePlanForUser } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";
import { stripe } from "@better-auth/stripe";
import { customSession } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import Stripe from "stripe";
import { sendResetPasswordEmail, sendVerificationEmail } from "./lib/email";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    window: 60, // 60 secondes
    max: 100, // 100 requêtes max par fenêtre
    customRules: {
      "/sign-in/email": { window: 10, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
    },
    storage: "database",
    modelName: "rateLimit",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    resetPasswordTokenExpiresIn: 3600,
    sendResetPassword: async ({ user, url, token }, request) => {
      sendResetPasswordEmail({
        to: user.email,
        userName: user.name || user.email.split("@")[0],
        resetUrl: url,
      }).catch((error) => {
        console.error(
          "❌ Erreur lors de l'envoi de l'email de réinitialisation:",
          error
        );
        // Ne pas throw pour éviter les timing attacks
      });
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(
        `✅ Mot de passe réinitialisé pour l'utilisateur ${user.email}`
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Envoie automatiquement à l'inscription
    autoSignInAfterVerification: true, // Auto-connecte après vérification
    sendVerificationEmail: async ({ user, url, token }) => {
      sendVerificationEmail({
        to: user.email,
        userName: user.name || user.email.split("@")[0],
        verificationUrl: url,
      }).catch((error) => {
        console.error(
          "❌ Erreur lors de l'envoi de l'email de vérification:",
          error
        );
        // Ne pas throw pour ne pas bloquer le processus d'inscription
      });
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // Mettre à jour tous les jours
    cookieCache: {
      enabled: true, // Active le cache des cookies pour améliorer les performances
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    // Les OAuth comme Google vérifient automatiquement l'email via SSO
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const plan = await getActivePlanForUser(user.id);
      await ensureSignupBonus(user.id);
      await ensurePlanUpgradeBonus(user.id, plan);
      const tokenBalance = await getBalance(user.id);
      return {
        user: { ...user, plan, tokenBalance },
        session,
      };
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        getCheckoutSessionParams: async (
          { user, session, plan, subscription },
          req,
          ctx
        ) => {
          // Affonso - pass referral cookie to Stripe for commission tracking
          const cookieHeader = req?.headers?.get?.("cookie") ?? "";
          const affonsoMatch = cookieHeader.match(
            /(?:^|; )affonso_referral=([^;]*)/
          );
          const affonsoReferral = affonsoMatch
            ? decodeURIComponent(affonsoMatch[1].trim())
            : "";

          const metadata: Record<string, string> = {};
          if (affonsoReferral) metadata.affonso_referral = affonsoReferral;

          if (process.env.NODE_ENV === "development") {
            console.log("[Affonso] Checkout metadata:", {
              affonso_referral: affonsoReferral || "(none)",
              cookieFound: !!affonsoReferral,
            });
          }

          return {
            params: {
              metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
            },
          };
        },
        plans: [
          {
            name: "pro",
            priceId: process.env.STRIPE_PRICE_ID_MONTHLY!,
            annualDiscountPriceId: process.env.STRIPE_PRICE_ID_YEARLY!,
            limits: {
              projects: 5,
              storage: 10,
            },
          },
          {
            name: "ultra",
            priceId: process.env.STRIPE_PRICE_ID_ULTRA_MONTHLY!,
            annualDiscountPriceId: process.env.STRIPE_PRICE_ID_ULTRA_YEARLY!,
            limits: {
              projects: 20,
              storage: 50,
            },
          },
        ],
      },
    }),
  ],
});
