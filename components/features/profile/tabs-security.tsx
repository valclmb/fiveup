import { PasswordInput } from "@/components/custom-ui/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { TabsContent } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),

}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type FormSchema = z.infer<typeof formSchema>;

const TabsSecurity = () => {


  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })



  const changePassword = useMutation({
    mutationFn: async (data: FormSchema) => await authClient.changePassword({
      ...data,
      revokeOtherSessions: true,
    }),
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message)
      } else {
        toast.success('Password changed successfully')
        form.reset()
      }
    }
  })

  const onSubmit = (data: FormSchema) => {
    changePassword.mutate(data)
  }

  return <TabsContent value="security">
    <Typography variant="h3" className="mb-4">Security</Typography>
    <form id="form-security" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-security-current-password">
                Current Password
              </FieldLabel>
              <PasswordInput
                {...field}
                id="form-security-current-password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your current password"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-security-new-password">
                New Password
              </FieldLabel>
              <PasswordInput
                {...field}
                id="form-security-new-password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your new password"
                autoComplete="off"
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
              <FieldLabel htmlFor="form-security-confirm-new-password">
                Confirm New Password
              </FieldLabel>
              <PasswordInput
                {...field}
                id="form-security-confirm-new-password"
                aria-invalid={fieldState.invalid}
                placeholder="Confirm your new password"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />


      </FieldGroup>
      <Field orientation="horizontal" className="mt-4 flex justify-end">
        <Button type="submit" form="form-security" disabled={changePassword.isPending}>
          {changePassword.isPending ? <Spinner /> : 'Change Password'}
        </Button>
      </Field>
    </form>

  </TabsContent>
}

export default TabsSecurity;