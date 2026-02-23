"use client"
import { AnimatedFade } from "@/components/custom-ui/animated-fade";
import { PasswordInput } from "@/components/custom-ui/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import Typography from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v3";

const formSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

const ChangePasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Vérifier si le token est invalide ou expiré
  useEffect(() => {
    if (error === "INVALID_TOKEN") {
      toast.error("Invalid or expired token. Please request a new password reset.");
      router.push("/auth/reset-password");
    }
  }, [error, router]);

  const resetPassword = useMutation({
    mutationFn: async (data: FormSchema) => {
      if (!token) {
        throw new Error("Token is missing");
      }

      const result = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to reset password");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Password updated successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    },
    onError: (error: Error) => {
      console.log("error", error);
      toast.error(error.message || "Failed to reset password. Please try again.");
    },
  });

  const onSubmit = (data: FormSchema) => {
    if (!token) {
      toast.error("Token is missing. Please request a new password reset.");
      router.push("/auth/reset-password");
      return;
    }
    resetPassword.mutate(data);
  };

  if (!token && !error) {
    return (
      <AnimatedFade as="section">
        <Typography variant="p" affects="muted" className="text-center text-muted-foreground">
          No token provided. Please request a password reset.
        </Typography>
        <Button
          onClick={() => router.push("/auth/reset-password")}
          className="w-full mt-4"
        >
          Go to Reset Password
        </Button>
      </AnimatedFade>
    );
  }

  return (
    <AnimatedFade as="section">
      <form
        id="form-change-password"
        className="space-y-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="newPassword"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your new password"
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
                <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="confirmPassword"
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirm your new password"
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
          <Button
            type="submit"
            form="form-change-password"
            className="w-full"
            disabled={resetPassword.isPending || !token}
          >
            {resetPassword.isPending ? <Spinner /> : "Update Password"}
          </Button>
        </Field>
      </form>
    </AnimatedFade>
  );
};

export default ChangePasswordForm;
