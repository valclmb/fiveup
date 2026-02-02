import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;
      if (response?.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After");
        const message = retryAfter
          ? `Too many attempts. Try again in ${retryAfter} second(s).`
          : "Too many attempts. Please try again later.";
        if (typeof window !== "undefined") {
          const { toast } = await import("sonner");
          toast.error(message, { duration: 5000 });
        }
      }
    },
  },
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
})