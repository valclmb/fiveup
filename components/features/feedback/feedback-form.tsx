"use client";

import { StarIcons } from "@/app/(landing)/components/star-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Typography from "@/components/ui/typography";
import type { FeedbackFormStyles } from "@/lib/feedback-form-styles";
import { Info } from "lucide-react";
import Image from "next/image";

const BORDER_RADIUS: Record<string, string> = {
  none: "0",
  sm: "6px",
  md: "10px",
  lg: "14px",
  rounded: "20px",
};

export type FeedbackFormBreakpoint = "mobile" | "desktop";

export type FeedbackFormProps = {
  styles: FeedbackFormStyles;
  logoUrl: string;
  /** Optionnel : className sur le CardContent (ex. pour la preview). */
  className?: string;
  /** Simule le breakpoint (ex. aperçu) : en mobile la carte n’a pas de bordure. */
  breakpoint?: FeedbackFormBreakpoint;
};

/**
 * Formulaire feedback réutilisable : aperçu personnalisation ou vraie page (styles depuis API).
 */
export function FeedbackForm({ styles, logoUrl, className, breakpoint }: FeedbackFormProps) {
  const {
    font,
    cornerRoundness,
    buttonCornerRoundness,
    borderColor,
    buttonBgColor,
    buttonTextColor,
    starsColor,
    bgColor,
    textColor,
    cardColor,
    blurMode = 0,
  } = styles;

  const isMobile = breakpoint === "mobile";

  return (
    <div
      className="w-full h-full flex justify-center items-center "
      style={{ backgroundColor: bgColor }}
    >
      <Card
        className={
          isMobile
            ? "w-full max-w-3xl max-h-max border-0 p-0 shadow-none"
            : "w-full max-w-3xl max-h-max border-1 p-0 shadow-none"
        }
        style={{
          backgroundColor: isMobile ? bgColor : cardColor,
          color: textColor,
          fontFamily: `var(--font-${font}), system-ui, sans-serif`,
          ...(isMobile ? {} : { borderColor }),
          borderRadius: BORDER_RADIUS[cornerRoundness] ?? BORDER_RADIUS.md,
        }}
      >
        <CardContent
          className={className}
        >
          <div className="flex items-center justify-center ">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt=""
                className="max-h-16 w-auto object-contain"
                width={100}
                height={100}
                unoptimized
              />
            ) : (
              <div className="flex max-h-16 items-center justify-center text-sm text-muted-foreground">
                Aucun logo
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <Typography variant="h2" className="mb-2 min-w-0 text-2xl">
              Comment noteriez vous votre expérience ?
            </Typography>
            <StarIcons
              starsCount={5}
              starsFilled={3}
              size={40}
              color={starsColor}
            />
            <Typography variant="description" className="flex min-w-0 items-center gap-2">
              <Info size={18} /> Lorem ipsum dollores dollores dollores
            </Typography>
          </div>
          <FieldGroup className="my-5 space-y-2">
            <Field>
              <FieldLabel>Donnez un titre à votre avis</FieldLabel>
              <Input
                placeholder="Titre"
                style={{
                  borderRadius: BORDER_RADIUS[cornerRoundness] ?? BORDER_RADIUS.md,
                  borderColor,
                }}
              />
            </Field>
            <Field>
              <FieldLabel>Laissez un commentaire</FieldLabel>
              <Textarea
                placeholder="Commentaire"
                className="min-h-24 resize-none"
                style={{
                  borderRadius: BORDER_RADIUS[cornerRoundness] ?? BORDER_RADIUS.md,
                  borderColor,
                }}
              />
            </Field>
          </FieldGroup>
          <Button
            className="w-full"
            style={{
              backgroundColor: buttonBgColor,
              color: buttonTextColor,
              borderRadius: BORDER_RADIUS[buttonCornerRoundness] ?? BORDER_RADIUS.md,
            }}
          >
            Envoyer mon retour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
