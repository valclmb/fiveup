export type AuthAccount = {
  id: string;
  providerId: string;
  accountId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  scopes?: string[];
};

/**
 * Liste les comptes liés à l'utilisateur (API native better-auth).
 * GET /api/auth/list-accounts
 */
export async function listUserAccounts(): Promise<AuthAccount[]> {
  const response = await fetch("/api/auth/list-accounts", {
    credentials: "include",
  });
  if (!response.ok) return [];
  return response.json();
}

/**
 * Vérifie si l'utilisateur a un compte Google lié.
 */
export async function isGoogleUser(): Promise<boolean> {
  const accounts = await listUserAccounts();
  return accounts.some((a) => a.providerId === "google");
}

/**
 * Vérifie si l'utilisateur s'est connecté uniquement via email/password (credential).
 */
export async function isCredentialUser(): Promise<boolean> {
  const accounts = await listUserAccounts();
  return accounts.some((a) => a.providerId === "credential");
}
