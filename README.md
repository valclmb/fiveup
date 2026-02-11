# FiveUp

Plateforme de collecte et de gestion d’avis clients : campagnes de demande d’avis (SMS, email, WhatsApp), synchronisation des avis Trustpilot et Google, personnalisation des pages (avis, redirection, feedback), et système de tokens avec plans Pro/Ultra.

## Stack technique

- **Framework** : Next.js 16 (App Router)
- **Base de données** : PostgreSQL avec Prisma
- **Auth** : Better Auth (email/mot de passe, Google OAuth, Stripe abonnements)
- **Paiements & abonnements** : Stripe (plans Pro/Ultra + achat de packs de tokens)
- **Tâches planifiées** : Upstash QStash (envoi différé des messages, sync avis, bonus tokens mensuels)
- **E-commerce** : Shopify (webhooks commandes pour lancer les campagnes)
- **Avis** : Trustpilot, Google Business (sync via Apify)
- **Emails** : Resend — **SMS** : Twilio — **Stockage fichiers** : Cloudflare R2 (AWS S3-compatible)

## Prérequis

- **Node.js** 20+
- **pnpm** (recommandé)
- **PostgreSQL** (local ou hébergé, ex. Neon, Supabase, Vercel Postgres)
- Compte **Stripe** (abonnements + webhooks tokens)
- Compte **Upstash** (QStash) pour les jobs planifiés
- **ngrok** (ou équivalent) pour le dev local si vous testez **Shopify**, **QStash** ou les **webhooks** — voir [Développement local : tunnel (ngrok)](#développement-local--tunnel-ngrok).

## Installation et lancement

### 1. Cloner et installer les dépendances

```bash
git clone <repo-url>
cd fiveup
pnpm install
```

### 2. Variables d’environnement

Créer un fichier `.env` à la racine (voir section [Variables d’environnement](#variables-denvironnement) pour la liste complète). Au minimum pour faire tourner l’app en local :

- `DATABASE_URL` — URL de connexion PostgreSQL
- `BETTER_AUTH_URL` — URL de l’app (ex. `http://localhost:3000`)
- `NEXT_PUBLIC_BETTER_AUTH_URL` — même valeur pour le client
- `STRIPE_SECRET_KEY` — clé secrète Stripe
- Clés Better Auth / Stripe pour l’auth et les abonnements

### 3. Base de données

```bash
# Générer le client Prisma (déjà fait après pnpm install via postinstall)
pnpm prisma generate

# Créer les tables (première fois)
pnpm prisma db push
# ou avec migrations :
# pnpm prisma migrate dev
```

### 4. Lancer le serveur de développement

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### 5. Build et production

```bash
pnpm build
pnpm start
```

---

## Variables d’environnement

### Base de données

| Variable         | Description                          |
|------------------|--------------------------------------|
| `DATABASE_URL`   | URL de connexion PostgreSQL          |

La configuration Prisma lit cette variable via `prisma.config.ts` (et éventuellement `.env`).

### Auth (Better Auth)

| Variable                      | Description                                      |
|------------------------------|--------------------------------------------------|
| `BETTER_AUTH_URL`             | URL de base de l’app (ex. `https://app.example.com` ou `http://localhost:3000`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Même URL, pour le client (obligatoire côté navigateur) |

### Stripe

| Variable                         | Description                                   |
|----------------------------------|-----------------------------------------------|
| `STRIPE_SECRET_KEY`              | Clé secrète API Stripe                        |
| `STRIPE_WEBHOOK_SECRET`          | Secret du webhook Better Auth (abonnements)   |
| `STRIPE_WEBHOOK_SECRET_TOKENS`   | Secret du webhook achat de tokens             |
| `STRIPE_PRICE_ID_MONTHLY`        | Price ID Stripe abonnement Pro mensuel        |
| `STRIPE_PRICE_ID_YEARLY`         | Price ID Stripe abonnement Pro annuel        |
| `STRIPE_PRICE_ID_ULTRA_MONTHLY`  | Price ID Stripe abonnement Ultra mensuel     |
| `STRIPE_PRICE_ID_ULTRA_YEARLY`   | Price ID Stripe abonnement Ultra annuel     |

### QStash (Upstash)

| Variable                    | Description                                                |
|-----------------------------|------------------------------------------------------------|
| `QSTASH_TOKEN`              | Token d’API QStash (envoi + création de schedules)         |
| `QSTASH_CURRENT_SIGNING_KEY`| Clé de signature courante pour vérifier les requêtes QStash |
| `QSTASH_NEXT_SIGNING_KEY`   | Clé de signature suivante (rotation)                       |
| `QSTASH_DEV_DELAY`          | (Optionnel) Délai en dev, ex. `1m` ou `0s`                |

Endpoints protégés par signature QStash : `/api/campaigns/send-review-message`, `/api/reviews/sync-scheduled`, `/api/reviews/sync-catchup`, `/api/cron/plan-bonus-monthly`.

### Shopify

| Variable               | Description                          |
|------------------------|--------------------------------------|
| `SHOPIFY_CLIENT_ID`    | Client ID de l’app Shopify          |
| `SHOPIFY_CLIENT_SECRET`| Client secret (validation webhooks)  |

### Google (OAuth + Google Business)

| Variable                       | Description                                      |
|--------------------------------|--------------------------------------------------|
| `GOOGLE_CLIENT_ID`             | Client ID OAuth Google (connexion + Google Business) |
| `GOOGLE_CLIENT_SECRET`         | Client secret OAuth Google                      |
| `GOOGLE_BUSINESS_REDIRECT_URI` | (Optionnel) Redirect URI pour Google Business   |

Par défaut : `{BETTER_AUTH_URL}/api/google-business/callback`.

### Emails (Resend)

| Variable          | Description                    |
|-------------------|--------------------------------|
| `RESEND_API_KEY`  | Clé API Resend                 |
| `RESEND_FROM_EMAIL` | Email expéditeur (ex. `noreply@example.com`) |
| `APP_NAME`        | (Optionnel) Nom de l’app dans les emails (défaut : `FiveUp`) |

### SMS (Twilio)

| Variable              | Description           |
|-----------------------|-----------------------|
| `TWILIO_ACCOUNT_SID`  | Account SID Twilio    |
| `TWILIO_AUTH_TOKEN`   | Auth token Twilio     |
| `TWILIO_PHONE_NUMBER` | Numéro d’envoi SMS    |

### Avis (Apify – Trustpilot / Google)

| Variable         | Description        |
|------------------|--------------------|
| `APIFY_API_TOKEN`| Token API Apify    |

### Stockage (Cloudflare R2, S3-compatible)

| Variable             | Description          |
|----------------------|----------------------|
| `R2_ACCOUNT_ID`      | Account ID R2        |
| `R2_ACCESS_KEY_ID`   | Access key           |
| `R2_SECRET_ACCESS_KEY` | Secret key         |
| `R2_BUCKET_NAME`     | Nom du bucket        |

### Optionnel

| Variable                      | Description |
|------------------------------|-------------|
| `REVIEW_COLLECTION_BASE_URL` | URL de base pour les liens de collecte d’avis (fallback si différent de l’app) |
| `NEXT_PUBLIC_CALCOM_LINK`    | Lien Cal.com (ex. page « Book a demo ») |
| `VERCEL_URL`                 | Sur Vercel, utilisé comme fallback pour `BETTER_AUTH_URL` dans les callbacks QStash |

---

## Configuration avancée

### Développement local : tunnel (ngrok)

Plusieurs fonctionnalités nécessitent une URL **publique en HTTPS** pour fonctionner. En local, utilisez un tunnel type **ngrok** et définissez l’URL fournie dans `BETTER_AUTH_URL` et `NEXT_PUBLIC_BETTER_AUTH_URL`.

Exemple :

```bash
ngrok http 3000
# Puis dans .env : BETTER_AUTH_URL=https://xxxx.ngrok-free.app
```

Fonctionnalités concernées :

| Fonctionnalité | Pourquoi ngrok est utile |
|----------------|--------------------------|
| **Connexion Shopify (shop dev)** | Shopify n’accepte que des URLs **HTTPS** pour le callback OAuth et l’enregistrement des webhooks. Sur `localhost` ou `http://`, l’app ignore l’enregistrement des webhooks et la connexion du shop peut échouer. |
| **QStash** | Les jobs planifiés (envoi de messages, sync avis, cron bonus) appellent votre app par URL. En local, QStash doit pouvoir joindre une URL publique ; sans tunnel, utilisez `npx @upstash/qstash-cli dev` à la place. |
| **Webhooks Stripe** | En dev vous pouvez utiliser `stripe listen --forward-to localhost:3000/...` sans ngrok. Si vous préférez une URL publique (ex. pour tester depuis le dashboard Stripe), ngrok convient. |
| **Google Business (OAuth)** | Les redirect URIs peuvent être en `localhost` selon la config Google Cloud. Si vous utilisez déjà ngrok pour Shopify, utiliser la même URL partout simplifie la config. |

Sans tunnel, l’app tourne correctement pour le reste (auth, dashboard, campagnes sans Shopify, etc.).

### QStash – Schedules (après déploiement)

Deux tâches récurrentes sont utilisées :

1. **Sync quotidien des avis (catchup)**  
   - Schedule ID : `reviews-sync-catchup`  
   - Endpoint : `POST /api/reviews/sync-catchup`  
   - Cron : tous les jours à 3h UTC  

2. **Bonus tokens mensuels (abonnés actifs)**  
   - Schedule ID : `plan-bonus-monthly`  
   - Endpoint : `POST /api/cron/plan-bonus-monthly`  
   - Cron : le 1er de chaque mois à 4h UTC  

Pour créer au moins le schedule **reviews-sync-catchup** (script fourni) :

```bash
pnpm run setup:qstash
```

Ce script exécute `scripts/setup-qstash-schedule.mjs` et nécessite `QSTASH_TOKEN` et `BETTER_AUTH_URL` (ou `VERCEL_URL`).  
Le schedule **plan-bonus-monthly** peut être créé via le code dans `lib/qstash.ts` (`ensurePlanBonusMonthlySchedule`) si vous exposez un script ou une route d’init.

### Développement local avec QStash

En local, QStash envoie les requêtes vers votre URL. Soit vous utilisez un tunnel (ex. ngrok) et vous mettez l’URL HTTPS dans `BETTER_AUTH_URL` (voir [Développement local : tunnel (ngrok)](#développement-local--tunnel-ngrok)), soit vous utilisez le CLI Upstash pour recevoir les messages en local :  
`npx @upstash/qstash-cli dev`.

### Stripe – Webhooks

- **Better Auth (abonnements)** : pointer le webhook Stripe vers `https://<votre-domaine>/api/auth/stripe/webhook` et utiliser le secret dans `STRIPE_WEBHOOK_SECRET`.
- **Achat de tokens** : webhook dédié vers `https://<votre-domaine>/api/webhooks/stripe-tokens` avec `STRIPE_WEBHOOK_SECRET_TOKENS`.

### Shopify

Configurer l’app Shopify avec les URLs de redirection et le webhook commandes/fulfillment vers votre domaine (voir `app/api/shopify/`).  
**En dev** : pour connecter un shop de développement, utiliser ngrok (ou un tunnel HTTPS) et renseigner l’URL ngrok dans `BETTER_AUTH_URL`, sinon le callback OAuth et l’enregistrement des webhooks sont ignorés (Shopify n’accepte que HTTPS).

---

## Structure du projet (résumé)

- `app/` — Routes Next.js (dashboard, landing, auth, API)
- `app/api/` — Routes API :
  - `auth/` — Better Auth (catch-all)
  - `campaigns/` — Campagne order-review (config + `send-review-message` pour QStash)
  - `cron/` — Jobs planifiés (ex. `plan-bonus-monthly`)
  - `customization/` — Personnalisation (global-styles, review-page, redirection-page, feedback-page)
  - `dashboard/stats` — Stats du dashboard (graphique + derniers avis)
  - `feedback` — Envoi de feedback produit (POST)
  - `google-business/` — OAuth + compte Google Business (modèle dédié)
  - `profile/` — Avatar, token-transactions
  - `reviews/` — Liste avis, stats par source, sync (scheduled, catchup), Trustpilot & Google (account, connect, status)
  - `shopify/` — OAuth, stores, webhooks
  - `stripe/` — Portail facturation
  - `tokens/` — Création session checkout achat de tokens
  - `webhooks/` — Webhooks externes (ex. `stripe-tokens`)
- `components/` — Composants React (dont features : campagnes, personnalisation, profil)
- `lib/` — Logique métier (auth, tokens, campagnes, reviews, Shopify, QStash, email, etc.)
- `prisma/` — Schéma et migrations
- `scripts/` — Scripts one-shot (ex. `setup-qstash-schedule.mjs`)
- `docs/` — Documentation interne (Stripe, schéma, mapping avis Google, etc.)

---

## Documentation interne

- `docs/STRIPE_INTEGRATION.md` — Détails intégration Stripe / Better Auth
- `docs/SCHEMA_ANALYSIS.md` — Analyse du schéma de données
- `docs/REVIEWS_GOOGLE_MAPPING.md` — Mapping des avis Google

---

## Licence

Projet privé.
