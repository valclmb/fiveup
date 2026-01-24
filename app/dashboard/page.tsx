import { auth } from "@/auth"
import ShopifyIntegrationCard from "@/components/connect-shopify"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const user = session?.user;

  if (!user) {
    redirect('/auth/signin')
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
              await authClient.signOut({ fetchOptions: { onSuccess: () => redirect('/') } })
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
              <dd className="text-sm text-gray-900">"subscription"</dd>
            </div>
          </dl>
        </div>
        <ShopifyIntegrationCard />

      </div>
    </div>
  )
}