/**
 * Shared Trustpilot API types
 */

export interface TrustpilotAccountApi {
  id: string;
  businessUrl: string;
  businessDomain: string;
  companyName: string | null;
  trustScore: number | null;
  totalReviews: number | null;
  profileImageUrl: string | null;
  lastSyncAt: string | null;
  reviewsStored: number;
  canChangeDomain: boolean;
  daysUntilDomainChange: number;
  stats?: {
    total: number | null;
    one: number | null;
    two: number | null;
    three: number | null;
    four: number | null;
    five: number | null;
  };
}

export interface TrustpilotSyncApi {
  id: string;
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED";
  reviewsCount: number | null;
  startedAt: string;
  finishedAt: string | null;
  error: string | null;
}

export interface TrustpilotAccountResponse {
  connected: boolean;
  hasAccount: boolean;
  account?: TrustpilotAccountApi;
  latestSync?: TrustpilotSyncApi | null;
}

export interface TrustpilotConnectResponse {
  success: boolean;
  accountId?: string;
  syncId?: string;
  status: string;
  reviewsCount?: number;
  message?: string;
}

export interface TrustpilotStatusResponse {
  syncId: string;
  status: string;
  error?: string;
  reviewsCount?: number;
  startedAt?: string;
  finishedAt?: string;
}
