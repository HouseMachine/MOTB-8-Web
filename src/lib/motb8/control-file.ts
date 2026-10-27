import {
  encryptBrowserControlFile,
  unlockBrowserControlFile,
  verifyBrowserGenesisRecord,
  verifyBrowserBeacon
} from "motb-8/browser";

import type { GeneratedIdentity } from "./generate-identity";

export interface PreparedControlFile {
  file: Awaited<ReturnType<typeof encryptBrowserControlFile>>;
  recoveryVerified: true;
}

export async function prepareMotb8ControlFile(
  identity: GeneratedIdentity,
  passphrase: string
): Promise<PreparedControlFile> {
  const genesisResult = await verifyBrowserGenesisRecord(identity.genesis);
  const beaconResult = await verifyBrowserBeacon(
    identity.beacon,
    identity.genesis
  );

  if (genesisResult.status !== "VALID_UNANCHORED" ||
      !beaconResult.valid ||
      beaconResult.genesisStatus !== "VALID_UNANCHORED" ||
      identity.tag !== identity.genesis.motb8Tag ||
      identity.tag !== identity.beacon.motb8Tag ||
      identity.controller.publicKeyJwk.x !==
        identity.genesis.controller.publicKeyJwk.x) {
    throw new Error("Identity verification failed before encryption");
  }

  if (typeof passphrase !== "string" || passphrase.length < 12) {
    throw new Error("Control File passphrase must contain at least 12 characters");
  }

  const file = await encryptBrowserControlFile(
    identity.tag,
    identity.controller,
    passphrase
  );

  const recoveredKey = await unlockBrowserControlFile(
    file,
    passphrase,
    identity.genesis
  );

  if (recoveredKey.type !== "private" || recoveredKey.extractable) {
    throw new Error("Recovered controller key is not protected");
  }

  return {
    file,
    recoveryVerified: true
  };
}
