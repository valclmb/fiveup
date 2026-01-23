import { prisma } from "@/lib/prisma";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // Latest API version as of Stripe SDK v20.0.0
})


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders:{
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    },
    plugins: [
      stripe({
          stripeClient,
          stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
          createCustomerOnSignUp: true,
          subscription: {
            enabled: true,
            plans: [
                {
                    name: "pro", // the name of the plan, it'll be automatically lower cased when stored in the database
                    priceId: process.env.STRIPE_PRICE_ID_MONTHLY!, // the price ID from stripe
                    annualDiscountPriceId: process.env.STRIPE_PRICE_ID_YEARLY!, // (optional) the price ID for annual billing with a discount
                    limits: {
                        projects: 5,
                        storage: 10
                    }
                },
                
            ]
        }
        

        
      })
  ]
});