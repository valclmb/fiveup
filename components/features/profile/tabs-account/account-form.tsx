"use client"

import { ImageInput } from "@/components/custom-ui/image-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { AVATAR_QUERY_KEY, useUserAvatarUrl } from "@/hooks/use-user-avatar-url";
import { authClient } from "@/lib/auth-client";
import { deleteOne, post } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
})

type FormSchema = z.infer<typeof formSchema>;

const AccountForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const { data: session, isPending, refetch: refetchSession } = authClient.useSession();
  const user = session?.user;
  const queryClient = useQueryClient();
  const displayAvatarUrl = useUserAvatarUrl(user);

  const avatarUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set("file", file);
      return post("profile/avatar", formData, true);
    },
    onSuccess: (data) => {
      setAvatarPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return data.url;
      });
      queryClient.setQueryData(AVATAR_QUERY_KEY, { avatarUrl: data.url });
      refetchSession();
      toast.success("Avatar mis à jour");
    },
  });

  const avatarDeleteMutation = useMutation({
    mutationFn: () => deleteOne("profile/avatar", ""),
    onSuccess: () => {
      setAvatarPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });
      queryClient.invalidateQueries({ queryKey: AVATAR_QUERY_KEY });
      refetchSession();
      toast.success("Avatar supprimé");
    },
  });

  const onAvatarPreviewChange = useCallback((url: string) => {
    setAvatarPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url || null;
    });
  }, []);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.name || "",
    },
  })

  useEffect(() => {
    if (user?.name) {
      form.reset({
        fullName: user.name,
      })
    }
  }, [user?.name, form])

  const updateUser = useMutation({
    mutationFn: (data: FormSchema) => post("/auth/update-user", { name: data.fullName }),
    onSuccess: () => {
      toast.success("Profile updated successfully")
      setIsEditing(false)
      refetchSession();
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
      <Skeleton className="size-24 rounded-full shrink-0" />
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
      <div className="space-y-5">
        <ImageInput
          variant="avatar"
          shape="circle"
          fallbackText={user?.name?.charAt(0) ?? "?"}
          defaultPreviewUrl={avatarPreviewUrl ?? displayAvatarUrl ?? undefined}
          onPreviewChange={onAvatarPreviewChange}
          onFileSelect={(file) => avatarUploadMutation.mutate(file)}
          onClear={() => avatarDeleteMutation.mutate()}
          clearLoading={avatarDeleteMutation.isPending}
        />
        <fieldset disabled={!isEditing} className="space-y-5">
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
              <FieldLabel htmlFor="form-account-email">
                Email
              </FieldLabel>
              <Input
                id="form-account-email"
                placeholder="john@example.com"
                autoComplete="on"
                disabled
                value={user?.email || ""}
              />

            </Field>
          </FieldGroup>
        </fieldset>
      </div>
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