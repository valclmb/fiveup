import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Récupérer le customer ID Stripe de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  const customerId = user?.stripeCustomerId;

  if (!customerId) {
    redirect("/profile?error=no_stripe_customer");
  }

  try {
    // Créer une session du Customer Portal
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.BETTER_AUTH_URL}/profile`,
    });

    // redirect() lance une exception NEXT_REDIRECT - ne pas la catch
    redirect(portalSession.url);
  } catch (error: any) {
    // Ignorer l'exception NEXT_REDIRECT
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error; // Re-lancer pour que Next.js gère la redirection
    }
    console.error("Error creating Stripe portal session:", error);
    redirect("/profile?error=portal_error");
  }
}
