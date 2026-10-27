import {
  generateBrowserMotb8Tag,
  generateBrowserControllerKeyPair,
  createBrowserGenesisRecord,
  signBrowserBeacon,
  verifyBrowserGenesisRecord,
  verifyBrowserBeacon,
  validateUnsignedBrowserBeaconStructure,
  generateDiscoverySummary
} from "motb-8/browser";

import type { BrowserControllerKeyPair } from "motb-8/browser";
import type { BeaconFormData } from "../../components/beacon/types";
import type { AttachmentDraftState } from "../../components/beacon/attachment-draft";
import type { CreateWorkflowState } from "./workflow";

import { prepareMotb8Registration } from "./registration";
import { normalizeBeaconRegistration } from "../../components/beacon/normalize";
import { registrationFingerprint } from "./fingerprint";
import { canProceedToGeneration } from "./workflow";

export interface GenerateIdentityInput {
  formData: BeaconFormData;
  attachmentDrafts: AttachmentDraftState[];
  acknowledged: boolean;
  workflow: CreateWorkflowState;
  reviewFingerprint: string | null;
}

export interface GeneratedIdentity {
  tag: string;
  genesis: Awaited<ReturnType<typeof createBrowserGenesisRecord>>;
  beacon: Awaited<ReturnType<typeof signBrowserBeacon>>;
  controller: BrowserControllerKeyPair;
  genesisStatus: string;
}

export async function generateMotb8Identity(
  input: GenerateIdentityInput
): Promise<GeneratedIdentity> {
  const normalized = normalizeBeaconRegistration(input.formData);
  const fingerprint = registrationFingerprint(normalized);

  const prepared = prepareMotb8Registration(
    input.formData,
    input.attachmentDrafts,
    input.acknowledged,
    new Date().toISOString()
  );

  if (!canProceedToGeneration(
    input.workflow,
    fingerprint,
    true,
    input.reviewFingerprint
  )) {
    throw new Error("Registration review is not current or approved");
  }

  const timestamp = prepared.registration.goodFaith.acknowledgedAt;

  const tag = await generateBrowserMotb8Tag();
  const controller = await generateBrowserControllerKeyPair();

  const genesis = await createBrowserGenesisRecord(
    tag,
    controller,
    timestamp
  );

  const unsignedBeacon = {
    ...prepared.registration,
    schemaVersion: "1.1" as const,
    motb8Tag: tag,
    status: "active" as const,
    createdAt: timestamp,
    updatedAt: timestamp,
    revision: 1,
    controller: genesis.controller,
    discoverySummary: generateDiscoverySummary(prepared.registration)
  };

  if (!validateUnsignedBrowserBeaconStructure(unsignedBeacon)) {
    throw new Error("Initial unsigned Beacon failed core validation");
  }

  const beacon = await signBrowserBeacon(unsignedBeacon, controller);

  const genesisVerification = await verifyBrowserGenesisRecord(genesis);

  if (genesisVerification.status !== "VALID_UNANCHORED") {
    throw new Error("Generated Genesis verification failed");
  }

  const beaconVerification = await verifyBrowserBeacon(beacon, genesis);

  if (!beaconVerification.valid ||
      beaconVerification.genesisStatus !== "VALID_UNANCHORED") {
    throw new Error("Generated Beacon verification failed");
  }

  return {
    tag,
    genesis,
    beacon,
    controller,
    genesisStatus: genesisVerification.status
  };
}
