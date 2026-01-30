/**
 * Type des global styles (font, couleurs, coins).
 * Utilisé par : API global-styles, PreviewLayout, FeedbackForm, ReviewPagePreview, etc.
 */
export type GlobalStylesValues = {
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

export const DEFAULT_GLOBAL_STYLES: GlobalStylesValues = {
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
