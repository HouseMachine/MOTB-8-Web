export const DISCOVERABILITY_BONUS_PER_ENTRY = 256;

export function calculateDiscoveryBonus(
  validEntryCount: number
): number {
  if (
    !Number.isSafeInteger(validEntryCount) ||
    validEntryCount <= 1
  ) {
    return 0;
  }

  return (
    (validEntryCount - 1) *
    DISCOVERABILITY_BONUS_PER_ENTRY
  );
}
