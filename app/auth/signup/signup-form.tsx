
import { AnimatedFade } from "@/components/custom-ui/animated-fade";
import { PasswordInput } from "@/components/custom-ui/password-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Typography from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { z } from "zod/v3";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type FormSchema = z.infer<typeof formSchema>;

interface SignUpFormProps {
  onSignupSuccess?: (success: boolean) => void;
}

const SignUpForm = ({ onSignupSuccess }: SignUpFormProps = {}) => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const selectedPlan = searchParams.get('plan') || 'pro' // Plan choisi depuis /pricing
  
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "Matteo",
      email: "matteo@fiveup-review.com",
      password: "",
      confirmPassword: "",
    },
  })

  const signup = useMutation({
    mutationFn: async (data: FormSchema) => authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.fullName,
      callbackURL: '/dashboard', // Redirige vers le dashboard après vérification d'email
    }),
    onSuccess: async (data) => {
      console.log('Signup response:', data);
      
      if (data.error) {
        toast.error(data.error.message || 'Une erreur est survenue lors de la création du compte');
        return;
      }

      // Compte créé avec succès - afficher le message de confirmation
      const email = data.data?.user?.email || form.getValues('email');
      setUserEmail(email);
      setSignupSuccess(true);
      onSignupSuccess?.(true); // Informer la page parent
      
      toast.success('Compte créé !', {
        description: 'Un email de vérification a été envoyé.',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error('Signup error:', error);
      const errorMessage = error?.message || error?.error?.message || 'Une erreur est survenue lors de la création du compte';
      toast.error(errorMessage);
    },
  })

  const signupGoogle = useMutation({
    mutationFn: async () => await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard', errorCallbackURL: "/error" }),

  })

  const onSubmit = (data: FormSchema) => {
    signup.mutate(data)
  }

  // Afficher le message de confirmation si l'inscription a réussi
  if (signupSuccess) {
    return (
      <AnimatedFade as="section">
        <div className="space-y-8 text-center">
          {/* Icône email */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          {/* Titre et message */}
          <div className="space-y-4">
            <Typography variant="h2" className="text-2xl md:text-3xl text-center">
              Confirm your email
            </Typography>
            <Typography variant="description" className="text-base">
              We just sent you an email to
            </Typography>
            {userEmail && (
              <Typography variant="p" className="text-lg font-semibold text-primary break-all">
                {userEmail}
              </Typography>
            )}
            <Typography variant="description" className="text-sm">
              Click the link in the email to activate your account.
            </Typography>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <Link href="/auth/signin" className="block">
              <Button className="w-full">
                Go to sign in page
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Back to home
              </Button>
            </Link>
          </div>

          {/* Message d'aide */}
          <div className="pt-4 border-t border-border">
            <Typography variant="description" className="text-xs">
              Didn't receive the email? Check your spam folder or{' '}
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                sign in
              </Link>{' '}
              to request a new one.
            </Typography>
          </div>
        </div>
      </AnimatedFade>
    );
  }

  // Afficher le formulaire d'inscription normal
  return (
    <AnimatedFade as="section">
      <form id="form-signup" className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fullName">
                  Full Name
                </FieldLabel>
                <Input
                  {...field}
                  id="fullName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email"
                  autoComplete="email" type="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {form.watch("password") && <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id="confirmPassword"
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />}
        </FieldGroup>

        <Field orientation="horizontal">
          <Button type="submit" form="form-signup" className="w-full">
            {signup.isPending ? <Spinner /> : 'Sign up'}
          </Button>
        </Field>
      </form>
      <div className="flex items-center justify-center gap-4 py-6">
        <Separator className="flex-1" />
        OR
        <Separator className="flex-1" />
      </div>
      <Button
        onClick={() => signupGoogle.mutate()}
        disabled={signupGoogle.isPending}
        variant="outline"
        className="w-full mb-4"
        type="button"
      >
        <Image src="/images/google-icon.svg" alt="Google" width={20} height={20} />
        {signupGoogle.isPending ? <Spinner /> : 'Continuer avec Google'}
      </Button>

      <Typography variant="description" className="text-right">Already have an account?
        <Link href="/auth/signin" className={buttonVariants({ variant: "link", className: "px-2!" })}>Sign in</Link>
      </Typography>
    </AnimatedFade>
  )
}
export default SignUpForm;