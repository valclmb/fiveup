"use client";

import { getAll } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";

export const AVATAR_QUERY_KEY = ["profile", "avatar"] as const;

type UserWithImage = { image?: string | null } | null | undefined;

/**
 * Retourne l'URL affichable de l'avatar utilisateur.
 * - OAuth (Google, etc.) : user.image est déjà une URL → retournée telle quelle
 * - Upload R2 : user.image est une clé → fetch de l'URL signée via profile/avatar
 */
export function useUserAvatarUrl(user: UserWithImage) {
  const needsAvatarFetch = user?.image && !user.image.startsWith("http");
  const { data: avatarData } = useQuery({
    queryKey: AVATAR_QUERY_KEY,
    queryFn: () => getAll<{ avatarUrl: string | null }>("profile/avatar"),
    enabled: !!needsAvatarFetch,
  });

  if (!user?.image) return null;
  if (user.image.startsWith("http")) return user.image;
  return avatarData?.avatarUrl ?? null;
}
