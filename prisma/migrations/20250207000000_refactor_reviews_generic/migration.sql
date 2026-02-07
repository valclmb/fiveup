-- CreateEnum
CREATE TYPE "ReviewSource" AS ENUM ('TRUSTPILOT', 'GOOGLE');

-- CreateTable
CREATE TABLE "review_account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" "ReviewSource" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT,
    "businessUrl" TEXT,
    "isConnected" BOOLEAN NOT NULL DEFAULT true,
    "trustScore" DOUBLE PRECISION,
    "totalReviews" INTEGER,
    "profileImageUrl" TEXT,
    "statsTotal" INTEGER,
    "statsOne" INTEGER,
    "statsTwo" INTEGER,
    "statsThree" INTEGER,
    "statsFour" INTEGER,
    "statsFive" INTEGER,
    "lastSyncAt" TIMESTAMP(3),
    "lastDomainChangeAt" TIMESTAMP(3),
    "sourceMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_sync" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "apifyRunId" TEXT,
    "apifyDatasetId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "reviewsCount" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "review_sync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "source" "ReviewSource" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "text" TEXT,
    "language" TEXT,
    "authorName" TEXT,
    "authorImageUrl" TEXT,
    "authorCountry" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "experiencedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "replyText" TEXT,
    "replyPublishedAt" TIMESTAMP(3),
    "reviewUrl" TEXT,
    "sourceMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- Migrate data from trustpilot_* to review_* (if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trustpilot_account') THEN
    INSERT INTO "review_account" (
      "id", "userId", "source", "sourceId", "name", "businessUrl", "isConnected",
      "trustScore", "totalReviews", "profileImageUrl", "statsTotal", "statsOne", "statsTwo",
      "statsThree", "statsFour", "statsFive", "lastSyncAt", "lastDomainChangeAt",
      "createdAt", "updatedAt"
    )
    SELECT "id", "userId", 'TRUSTPILOT'::"ReviewSource", "businessDomain",
      "companyName", "businessUrl", "isConnected", "trustScore", "totalReviews",
      "profileImageUrl", "statsTotal", "statsOne", "statsTwo", "statsThree",
      "statsFour", "statsFive", "lastSyncAt", "lastDomainChangeAt",
      "createdAt", "updatedAt"
    FROM "trustpilot_account";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trustpilot_sync') THEN
    INSERT INTO "review_sync" (
      "id", "accountId", "apifyRunId", "apifyDatasetId", "status", "error",
      "reviewsCount", "startedAt", "finishedAt"
    )
    SELECT "id", "accountId", "apifyRunId", "apifyDatasetId", "status", "error",
      "reviewsCount", "startedAt", "finishedAt"
    FROM "trustpilot_sync";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trustpilot_review') THEN
    INSERT INTO "review" (
      "id", "accountId", "source", "sourceId", "rating", "title", "text",
      "language", "authorName", "authorImageUrl", "authorCountry", "isVerified",
      "experiencedAt", "publishedAt", "replyText", "replyPublishedAt",
      "createdAt", "updatedAt"
    )
    SELECT "id", "accountId", 'TRUSTPILOT'::"ReviewSource", "trustpilotId", "rating",
      "title", "text", "language", "authorName", "authorImageUrl", "authorCountry",
      "isVerified", "experiencedAt", "publishedAt", "replyText", "replyPublishedAt",
      "createdAt", "updatedAt"
    FROM "trustpilot_review";
  END IF;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX "review_account_userId_source_key" ON "review_account"("userId", "source");
CREATE INDEX "review_account_userId_idx" ON "review_account"("userId");
CREATE INDEX "review_sync_accountId_idx" ON "review_sync"("accountId");
CREATE INDEX "review_sync_status_idx" ON "review_sync"("status");
CREATE UNIQUE INDEX "review_accountId_sourceId_key" ON "review"("accountId", "sourceId");
CREATE INDEX "review_accountId_idx" ON "review"("accountId");
CREATE INDEX "review_source_idx" ON "review"("source");
CREATE INDEX "review_rating_idx" ON "review"("rating");
CREATE INDEX "review_publishedAt_idx" ON "review"("publishedAt");

-- AddForeignKey
ALTER TABLE "review_account" ADD CONSTRAINT "review_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "review_sync" ADD CONSTRAINT "review_sync_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "review_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "review" ADD CONSTRAINT "review_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "review_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable (only if they exist - for fresh installs they might not)
DROP TABLE IF EXISTS "trustpilot_review";
DROP TABLE IF EXISTS "trustpilot_sync";
DROP TABLE IF EXISTS "trustpilot_account";
