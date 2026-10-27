import canonicalize from "canonicalize";
import type { NormalizedBeaconRegistration } from "../../components/beacon/normalize";

export function registrationFingerprint(
  registration: NormalizedBeaconRegistration
): string {
  const result = canonicalize(registration);
  if (typeof result !== "string") {
    throw new Error("Registration canonicalization failed");
  }
  return result;
}
