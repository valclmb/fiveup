"use client";

import { listUserAccounts } from "@/lib/auth-utils";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook pour récupérer les comptes liés à l'utilisateur (API native better-auth).
 * Utilise GET /api/auth/list-accounts
 */
export function useAuthAccounts() {
  return useQuery({
    queryKey: ["auth-accounts"],
    queryFn: listUserAccounts,
  });
}

/**
 * Hook pour savoir si l'utilisateur a un compte Google lié.
 */
export function useIsGoogleUser() {
  const { data: accounts = [], ...rest } = useAuthAccounts();
  const isGoogleUser = accounts.some((a) => a.providerId === "google");
  return { isGoogleUser, accounts, ...rest };
}

/**
 * Hook pour savoir si l'utilisateur a un compte email/password (credential).
 * Utile pour afficher/masquer le formulaire de changement de mot de passe.
 */
export function useIsCredentialUser() {
  const { data: accounts = [], ...rest } = useAuthAccounts();
  const isCredentialUser = accounts.some((a) => a.providerId === "credential");
  return { isCredentialUser, accounts, ...rest };
}
