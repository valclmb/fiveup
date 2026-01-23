"use client"
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
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v3";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormSchema = z.infer<typeof formSchema>;

const SignInForm = () => {


  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "valclmb.dev@gmail.com",
      password: "Test1234",
    },
  })

  const login = useMutation({
    mutationFn: async (data: FormSchema) => await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: '/dashboard',
    }),
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message)
      } else {
        toast.success('Connexion réussie. Vous êtes maintenant connecté.')
      }

    },
    onError: (error) => {
      console.log("error", error)
    }
  })

  const loginGoogle = useMutation({
    mutationFn: async () => await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard', errorCallbackURL: "/error" }),

  })

  const onSubmit = (data: FormSchema) => {
    login.mutate(data)
  }

  return (
    <AnimatedFade as="section"   >
      <form id="form-signin" className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
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
                  autoComplete="off" type="email"
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
                  autoComplete="current-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

        </FieldGroup>

        <Field orientation="horizontal">

          <Button type="submit" form="form-signin" className="w-full">
            {login.isPending ? <Spinner /> : 'Sign in'}
          </Button>
        </Field>
      </form>
      <div className="flex items-center justify-center gap-4 py-6">
        <Separator className="flex-1" />
        OU
        <Separator className="flex-1" />
      </div>



      <Button
        onClick={() => loginGoogle.mutate()}
        disabled={loginGoogle.isPending}
        variant="outline"
        className="w-full mb-4"
        type="button"
      >
        <Image src="/images/google-icon.svg" alt="Google" width={20} height={20} />
        {loginGoogle.isPending ? <Spinner /> : 'Continuer avec Google'}
      </Button>

      <Typography variant="description" className="text-right">New to FiveUp ?
        <Link href="signup" className={buttonVariants({ variant: "link", className: "px-2!" })}>Join now</Link>
      </Typography>
    </AnimatedFade>

  )
}
export default SignInForm;