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

export type FeedbackFormContent = {
  title?: string;
  helpText?: { enabled: boolean; content: string };
  reviewTag?: { enabled: boolean; content: string };
  reviewTitle?: { enabled: boolean; content: string };
  reviewComment?: { enabled: boolean; content: string };
};

export type FeedbackFormProps = {
  styles: GlobalStylesValues;
  /** Contenu personnalisable (titre, helpText, reviewTag, reviewTitle, reviewComment). Si absent, affiche les valeurs par défaut. */
  content?: FeedbackFormContent;
};

const DEFAULT_TITLE = "Comment noteriez vous votre expérience ?";

/**
 * Contenu spécifique au formulaire feedback (titre, étoiles, champs, bouton).
 * À placer dans un PreviewLayout ou autre conteneur (ex. page feedback).
 */
export function FeedbackForm({ styles, content }: FeedbackFormProps) {
  const {
    font,
    cornerRoundness,
    buttonCornerRoundness,
    borderColor,
    buttonBgColor,
    buttonTextColor,
    starsColor,
  } = styles;

  const title = content?.title ?? DEFAULT_TITLE;
  const showHelpText = content?.helpText?.enabled && content.helpText.content;
  const showReviewTag = content?.reviewTag?.enabled;
  const showReviewTitle = content?.reviewTitle?.enabled;
  const showReviewComment = content?.reviewComment?.enabled;

  const fieldStyle = {
    borderRadius: CORNER_ROUNDNESS_PX[cornerRoundness] ?? CORNER_ROUNDNESS_PX[DEFAULT_CORNER_ROUNDNESS],
    borderColor,
  };

  return (
    <>
      <div className="min-w-0 space-y-2">
        <Typography variant="h2" style={{ fontFamily: font }} className="mb-2 min-w-0 text-2xl">
          {title}
        </Typography>
        <StarIcons
          starsCount={5}
          starsFilled={3}
          size={40}
          color={starsColor}
        />
        {showHelpText && content?.helpText && (
          <Typography variant="description" className="flex min-w-0 items-center gap-2" style={{ fontFamily: font }}>
            <Info size={18} /> {content.helpText.content}
          </Typography>
        )}
        {!content && (
          <Typography variant="description" className="flex min-w-0 items-center gap-2" style={{ fontFamily: font }}>
            <Info size={18} /> Lorem ipsum dollores dollores dollores
          </Typography>
        )}
      </div>
      <FieldGroup className="my-5 space-y-2">
        {showReviewTag && content?.reviewTag && (
          <Field>
            <FieldLabel>{content.reviewTag.content || "Tag / Sujet"}</FieldLabel>
            <Input placeholder={content.reviewTag.content || "Tag"} style={fieldStyle} />
          </Field>
        )}
        {showReviewTitle && content?.reviewTitle && (
          <Field>
            <FieldLabel>{content.reviewTitle.content || "Give a title to your review"}</FieldLabel>
            <Input
              placeholder={content.reviewTitle.content || "Give a title to your review"}
              style={fieldStyle}
            />
          </Field>
        )}
        {showReviewComment && content?.reviewComment && (
          <Field>
            <FieldLabel>{content.reviewComment.content || "Leave a comment"}</FieldLabel>
            <Textarea
              placeholder={content.reviewComment.content || "Leave a comment"}
              className="min-h-24 resize-none"
              style={fieldStyle}
            />
          </Field>
        )}
        {!content && (
          <>
            <Field>
              <FieldLabel>Give a title to your review</FieldLabel>
              <Input
                placeholder="Give a title to your review"
                style={fieldStyle}
              />
            </Field>
            <Field>
              <FieldLabel>Leave a comment</FieldLabel>
              <Textarea
                placeholder="Leave a comment"
                className="min-h-24 resize-none"
                style={fieldStyle}
              />
            </Field>
          </>
        )}
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
