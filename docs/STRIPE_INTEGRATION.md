# Intégration Stripe avec Better Auth

## Configuration actuelle

### ✅ Étape 3 : Plugin serveur (auth.ts)

Le plugin Stripe est configuré dans `auth.ts` avec les options suivantes :

```typescript
stripe({
  stripeClient,                    // Instance Stripe configurée
  stripeWebhookSecret,            // Secret pour vérifier les webhooks
  createCustomerOnSignUp: true,   // Crée automatiquement un client Stripe à l'inscription
  subscription: {
    enabled: true,
    plans: [
      {
        name: "pro",
        priceId: process.env.STRIPE_PRICE_ID_MONTHLY!,      // Prix mensuel
        annualDiscountPriceId: process.env.STRIPE_PRICE_ID_YEARLY!, // Prix annuel
        limits: {
          projects: 5,
          storage: 10,
        },
      },
    ],
  },
})
```

### ✅ Étape 4 : Plugin client (auth-client.ts)

Le plugin client est configuré dans `lib/auth-client.ts` :

```typescript
plugins: [
  stripeClient({
    subscription: true,  // Active la gestion des abonnements côté client
  }),
]
```

## Comment ça fonctionne

### 1. Création automatique d'un client Stripe

Quand un utilisateur s'inscrit :
- Better Auth crée automatiquement un **Stripe Customer** (si `createCustomerOnSignUp: true`)
- Le `stripeCustomerId` est stocké dans la table `User` de votre base de données
- Ce client Stripe est lié à l'utilisateur pour toutes les transactions futures

### 2. Création d'un abonnement (Upgrade)

Quand un utilisateur clique sur "Upgrade to Pro" :

1. **Côté client** (`pricing/page.tsx`) :
   ```typescript
   await authClient.subscription.upgrade({
     plan: "pro",
     annual: isYearly,
     successUrl: "/dashboard?success=subscription",
     cancelUrl: "/dashboard/pricing",
   })
   ```

2. **Côté serveur** (Better Auth) :
   - Vérifie que le plan "pro" existe dans la configuration
   - Crée une **Stripe Checkout Session**
   - Si l'utilisateur a déjà un abonnement actif, utilise `annualDiscountPriceId` si `annual: true`
   - Redirige l'utilisateur vers la page de paiement Stripe

3. **Après le paiement** :
   - Stripe envoie un webhook à `/api/auth/stripe/webhook`
   - Better Auth traite le webhook et :
     - Met à jour la table `Subscription` dans votre base de données
     - Lie l'abonnement à l'utilisateur via `referenceId` (par défaut = `userId`)
     - Met à jour le statut de l'abonnement (`active`, `trialing`, etc.)

### 3. Gestion des webhooks

Better Auth gère automatiquement ces événements Stripe :

- `checkout.session.completed` : Met à jour l'abonnement après le checkout
- `customer.subscription.created` : Crée l'abonnement dans votre DB
- `customer.subscription.updated` : Met à jour les détails de l'abonnement
- `customer.subscription.deleted` : Marque l'abonnement comme annulé

### 4. Structure de données

#### Table `User`
- `stripeCustomerId` : ID du client Stripe (créé automatiquement)

#### Table `Subscription`
- `id` : ID unique de l'abonnement
- `plan` : Nom du plan ("pro")
- `referenceId` : ID de référence (par défaut = `userId`)
- `stripeCustomerId` : ID du client Stripe
- `stripeSubscriptionId` : ID de l'abonnement Stripe
- `status` : Statut (`active`, `trialing`, `canceled`, etc.)
- `periodStart` / `periodEnd` : Dates de la période de facturation
- `cancelAtPeriodEnd` : Si l'abonnement sera annulé à la fin de la période
- `trialStart` / `trialEnd` : Dates de la période d'essai

## Utilisation dans votre application

### Vérifier l'abonnement actif

```typescript
// Côté client
const { data: subscriptions } = await authClient.subscription.list()

if (subscriptions && subscriptions.length > 0) {
  const activeSubscription = subscriptions.find(sub => sub.status === "active" || sub.status === "trialing")
  if (activeSubscription) {
    console.log("Utilisateur a un abonnement actif:", activeSubscription.plan)
  }
}
```

### Annuler un abonnement

```typescript
await authClient.subscription.cancel({
  returnUrl: "/dashboard/billing",
})
```

### Accéder au portail de facturation Stripe

```typescript
await authClient.subscription.billingPortal({
  returnUrl: "/dashboard",
})
```

## Prochaines étapes

1. **Configurer les webhooks Stripe** :
   - Dans le dashboard Stripe, créez un webhook pointant vers :
     ```
     https://votre-domaine.com/api/auth/stripe/webhook
     ```
   - Sélectionnez ces événements :
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copiez le **Webhook Signing Secret** dans votre `.env` comme `STRIPE_WEBHOOK_SECRET`

2. **Tester localement** :
   ```bash
   stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
   ```
   Cela vous donnera un webhook secret pour le développement local.

3. **Ajouter la gestion des erreurs** :
   - Dans `pricing/page.tsx`, ajoutez des notifications d'erreur avec `toast` ou `sonner`

4. **Afficher le statut de l'abonnement** :
   - Créez une page `/dashboard/billing` pour afficher l'abonnement actuel
   - Utilisez `authClient.subscription.list()` pour récupérer les abonnements

## Points importants

- ✅ Un client Stripe est créé automatiquement à l'inscription
- ✅ Les abonnements sont gérés automatiquement via les webhooks
- ✅ Le plugin prévient les abus de période d'essai (un seul essai par utilisateur)
- ✅ Les abonnements sont liés à l'utilisateur via `referenceId` (par défaut = `userId`)
- ⚠️ Si un utilisateur a déjà un abonnement actif, vous **devez** fournir `subscriptionId` lors de l'upgrade pour éviter la double facturation

## Configuration des plans

Dans `auth.ts`, vous pouvez ajouter d'autres plans :

```typescript
plans: [
  {
    name: "basic",
    priceId: process.env.STRIPE_PRICE_ID_BASIC_MONTHLY!,
    annualDiscountPriceId: process.env.STRIPE_PRICE_ID_BASIC_YEARLY!,
    limits: {
      projects: 2,
      storage: 5,
    },
  },
  {
    name: "pro",
    priceId: process.env.STRIPE_PRICE_ID_MONTHLY!,
    annualDiscountPriceId: process.env.STRIPE_PRICE_ID_YEARLY!,
    limits: {
      projects: 5,
      storage: 10,
    },
    freeTrial: {
      days: 14,  // Période d'essai de 14 jours
    },
  },
]
```
