"use client";

export type CustomizationPageLayoutProps = {
  /** Contenu de la colonne gauche (formulaire + actions Annuler/Valider). */
  content: React.ReactNode;
  /** Contenu de la colonne droite (preview avec onglets mobile/desktop, etc.). */
  preview: React.ReactNode;
};

/**
 * Layout commun pour les pages de personnalisation : formulaire à gauche, preview à droite.
 * Utilisé par Global Styles, Review Page, Feedback Page, Redirection Page.
 */
export function CustomizationPageLayout({ content, preview }: CustomizationPageLayoutProps) {
  return (
    <div className="flex w-full gap-4">
      <div className="flex flex-col items-end gap-4">{content}</div>
      <div className="flex-1 min-w-0">{preview}</div>
    </div>
  );
}
