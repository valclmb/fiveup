# Analyse du schéma Prisma - Tables nécessaires

## Configuration actuelle

- **Better Auth** avec `prismaAdapter`
- **Plugin Stripe** (`@better-auth/stripe`)
- **Rate Limiting** avec stockage en base (`storage: "database"`)
- **Email/Password** avec vérification d'email
- **OAuth Google**

---

## Tables OBLIGATOIRES (Better Auth Core)

### ✅ 1. User
**Nécessaire** : OUI - Table principale de Better Auth
- Utilisée par : Better Auth core, email verification, OAuth
- Champs requis : `id`, `name`, `email`, `emailVerified`, `createdAt`, `updatedAt`
- Champs optionnels : `image`, `stripeCustomerId` (pour Stripe)

### ✅ 2. Session
**Nécessaire** : OUI - Gestion des sessions utilisateur
- Utilisée par : Better Auth core
- Relation : `userId` → `User.id` (CASCADE)
- Champs requis : `id`, `expiresAt`, `token`, `userId`, `createdAt`, `updatedAt`
- Champs optionnels : `ipAddress`, `userAgent`

### ✅ 3. Account
**Nécessaire** : OUI - Pour OAuth (Google)
- Utilisée par : Better Auth OAuth providers
- Relation : `userId` → `User.id` (CASCADE)
- Champs requis : `id`, `accountId`, `providerId`, `userId`, `createdAt`, `updatedAt`
- Champs optionnels : `accessToken`, `refreshToken`, `idToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `password`

### ✅ 4. Verification
**Nécessaire** : OUI - Pour email verification
- Utilisée par : Better Auth email verification
- Champs requis : `id`, `identifier`, `value`, `expiresAt`, `createdAt`, `updatedAt`
- Index : `identifier` (pour lookup rapide)

---

## Tables OBLIGATOIRES (Plugins)

### ✅ 5. Subscription
**Nécessaire** : OUI - Utilisée par `@better-auth/stripe`
- Utilisée par : Plugin Stripe de Better Auth
- **PROBLÈME DÉTECTÉ** : Pas de relation Prisma avec `User`
- Actuellement : Utilise `referenceId` (String) au lieu d'une relation
- **Recommandation** : Ajouter une relation optionnelle avec User pour faciliter les requêtes

### ✅ 6. RateLimit
**Nécessaire** : OUI - Utilisée par rate limiting avec `storage: "database"`
- Utilisée par : Better Auth rate limiter
- Champs requis : `id`, `key`, `count`, `lastRequest`
- Index : `key` (unique)

---

## Résumé

### ✅ Tables à CONSERVER (6 tables)

1. **User** - Core Better Auth
2. **Session** - Core Better Auth
3. **Account** - Core Better Auth (OAuth)
4. **Verification** - Core Better Auth (email verification)
5. **Subscription** - Plugin Stripe
6. **RateLimit** - Rate limiting

### ❌ Tables à SUPPRIMER

Aucune ! Toutes les tables sont utilisées.

---

## Problèmes détectés et recommandations

### 1. Subscription - Relation manquante avec User

**Problème actuel** :
```prisma
model Subscription {
  referenceId String  // Pas de relation Prisma
  // ...
}
```

**Recommandation** : Ajouter une relation optionnelle pour faciliter les requêtes :

```prisma
model Subscription {
  // ...
  referenceId String
  user        User?   @relation(fields: [referenceId], references: [id], onDelete: Cascade)
  // ...
}

model User {
  // ...
  subscriptions Subscription[]
}
```

**Note** : Le plugin Stripe utilise `referenceId` comme clé, donc la relation doit être optionnelle car `referenceId` peut ne pas correspondre à un `User.id` dans certains cas.

### 2. Champs optionnels inutilisés

Vérifier si tous les champs de `Subscription` sont utilisés par le plugin Stripe. Certains champs comme `seats`, `trialStart`, `trialEnd` peuvent être optionnels si non utilisés.

---

## Schéma optimisé recommandé

Voir le fichier `prisma/schema.prisma` avec les corrections appliquées.
