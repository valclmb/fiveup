"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ImageIcon, ImageUp, XIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const dataTransfer = new DataTransfer();
  Array.from(event.target.files ?? []).forEach((image) =>
    dataTransfer.items.add(image)
  );
  const files = dataTransfer.files;
  const first = event.target.files?.[0];
  const displayUrl = first ? URL.createObjectURL(first) : "";
  return { files, displayUrl };
}

export type ImageInputVariant = "avatar" | "logo";

export type ImageInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange"
> & {
  value?: FileList | null;
  onChange?: (files: FileList) => void;
  variant?: ImageInputVariant;
  /** En mode avatar : "circle" (rond) ou "square" (carré). Ignoré en mode logo. */
  shape?: "circle" | "square";
  /** En mode logo : ratio type "video" (16/9), "square", ou nombre (ex: 2 = 2/1). Défaut "video". */
  aspectRatio?: "video" | "square" | number;
  /** Texte du fallback quand aucune image (avatar). */
  fallbackText?: string;
  /** Largeur/h hauteur de la preview. Ex: "w-24 h-24" (avatar), "w-40 h-24" (logo). */
  previewClassName?: string;
  /** Appelé avec l’URL de prévisualisation (blob) quand une image est choisie, ou "" quand effacée. Permet d’afficher l’image ailleurs (ex. preview). */
  onPreviewChange?: (url: string) => void;
  /** URL à afficher quand aucun fichier n’est sélectionné (ex. logo déjà enregistré). */
  defaultPreviewUrl?: string | null;
  /** Appelé avec le fichier sélectionné (premier uniquement). Utile pour upload immédiat (ex. R2) puis mise à jour de defaultPreviewUrl. */
  onFileSelect?: (file: File) => void;
  /** Appelé quand l'utilisateur clique sur le bouton supprimer (croix). Permet de nettoyer côté parent (ex. supprimer le logo en DB). */
  onClear?: () => void;
  /** Affiche un état de chargement sur le bouton supprimer (ex. pendant la suppression en DB). */
  clearLoading?: boolean;
};

export function ImageInput({
  value,
  onChange,
  variant = "avatar",
  shape = "circle",
  aspectRatio = "video",
  fallbackText,
  previewClassName,
  onPreviewChange,
  defaultPreviewUrl,
  onFileSelect,
  onClear,
  clearLoading,
  className,
  id,
  ...inputProps
}: ImageInputProps) {
  const [preview, setPreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = "";
    setPreview("");
    onPreviewChange?.("");
    const empty = new DataTransfer();
    onChange?.(empty.files);
    onClear?.();
  };

  useEffect(() => {
    if (!value?.length) {
      setPreview("");
      onPreviewChange?.("");
    }
  }, [value, onPreviewChange]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files, displayUrl } = getImageData(event);
    const first = event.target.files?.[0];
    setPreview(displayUrl);
    onPreviewChange?.(displayUrl);
    if (first) onFileSelect?.(first);
    onChange?.(files);
  };

  const displayUrl = preview || defaultPreviewUrl || "";

  const triggerInput = () => inputRef.current?.click();

  const isAvatar = variant === "avatar";
  const aspectClass =
    variant === "logo"
      ? aspectRatio === "square"
        ? "aspect-square"
        : aspectRatio === "video"
          ? "aspect-video"
          : typeof aspectRatio === "number"
            ? undefined
            : "aspect-video"
      : undefined;

  const logoStyle =
    variant === "logo" && typeof aspectRatio === "number"
      ? { aspectRatio: `${aspectRatio} / 1` }
      : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        id={id}
        onChange={handleChange}
        {...inputProps}
      />

      <div className="relative w-fit">
        <button
          type="button"
          onClick={triggerInput}
          className={cn(
            "group relative flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-input-border bg-muted/30 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
            isAvatar && shape === "circle" && "rounded-full",
            variant === "avatar" && "w-24 h-24 shrink-0",
            variant === "logo" && "w-full min-h-50 max-w-xs",
            aspectClass,
            previewClassName
          )}
          style={logoStyle}
        >
          {displayUrl ? (
            <>
              {isAvatar ? (
                <Avatar
                  className={cn(
                    "h-full w-full",
                    shape === "square" && "rounded-lg"
                  )}
                >
                  <AvatarImage
                    src={displayUrl}
                    className={shape === "square" ? "rounded-lg" : undefined}
                  />
                  <AvatarFallback>{fallbackText ?? "?"}</AvatarFallback>
                </Avatar>
              ) : (
                <img
                  src={displayUrl}
                  alt=""
                  className={cn(
                    "h-full w-full object-contain",
                    aspectClass
                  )}
                  style={logoStyle}
                />
              )}
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100",
                  isAvatar && shape === "circle" && "rounded-full"
                )}
                aria-hidden
              >
                <ImageUp className="text-secondary-foreground size-8" />
              </span>
            </>
          ) : (
            <span className="text-muted-foreground flex flex-col items-center gap-1 text-xs">
              <ImageIcon className="size-6" />
              {variant === "avatar" ? "Photo" : "Logo"}
            </span>
          )}
        </button>
        {displayUrl ? (
          <button
            type="button"
            onClick={handleClear}
            disabled={clearLoading}
            aria-label="Remove image"
            className={cn(
              "absolute -right-1 -top-1 z-10 flex size-6 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              isAvatar && shape === "circle" && "right-0 top-0"
            )}
          >
            <XIcon className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
