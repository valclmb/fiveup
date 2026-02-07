/**
 * Apify API client for Trustpilot scraping
 */

import { TRUSTPILOT_CONSTANTS } from "@/lib/reviews/trustpilot/constants";

const APIFY_BASE_URL = "https://api.apify.com/v2";
const APIFY_ACTOR_ID = "memo23~trustpilot-scraper-ppe";

export interface ApifyRunResponse {
  data: {
    id: string;
    status: string;
    startedAt: string;
    finishedAt?: string;
    defaultDatasetId: string;
    defaultKeyValueStoreId: string;
  };
}

export interface ApifyRunStatus {
  data: {
    id: string;
    status: "READY" | "RUNNING" | "SUCCEEDED" | "FAILED" | "ABORTING" | "ABORTED" | "TIMING-OUT" | "TIMED-OUT";
    startedAt: string;
    finishedAt?: string;
    defaultDatasetId: string;
  };
}

export interface TrustpilotReviewData {
  id: string;
  rating: number;
  title?: string;
  text?: string;
  language?: string;
  dates?: {
    experiencedDate?: string;
    publishedDate?: string;
    updatedDate?: string;
  };
  consumer?: {
    displayName?: string;
    countryCode?: string;
    imageUrl?: string;
  };
  labels?: {
    verification?: {
      isVerified?: boolean;
    };
  };
  reply?: {
    message?: string;
    publishedDate?: string;
  };
}

export interface TrustpilotCompanyData {
  displayName?: string;
  trustScore?: number;
  numberOfReviews?: number;
  profileImageUrl?: string;
  identifyingName?: string;
}

export interface TrustpilotStatsData {
  total?: number;
  one?: number;
  two?: number;
  three?: number;
  four?: number;
  five?: number;
}

export interface ApifyDatasetItem {
  company?: TrustpilotCompanyData;
  stats?: TrustpilotStatsData;
  // Review fields (when it's a review item)
  id?: string;
  rating?: number;
  title?: string;
  text?: string;
  language?: string;
  dates?: {
    experiencedDate?: string;
    publishedDate?: string;
  };
  consumer?: {
    displayName?: string;
    countryCode?: string;
    imageUrl?: string;
  };
  labels?: {
    verification?: {
      isVerified?: boolean;
    };
  };
  reply?: {
    message?: string;
    publishedDate?: string;
  };
}

function getApifyToken(): string {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured");
  }
  return token;
}

/**
 * Start an Apify run to scrape Trustpilot reviews
 */
export async function startTrustpilotScrape(
  businessUrl: string,
  options?: {
    maxItems?: number;
    newerThan?: Date;
  }
): Promise<ApifyRunResponse> {
  const token = getApifyToken();

  // Calculate date filter (default: last year)
  const lookbackMs =
    TRUSTPILOT_CONSTANTS.DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const newerThan =
    options?.newerThan ?? new Date(Date.now() - lookbackMs);
  const newerThanStr = newerThan.toISOString().split("T")[0]; // YYYY-MM-DD

  const input = {
    startUrls: [{ url: businessUrl }],
    maxConcurrency: 10,
    minConcurrency: 1,
    maxRequestRetries: 100,
    scrapeAllReviews: true,
    includeCompanyDetails: true,
    includeStatistics: true,
    includeStats: true,
    maxItems: options?.maxItems ?? TRUSTPILOT_CONSTANTS.DEFAULT_MAX_ITEMS,
    newerThan: newerThanStr,
  };

  const response = await fetch(
    `${APIFY_BASE_URL}/acts/${APIFY_ACTOR_ID}/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Apify API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Get the status of an Apify run
 */
export async function getApifyRunStatus(runId: string): Promise<ApifyRunStatus> {
  const token = getApifyToken();

  const response = await fetch(
    `${APIFY_BASE_URL}/actor-runs/${runId}?token=${token}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Apify API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Get the results from an Apify dataset
 */
export async function getApifyDatasetItems(
  datasetId: string
): Promise<ApifyDatasetItem[]> {
  const token = getApifyToken();

  const response = await fetch(
    `${APIFY_BASE_URL}/datasets/${datasetId}/items?token=${token}&format=json`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Apify API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Delete an Apify dataset (to save storage costs)
 */
export async function deleteApifyDataset(datasetId: string): Promise<void> {
  const token = getApifyToken();

  const response = await fetch(
    `${APIFY_BASE_URL}/datasets/${datasetId}?token=${token}`,
    { method: "DELETE" }
  );

  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    console.error(`Failed to delete Apify dataset: ${error}`);
  }
}

/**
 * Extract domain from Trustpilot URL
 */
export function extractDomainFromUrl(url: string): string {
  // Handle different URL formats
  // https://trustpilot.com/review/example.com → example.com
  // https://fr.trustpilot.com/review/example.com → example.com
  // example.com → example.com

  const trustpilotMatch = url.match(/trustpilot\.com\/review\/([^/?#]+)/i);
  if (trustpilotMatch) {
    return trustpilotMatch[1];
  }

  // Remove protocol and www
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
}

/**
 * Normalize Trustpilot URL to standard format
 */
export function normalizeTrustpilotUrl(input: string): string {
  const domain = extractDomainFromUrl(input);
  return `https://www.trustpilot.com/review/${domain}`;
}

// ============ GOOGLE MAPS REVIEWS SCRAPER ============

const GOOGLE_MAPS_ACTOR_ID = "compass~google-maps-reviews-scraper";

const GOOGLE_DEFAULT_MAX_REVIEWS = 500;
const GOOGLE_DEFAULT_LOOKBACK = "1 year";

/**
 * Start an Apify run to scrape Google Maps reviews
 */
export async function startGoogleMapsScrape(
  placeIds: string[],
  options?: {
    maxReviews?: number;
    reviewsStartDate?: string;
  }
): Promise<ApifyRunResponse> {
  const token = getApifyToken();

  const input = {
    placeIds,
    maxReviews: options?.maxReviews ?? GOOGLE_DEFAULT_MAX_REVIEWS,
    reviewsStartDate: options?.reviewsStartDate ?? GOOGLE_DEFAULT_LOOKBACK,
    personalData: true,
    reviewsOrigin: "google",
  };

  const response = await fetch(
    `${APIFY_BASE_URL}/acts/${GOOGLE_MAPS_ACTOR_ID}/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Apify Google API error: ${response.status} - ${error}`);
  }

  return response.json();
}
