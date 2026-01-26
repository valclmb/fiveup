import Typography from '@/components/ui/typography'
import ResetPasswordForm from '@/app/auth/reset-password/reset-password-form'
import { Suspense } from 'react'

function ResetPasswordFormSuspense() {
  return <ResetPasswordForm />
}

export default function ResetPasswordPage() {
  return (
    <>
      <Typography variant="h2" className="mb-2">Reset password</Typography>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordFormSuspense />
      </Suspense>
    </>
  )
}
