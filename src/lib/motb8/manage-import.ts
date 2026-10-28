import {
  verifyBrowserGenesisRecord,
  verifyBrowserBeacon,
  unlockBrowserControlFile
} from "motb-8/browser";

import type { GenesisRecord } from "motb-8";
import type { MOTB8BeaconV11 } from "motb-8";
import type { EncryptedControlFile } from "motb-8";

import type { BeaconFormData } from "../../components/beacon/types";
import { beaconToManageForm } from "./manage-form";

export interface ManageIdentityInput {
  genesis: unknown;
  beacon: unknown;
  controlFile: unknown;
  passphrase: string;
}

export interface VerifiedManageIdentity {
  genesis: GenesisRecord;
  beacon: MOTB8BeaconV11;
  controlFile: EncryptedControlFile;
  formData: BeaconFormData;
}

export async function importManageIdentity(
  input: ManageIdentityInput
): Promise<VerifiedManageIdentity> {
  const genesisResult = await verifyBrowserGenesisRecord(input.genesis);

  if (genesisResult.status !== "VALID_UNANCHORED") {
    throw new Error("Genesis verification failed");
  }

  const beaconResult = await verifyBrowserBeacon(
    input.beacon,
    input.genesis
  );

  if (!beaconResult.valid) {
    throw new Error("Beacon verification failed");
  }

  const genesis = input.genesis as GenesisRecord;
  const beacon = input.beacon as MOTB8BeaconV11;
  const controlFile = input.controlFile as EncryptedControlFile;

  if (beacon.schemaVersion !== "1.1") {
    throw new Error("Manage requires Beacon schema v1.1");
  }

  if (
    genesis.motb8Tag !== beacon.motb8Tag ||
    controlFile?.motb8Tag !== genesis.motb8Tag
  ) {
    throw new Error("Identity Tag mismatch");
  }

  const recovered = await unlockBrowserControlFile(
    controlFile,
    input.passphrase,
    genesis
  );

  if (recovered.type !== "private" || recovered.extractable) {
    throw new Error("Controller recovery verification failed");
  }

  return {
    genesis,
    beacon,
    controlFile,
    formData: beaconToManageForm(beacon)
  };
}
