'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [formError, setFormError] = useState('')

  // Gestion de la connexion Google
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch (error) {
      console.error('Erreur Google Sign In:', error)
      setIsGoogleLoading(false)
    }
  }

  // Gestion de la connexion Email/Password (à implémenter plus tard)
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setFormError(result.error)
      } else if (result?.ok) {
        window.location.href = callbackUrl
      }
    } catch (error) {
      setFormError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  // Messages d'erreur personnalisés
  const getErrorMessage = () => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'Cet email est déjà utilisé avec une autre méthode de connexion.'
      case 'EmailSignin':
        return 'Erreur lors de l\'envoi de l\'email de connexion.'
      case 'Callback':
        return 'Erreur lors de la connexion. Veuillez réessayer.'
      case 'OAuthSignin':
        return 'Erreur lors de la connexion avec Google.'
      case 'OAuthCallback':
        return 'Erreur lors du retour de Google.'
      case 'SessionRequired':
        return 'Veuillez vous connecter pour accéder à cette page.'
      default:
        return error ? 'Une erreur est survenue lors de la connexion.' : ''
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {(errorMessage || formError) && (
            <div className="mb-4 text-sm text-red-600">
              {errorMessage || formError}
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            variant="outline"
            className="w-full mb-4"
            type="button"
          >
            {isGoogleLoading ? 'Chargement...' : 'Continuer avec Google'}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Ou</span>
            </div>
          </div>

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              required
              disabled={isLoading || isGoogleLoading}
            />

            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Mot de passe"
              required
              disabled={isLoading || isGoogleLoading}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500">
              Pas de compte ? Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  )
}