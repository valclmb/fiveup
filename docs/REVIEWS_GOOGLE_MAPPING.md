# Mapping Google Maps Reviews → Unified Review Format

## Champs mappés

| Champ unifié | Google (Apify) | Trustpilot |
|--------------|----------------|------------|
| sourceId | reviewId | id |
| rating | stars (1-5) | rating |
| title | **null** (non disponible) | title |
| text | text | text |
| language | originalLanguage | language |
| authorName | name | consumer.displayName |
| authorImageUrl | reviewerPhotoUrl | consumer.imageUrl |
| authorCountry | countryCode | consumer.countryCode |
| isVerified | isLocalGuide | labels.verification.isVerified |
| experiencedAt | **null** (visité en = string) | dates.experiencedDate |
| publishedAt | publishedAtDate | dates.publishedDate |
| replyText | responseFromOwnerText | reply.message |
| replyPublishedAt | responseFromOwnerDate | reply.publishedDate |
| reviewUrl | reviewUrl | calculé |

## Données Google non mappées (dans sourceMetadata)

- `reviewImageUrls` – images attachées à l’avis
- `textTranslated` – texte traduit
- `likesCount` – nombre de likes
- `reviewerNumberOfReviews` – nombre d’avis du reviewer
- `visitedIn` – ex. "Visited in January" (string)
- `isLocalGuide` – badge Local Guide

## Données manquantes côté Google

1. **title** – Les avis Google n’ont pas de titre séparé (contrairement à Trustpilot).
2. **experiencedAt** – Google fournit uniquement `visitedIn` (ex. "Visited in January", "Visited in December 2025") sans date précise.

## Prochaines étapes pour intégrer Google

1. Créer une route `/api/reviews/google/connect` pour définir les placeIds.
2. Intégrer le scraper Apify `compass~google-maps-reviews-scraper`.
3. Implémenter le mapping avec `parseGoogleReviewFromApify` dans `lib/reviews/google-mapper.ts`.
4. Adapter la page reviews pour afficher Trustpilot et Google (filtre par source).
