/**
 * One-time setup: creates the QStash schedule for daily review sync catchup.
 * Run after deploy: pnpm run setup:qstash
 *
 * Requires: QSTASH_TOKEN, BETTER_AUTH_URL or VERCEL_URL
 */
import { Client } from "@upstash/qstash";

async function main() {
  const token = process.env.QSTASH_TOKEN;
  if (!token) {
    console.error("QSTASH_TOKEN is required");
    process.exit(1);
  }

  const baseUrl =
    process.env.BETTER_AUTH_URL?.replace(/\/+$/, "") ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (!baseUrl) {
    console.error("BETTER_AUTH_URL or VERCEL_URL is required");
    process.exit(1);
  }

  const client = new Client({ token });
  const url = `${baseUrl}/api/reviews/sync-catchup`;

  try {
    await client.schedules.create({
      scheduleId: "reviews-sync-catchup",
      destination: url,
      cron: "0 3 * * *", // Every day at 3 AM UTC
    });
    console.log(
      "✅ QStash schedule 'reviews-sync-catchup' created successfully",
    );
    console.log(`   URL: ${url}`);
    console.log(`   Cron: 0 3 * * * (daily at 3 AM UTC)`);
  } catch (err) {
    console.error("Failed to create schedule:", err);
    process.exit(1);
  }
}

main();
