"use client";

import { StarIcons } from "@/app/(landing)/components/star-icon";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Typography from "@/components/ui/typography";
import { CORNER_ROUNDNESS_PX, DEFAULT_CORNER_ROUNDNESS } from "@/lib/corner-roundness";
import type { GlobalStylesValues } from "@/lib/global-styles-values";
import { Info } from "lucide-react";

export type FeedbackFormProps = {
  styles: GlobalStylesValues;
};

/**
 * Contenu spécifique au formulaire feedback (titre, étoiles, champs, bouton).
 * À placer dans un PreviewLayout ou autre conteneur (ex. page feedback).
 */
export function FeedbackForm({ styles }: FeedbackFormProps) {
  const {
    font,
    cornerRoundness,
    buttonCornerRoundness,
    borderColor,
    buttonBgColor,
    buttonTextColor,
    starsColor,
  } = styles;

  return (
    <>
      <div className="min-w-0 space-y-2">
        <Typography variant="h2" style={{ fontFamily: font }} className="mb-2 min-w-0 text-2xl">
          Comment noteriez vous votre expérience ?
        </Typography>
        <StarIcons
          starsCount={5}
          starsFilled={3}
          size={40}
          color={starsColor}
        />
        <Typography variant="description" className="flex min-w-0 items-center gap-2" style={{ fontFamily: font }}>
          <Info size={18} /> Lorem ipsum dollores dollores dollores
        </Typography>
      </div>
      <FieldGroup className="my-5 space-y-2">
        <Field>
          <FieldLabel>Donnez un titre à votre avis</FieldLabel>
          <Input
            placeholder="Titre"
            style={{
              borderRadius: CORNER_ROUNDNESS_PX[cornerRoundness] ?? CORNER_ROUNDNESS_PX[DEFAULT_CORNER_ROUNDNESS],
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
              borderRadius: CORNER_ROUNDNESS_PX[cornerRoundness] ?? CORNER_ROUNDNESS_PX[DEFAULT_CORNER_ROUNDNESS],
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
          borderRadius: CORNER_ROUNDNESS_PX[buttonCornerRoundness] ?? CORNER_ROUNDNESS_PX[DEFAULT_CORNER_ROUNDNESS],
        }}
      >
        Envoyer mon retour
      </Button>
    </>
  );
}
