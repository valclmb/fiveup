
import { AnimatedFade } from "@/components/custom-ui/animated-fade";
import { PasswordInput } from "@/components/custom-ui/password-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Typography from "@/components/ui/typography";
import { post } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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

const SignUpForm = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "Matteo",
      email: "matteo@fiveup-review.com",
      password: "Cinqetoiles69@",
      confirmPassword: "Cinqetoiles69@",
    },
  })

  const signup = useMutation({
    mutationFn: async (data: FormSchema) => post("/auth/signup", data),
    onSuccess: (data) => {
      console.log(data);
      // if (data.signIn?.ok) {
      //   // Connexion réussie → redirect
      //   window.location.href = callbackUrl
      // } else {
      //   // Compte créé mais email non vérifié → rediriger vers page de vérification
      //   // ou afficher un message
      //   console.log('Compte créé. Vérifiez votre email pour vous connecter.')
      // }
    },
    onError: (error) => {
      console.log("error", error)
      // Afficher l'erreur dans le formulaire si besoin
    },
  })

  const signupGoogle = useMutation({
    mutationFn: () => signIn('google', { callbackUrl }),
  })

  const onSubmit = (data: FormSchema) => {
    signup.mutate(data)
  }

  return (
    <AnimatedFade as="section"   >
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
          <Controller
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
          />
        </FieldGroup>

        <Field orientation="horizontal">
          <Button type="submit" form="form-signup" className="w-full">
            {signup.isPending ? <Spinner /> : 'Sign up'}
          </Button>
        </Field>
      </form>
      <div className="flex items-center justify-center gap-4 py-6">
        <Separator className="flex-1" />
        OU
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