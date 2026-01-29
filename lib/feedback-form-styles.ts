/**
 * Styles du formulaire feedback (global styles).
 * Utilisé par : CustomizationPreview (aperçu) et la vraie page feedback (GET /api/global-styles).
 */
export type FeedbackFormStyles = {
  font: string;
  cornerRoundness: string;
  buttonCornerRoundness: string;
  borderColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  starsColor: string;
  bgColor: string;
  textColor: string;
  cardColor: string;
};

export const DEFAULT_FEEDBACK_FORM_STYLES: FeedbackFormStyles = {
  font: "inter",
  cornerRoundness: "md",
  buttonCornerRoundness: "md",
  borderColor: "#000000",
  buttonBgColor: "#000000",
  buttonTextColor: "#ffffff",
  starsColor: "#ffd230",
  bgColor: "#FFFFFF",
  textColor: "#000000",
  cardColor: "#FFFFFF",
};
