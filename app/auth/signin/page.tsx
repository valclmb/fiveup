import Typography from '@/components/ui/typography'
import SignInForm from './signin-form'

export default function SignInPage() {
  return (
    <>
      <Typography variant="h2" className="mb-2">Sign in</Typography>
      <SignInForm />
    </>
  )
}