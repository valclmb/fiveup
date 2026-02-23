"use client"
import { AnimatedFade } from "@/components/custom-ui/animated-fade";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import Typography from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v3";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormSchema = z.infer<typeof formSchema>;

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: emailFromUrl || "",
    },
  });

  // Mettre à jour l'email si il change dans l'URL
  useEffect(() => {
    if (emailFromUrl) {
      form.setValue("email", emailFromUrl);
    }
  }, [emailFromUrl, form]);

  const sendResetInstructions = useMutation({
    mutationFn: async (data: FormSchema) => {
      const redirectTo = typeof window !== "undefined"
        ? `${window.location.origin}/auth/change-password`
        : "/auth/change-password";

      const result = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to send reset instructions");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Reset instructions sent! Check your email.");
      form.reset();
    },
    onError: (error: Error) => {
      console.log("error", error);
      toast.error(error.message || "Failed to send reset instructions. Please try again.");
    },
  });

  const onSubmit = (data: FormSchema) => {
    sendResetInstructions.mutate(data);
  };

  return (
    <AnimatedFade as="section">
      <form
        id="form-reset-password"
        className="space-y-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email"
                  autoComplete="email"
                  type="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Field orientation="horizontal">
          <Button
            type="submit"
            form="form-reset-password"
            className="w-full"
            disabled={sendResetInstructions.isPending}
          >
            {sendResetInstructions.isPending ? (
              <Spinner />
            ) : (
              "Send reset instructions"
            )}
          </Button>
        </Field>
      </form>

      <Typography variant="p" affects="muted" className="text-center mt-6">
        Remember your password?{" "}
        <Link
          href="/auth/signin"
          className={buttonVariants({ variant: "link", className: "px-2!" })}
        >
          Sign in
        </Link>
      </Typography>
    </AnimatedFade>
  );
};

export default ResetPasswordForm;
