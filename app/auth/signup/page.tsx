'use client'
import Typography from '@/components/ui/typography'
import Link from 'next/link'
import { useState } from 'react'
import SignUpForm from './signup-form'

export default function SignUpPage() {
  const [signupSuccess, setSignupSuccess] = useState(false);

  return (
    <>
      {!signupSuccess && (
        <Typography variant="h2" className="text-4xl mb-2">Sign up</Typography>
      )}
      <SignUpForm onSignupSuccess={setSignupSuccess} />
      {!signupSuccess && (
        <Typography variant="p" affects="mutedDescription" className="absolute bottom-0 text-sm text-center text-muted-foreground">
          By signing up to create an account I accept Company's <Link href="/terms-of-use" className="text-foreground hover:underline">Terms of use</Link> & <Link href="/privacy-policy" className="text-foreground hover:underline">Privacy Policy</Link>.
        </Typography>
      )}
    </>
  )
}