/**
 * Shared cooldown logic for review source changes (Trustpilot domain, Google place)
 */

import { REVIEWS_CONSTANTS } from "./constants";

export interface CooldownStatus {
  canChange: boolean;
  daysUntilChange: number;
  daysSinceLastChange: number;
}

export function getCooldownStatus(
  lastChangeAt: Date | null,
  createdAt: Date,
  cooldownDays = REVIEWS_CONSTANTS.SOURCE_CHANGE_COOLDOWN_DAYS
): CooldownStatus {
  const lastChange = lastChangeAt ?? createdAt;
  const daysSinceLastChange = Math.floor(
    (Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24)
  );
  const canChange = daysSinceLastChange >= cooldownDays;
  const daysUntilChange = canChange ? 0 : cooldownDays - daysSinceLastChange;

  return {
    canChange,
    daysUntilChange,
    daysSinceLastChange,
  };
}
