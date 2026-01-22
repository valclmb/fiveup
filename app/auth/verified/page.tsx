import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function EmailVerifiedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-8 text-center shadow">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-green-600">
            Email confirmé !
          </h1>
          <p className="mt-2 text-gray-600">
            Votre adresse email a été vérifiée avec succès.
          </p>
          <p className="mt-1 text-gray-600">
            Vous pouvez maintenant vous connecter à votre compte.
          </p>
        </div>

        <Link href="/auth/signin">
          <Button className="w-full">Se connecter</Button>
        </Link>
      </div>
    </div>
  )
}