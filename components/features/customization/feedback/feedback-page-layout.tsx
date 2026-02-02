"use client";

import { StarIcons } from "@/app/(landing)/components/star-icon";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Typography from "@/components/ui/typography";
import { CORNER_ROUNDNESS_PX, DEFAULT_CORNER_ROUNDNESS } from "@/lib/corner-roundness";
import type { GlobalStylesValues } from "@/lib/global-styles-values";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export type FeedbackPageLayoutContent = {
  title?: string;
  helpText?: { enabled: boolean; content: string };
  reviewTag?: { enabled: boolean; content: string; options?: string[] };
  /** Liste des sujets (chips) quand reviewTag est activé. Peut être dans reviewTag.options ou à la racine. */
  reviewTagOptions?: string[];
  reviewTitle?: { enabled: boolean; content: string };
  reviewComment?: { enabled: boolean; content: string };
};

export type FeedbackPageLayoutProps = {
  styles: GlobalStylesValues;
  /** Contenu personnalisable (titre, helpText, reviewTag, reviewTitle, reviewComment). Si absent, affiche les valeurs par défaut. */
  content?: FeedbackPageLayoutContent;
};

const DEFAULT_TITLE = "Comment noteriez vous votre expérience ?";

/**
 * Layout / contenu de la page feedback (titre, étoiles, champs, bouton).
 * À placer dans un PreviewLayout ou autre conteneur (ex. page feedback).
 */
export function FeedbackPageLayout({ styles, content }: FeedbackPageLayoutProps) {
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
      <FieldGroup className="my-4 gap-6">
        {showReviewTag && content?.reviewTag && (
          <Field>
            <FieldLabel>{content.reviewTag.content || "What is the main subject of your feedback?"}</FieldLabel>
            {(() => {
              const options = content.reviewTag.options ?? content.reviewTagOptions ?? [];
              return options.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {options.map((option, i) => (
                    <button
                      key={i}
                      type="button"
                      className={cn(
                        "rounded-lg border px-2 py-1 text-xs transition-colors",
                        "border-border hover:bg-muted/50"
                      )}
                      style={{
                        borderRadius: CORNER_ROUNDNESS_PX[cornerRoundness] ?? CORNER_ROUNDNESS_PX[DEFAULT_CORNER_ROUNDNESS],
                        borderColor,
                      }}
                    >
                      {option || `Subject ${i + 1}`}
                    </button>
                  ))}
                </div>
              ) : (
                <Input
                  placeholder={content.reviewTag.content || "Tag"}
                  style={fieldStyle}
                />
              );
            })()}
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
        Send my feedback
      </Button>
    </>
  );
}
