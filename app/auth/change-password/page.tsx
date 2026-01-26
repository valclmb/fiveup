import Typography from '@/components/ui/typography'
import ChangePasswordForm from './change-password-form'
import { Suspense } from 'react'

function ChangePasswordFormSuspense() {
  return <ChangePasswordForm />
}

export default function ChangePasswordPage() {
  return (
    <>
      <Typography variant="h2" className="mb-2">Set up a New Password</Typography>
      <Typography variant="description" className="mb-6 text-muted-foreground">
        Your password must be different from your previous one.
      </Typography>
      <Suspense fallback={<div>Loading...</div>}>
        <ChangePasswordFormSuspense />
      </Suspense>
    </>
  )
}
