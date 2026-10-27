import test from "node:test";
import assert from "node:assert/strict";

import { generateMotb8Identity } from "../src/lib/motb8/generate-identity.ts";
import { normalizeBeaconRegistration } from "../src/components/beacon/normalize.ts";
import { registrationFingerprint } from "../src/lib/motb8/fingerprint.ts";
import { beginReview, approveReview } from "../src/lib/motb8/workflow.ts";
import type { BeaconFormData } from "../src/components/beacon/types.ts";

function baseline(): BeaconFormData {
  return {
    name: "Synthetic Test Machine",
    description: "A disposable machine identity used for generation testing.",
    presenceScope: "single",
    presenceType: "agent",
    taxonomy: [],
    capabilities: [],
    reachability: [],
    profiles: { developers: [], organizations: [], links: [] },
    catalogs: { native: [], external: [] },
    protocols: [],
    relationships: [],
    attachments: []
  };
}

function approvedInput() {
  const formData = baseline();
  const fingerprint = registrationFingerprint(
    normalizeBeaconRegistration(formData)
  );

  return {
    formData,
    attachmentDrafts: [],
    acknowledged: true,
    workflow: approveReview(beginReview(true), fingerprint),
    reviewFingerprint: fingerprint
  };
}

test("generates a verified initial MOTB-8 identity", async () => {
  const result = await generateMotb8Identity(approvedInput());

  assert.equal(result.tag, result.genesis.motb8Tag);
  assert.equal(result.tag, result.beacon.motb8Tag);
  assert.equal(result.genesisStatus, "VALID_UNANCHORED");

  assert.equal(result.beacon.schemaVersion, "1.1");
  assert.equal(result.beacon.revision, 1);
  assert.equal(result.beacon.status, "active");

  assert.equal(result.beacon.createdAt, result.genesis.createdAt);
  assert.equal(result.beacon.updatedAt, result.genesis.createdAt);

  assert.equal(result.beacon.controller.publicKeyJwk.x,
    result.genesis.controller.publicKeyJwk.x);

  assert.equal(result.beacon.goodFaith.acknowledged, true);
  assert.equal(result.beacon.goodFaith.termsVersion, "1.0");

  assert.equal("previousBeaconHash" in result.beacon, false);
  assert.equal(result.controller.privateKey.type, "private");
});

test("rejects registration without approval", async () => {
  const input = approvedInput();
  input.workflow = beginReview(true);

  await assert.rejects(
    generateMotb8Identity(input),
    /not current or approved/
  );
});

test("rejects stale registration approval", async () => {
  const input = approvedInput();
  input.formData.description =
    "This machine description was changed after registration approval.";

  await assert.rejects(
    generateMotb8Identity(input),
    /not current or approved/
  );
});

test("rejects missing Good-Faith acknowledgment", async () => {
  const input = approvedInput();
  input.acknowledged = false;

  await assert.rejects(
    generateMotb8Identity(input),
    /Good-Faith acknowledgment is required/
  );
});

test("rejects invalid registration description", async () => {
  const input = approvedInput();
  input.formData.description = "Short";

  await assert.rejects(
    generateMotb8Identity(input)
  );
});

test("generated public records verify independently", async () => {
  const { verifyBrowserBeacon, verifyBrowserGenesisRecord } =
    await import("motb-8/browser");

  const result = await generateMotb8Identity(approvedInput());

  const genesis = await verifyBrowserGenesisRecord(result.genesis);
  const beacon = await verifyBrowserBeacon(result.beacon, result.genesis);

  assert.equal(genesis.status, "VALID_UNANCHORED");
  assert.equal(beacon.valid, true, beacon.reason);
  assert.equal(beacon.genesisStatus, "VALID_UNANCHORED");
});

test("separate generations produce distinct identities", async () => {
  const first = await generateMotb8Identity(approvedInput());
  const second = await generateMotb8Identity(approvedInput());

  assert.notEqual(first.tag, second.tag);
  assert.notEqual(
    first.controller.publicKeyJwk.x,
    second.controller.publicKeyJwk.x
  );
});
