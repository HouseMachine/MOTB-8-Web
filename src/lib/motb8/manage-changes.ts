import canonicalize from "canonicalize";
import type { MOTB8BeaconV11 } from "motb-8";
import type { UpdateBrowserPresenceBeaconInput } from "motb-8/browser";
type BeaconChangesWithRemoval = UpdateBrowserPresenceBeaconInput["changes"];
import type { BeaconFormData } from "../../components/beacon/types";
import { normalizeBeaconRegistration } from "../../components/beacon/normalize";

export function prepareManageChanges(
  previous: MOTB8BeaconV11,
  formData: BeaconFormData
): BeaconChangesWithRemoval {
  const normalized = normalizeBeaconRegistration(formData);
  const changes: BeaconChangesWithRemoval = {};

  const fields = [
    "name",
    "description",
    "presenceScope",
    "presenceType",
    "representedSystemCount",
    "customPresenceType",
    "taxonomy",
    "capabilities",
    "profiles",
    "reachability",
    "catalogs",
    "protocols",
    "relationships",
    "attachments"
  ] as const;

  for (const field of fields) {
    const before = previous[field];
    const after = normalized[field];

    if (canonicalize(before) !== canonicalize(after)) {
      Object.assign(changes, {
        [field]: after === undefined ? null : after
      });
    }
  }

  return changes;
}
