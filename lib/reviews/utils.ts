/**
 * Shared utilities for reviews (Trustpilot + Google)
 */

const BATCH_SIZE = 50;

export function createBatchChunks<T>(
  array: T[],
  size: number = BATCH_SIZE
): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
