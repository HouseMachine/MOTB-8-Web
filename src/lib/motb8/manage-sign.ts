import {
  updateBrowserPresenceBeacon,
  verifyBrowserBeaconRevision
} from "motb-8/browser";

import type { UpdateBrowserPresenceBeaconInput } from "motb-8/browser";
import type { DownloadArtifact } from "./artifacts";
import type { VerifiedManageIdentity } from "./manage-import";

export interface SignedManageRevision {
  beacon: Awaited<ReturnType<typeof updateBrowserPresenceBeacon>>["beacon"];
  artifact: DownloadArtifact;
}

export async function signManageRevision(
  identity: VerifiedManageIdentity,
  changes: UpdateBrowserPresenceBeaconInput["changes"],
  passphrase: string
): Promise<SignedManageRevision> {
  if (Object.keys(changes).length === 0) {
    throw new Error("No Beacon changes to sign");
  }

  const result = await updateBrowserPresenceBeacon({
    previousBeacon: identity.beacon,
    genesis: identity.genesis,
    controlFile: identity.controlFile,
    passphrase,
    changes
  });

  const verification = await verifyBrowserBeaconRevision(
    identity.beacon,
    result.beacon,
    identity.genesis
  );

  if (!verification.valid) {
    throw new Error("Signed Beacon revision verification failed");
  }

  return {
    beacon: result.beacon,
    artifact: {
      filename: `motb8-beacon-revision-${result.beacon.revision}.json`,
      content: JSON.stringify(result.beacon, null, 2) + "\n",
      mimeType: "application/json"
    }
  };
}
