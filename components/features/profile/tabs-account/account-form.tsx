"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { patch } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
})

type FormSchema = z.infer<typeof formSchema>;

const AccountForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const queryClient = useQueryClient();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.name || "",
    },
  })

  // Mettre à jour le formulaire quand la session change
  useEffect(() => {
    if (user?.name) {
      form.reset({
        fullName: user.name,
      })
    }
  }, [user?.name, form])

  const updateUser = useMutation({
    mutationFn: (data: FormSchema) => patch("/auth/update-user", { name: data.fullName }),
    onSuccess: () => {
      toast.success("Profile updated successfully")
      setIsEditing(false)
      // Invalider la session pour recharger les données
      queryClient.invalidateQueries({ queryKey: ["session"] })
    },
    onError: (error) => {
      toast.error("Failed to update profile")
      console.error(error)
    },
  })

  const onSubmit = (data: FormSchema) => {
    updateUser.mutate(data)
  }

  if (isPending) return (
    <div className="space-y-5 mt-6">
      <div className="space-y-3">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-full h-8" />
      </div>
      <div className="space-y-3">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-full h-8" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="w-20 h-8" />
      </div>
    </div>
  )

  return (
    <form id="form-account" className="space-y-4 mt-6" onSubmit={form.handleSubmit(onSubmit)} >
      <fieldset disabled={!isEditing} >
        <FieldGroup className="gap-5">
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-account-fullname">
                  Full Name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-account-fullname"
                  aria-invalid={fieldState.invalid}
                  placeholder="John Doe"
                  autoComplete="on"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field >
            <FieldLabel htmlFor="form-account-fullname">
              Email
            </FieldLabel>
            <Input
              id="form-account-fullname"
              placeholder="John Doe"
              autoComplete="on"
              disabled
              value={user?.email || ""}
            />

          </Field>
        </FieldGroup>
      </fieldset >
      <div className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={(e) => {

                setIsEditing(false)
                form.reset()
              }}
              disabled={updateUser.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateUser.isPending}
            >
              {updateUser.isPending ? <Spinner /> : "Save changes"}
            </Button>
          </>
        ) : (
          <Button type="button" onClick={(e) => {
            e.preventDefault()
            setIsEditing(true)
          }}>Edit</Button>
        )}
      </div>
    </form >
  )
}

export default AccountForm;