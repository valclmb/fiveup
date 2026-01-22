import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await auth()

  // Vérification basique
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Utiliser les données de la session (cache dans JWT) au lieu de faire une requête BDD
  // Les données sont mises à jour lors de la connexion et rafraîchies toutes les 24h
  const user = {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name,
    emailVerified: session.user.emailVerified,
    subscription: session.user.subscription || 'free',
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord
            </h1>
            <p className="mt-2 text-gray-600">
              Bienvenue, {user.name || user.email} !
            </p>
          </div>
          
          {/* ✅ Version corrigée */}
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: '/' })
            }}
          >
            <Button variant="outline" type="submit">
              Se déconnecter
            </Button>
          </form>
        </div>

        {/* Contenu du dashboard */}
        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Informations du compte</h2>
          <dl className="mt-4 space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="text-sm text-gray-900">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email vérifié</dt>
              <dd className="text-sm text-gray-900">
                {user.emailVerified ? '✅ Oui' : '❌ Non'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Abonnement</dt>
              <dd className="text-sm text-gray-900">{user.subscription}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}