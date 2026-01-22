'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorDetails = () => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Erreur de configuration',
          description: 'Un problème de configuration est survenu. Contactez le support.',
        }
      case 'AccessDenied':
        return {
          title: 'Accès refusé',
          description: 'Vous n\'avez pas l\'autorisation d\'accéder à cette ressource.',
        }
      case 'Verification':
        return {
          title: 'Vérification échouée',
          description: 'Le lien de vérification est invalide ou a expiré.',
        }
      default:
        return {
          title: 'Erreur de connexion',
          description: 'Une erreur est survenue lors de la connexion.',
        }
    }
  }

  const { title, description } = getErrorDetails()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">{description}</p>

          <div className="mt-6">
            <Link href="/auth/signin">
              <Button className="w-full">Retour à la connexion</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ErrorContent />
    </Suspense>
  )
}