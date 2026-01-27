# Explication : GET /api/auth/get-session

## 📊 Décodage du message

```
GET /api/auth/get-session 200 in 2.9s (compile: 94ms, render: 2.8s)
```

### Détails

1. **`GET /api/auth/get-session`** : Route API de Better Auth qui récupère la session de l'utilisateur
2. **`200`** : Code HTTP de succès (la requête a réussi)
3. **`in 2.9s`** : Temps total de la requête (2.9 secondes)
4. **`compile: 94ms`** : Temps de compilation de la route (94 millisecondes) - normal en développement
5. **`render: 2.8s`** : Temps de rendu/exécution (2.8 secondes) - **C'est long !**

## 🔍 Pourquoi cette route est appelée ?

Cette route est appelée dans deux endroits de votre application :

### 1. Côté serveur (Server Component)
```typescript
// app/(dashboard)/layout.tsx
const session = await auth.api.getSession({ headers: await headers() });
```
- Appelé lors du rendu serveur du layout du dashboard
- Vérifie si l'utilisateur est connecté avant d'afficher la page

### 2. Côté client (Client Component)
```typescript
// components/layout/sidebar/app-sidebar.tsx
const { data: session, isPending } = authClient.useSession()
```
- Hook React qui fait un appel HTTP à `/api/auth/get-session`
- Utilisé pour afficher les informations de l'utilisateur dans la sidebar
- Se met à jour automatiquement quand la session change

## ⚠️ Pourquoi 2.8s est long ?

Un temps de rendu de **2.8 secondes** est anormalement long. Voici les causes possibles :

### Causes probables

1. **Première compilation** (normal en dev)
   - Next.js compile la route lors du premier appel
   - Les appels suivants seront plus rapides (< 100ms)

2. **Connexion à la base de données lente**
   - Better Auth doit interroger la table `Session` et `User`
   - Vérifier la latence de votre base de données PostgreSQL
   - Si vous utilisez une DB distante, la latence réseau peut être élevée

3. **Requêtes de base de données non optimisées**
   - Better Auth fait des JOINs entre `Session` et `User`
   - Vérifier que les index sont bien créés (ils le sont dans votre schema)

4. **Problème de connexion DB**
   - Timeout de connexion
   - Pool de connexions épuisé
   - Vérifier votre configuration Prisma

## ✅ Solutions pour optimiser

### 1. Vérifier la performance de la DB

```bash
# Vérifier la connexion à votre base de données
psql -h votre-host -U votre-user -d votre-db -c "SELECT 1;"
```

### 2. Optimiser Prisma

Vérifiez votre configuration dans `lib/prisma.ts` :

```typescript
// Assurez-vous d'avoir un pool de connexions optimisé
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'], // Pour voir les requêtes
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
```

### 3. Utiliser le cache de session

Better Auth met en cache les sessions. Vérifiez votre configuration dans `auth.ts` :

```typescript
export const auth = betterAuth({
  // ... votre config
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // Mettre à jour tous les jours
    cookieCache: {
      enabled: true, // Active le cache des cookies
    },
  },
})
```

### 4. Réduire les appels redondants

Vous avez deux appels à `get-session` :
- Un côté serveur dans le layout
- Un côté client dans la sidebar

**Solution** : Passez la session du serveur au client via props :

```typescript
// app/(dashboard)/layout.tsx
export default async function LandingLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar variant="inset" initialSession={session} />
        {/* ... */}
      </SidebarProvider>
    </ThemeProvider>
  );
}
```

```typescript
// components/layout/sidebar/app-sidebar.tsx
export const AppSidebar = ({ initialSession, ...props }) => {
  // Utiliser initialSession si disponible, sinon faire l'appel
  const { data: session, isPending } = authClient.useSession({
    initialData: initialSession,
  });
  
  // ...
}
```

### 5. Monitoring en production

En production, ces temps devraient être beaucoup plus rapides :
- Pas de compilation (code pré-compilé)
- Cache activé
- Optimisations Next.js

## 📈 Temps attendus

- **Développement** : 100-500ms (après la première compilation)
- **Production** : 10-50ms (avec cache)

Si vous voyez toujours 2.8s après plusieurs appels, il y a probablement un problème de configuration ou de performance de base de données.

## 🔧 Debug

Pour voir exactement ce qui prend du temps, activez les logs Prisma :

```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})
```

Cela vous permettra de voir quelles requêtes prennent du temps.
