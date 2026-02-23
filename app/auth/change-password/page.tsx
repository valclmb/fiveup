import Typography from '@/components/ui/typography'
import { Suspense } from 'react'
import ChangePasswordForm from './change-password-form'

function ChangePasswordFormSuspense() {
  return <ChangePasswordForm />
}

export default function ChangePasswordPage() {
  return (
    <>
      <Typography variant="h2" className="mb-2">Set up a New Password</Typography>
      <Typography variant="p" affects="muted" className="mb-6 text-muted-foreground">
        Your password must be different from your previous one.
      </Typography>
      <Suspense fallback={<div>Loading...</div>}>
        <ChangePasswordFormSuspense />
      </Suspense>
    </>
  )
}
