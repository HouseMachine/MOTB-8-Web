import test from "node:test";
import assert from "node:assert/strict";

import { generateMotb8Identity } from "../src/lib/motb8/generate-identity.ts";
import { Motb8CreationLifecycle } from "../src/lib/motb8/create-lifecycle.ts";
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

test("encrypts and recovers the generated controller", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");

  const { unlockBrowserControlFile } =
    await import("motb-8/browser");

  const identity = await generateMotb8Identity(approvedInput());
  const passphrase = "Synthetic-Control-Test-2026";

  const prepared = await prepareMotb8ControlFile(
    identity,
    passphrase
  );

  assert.equal(prepared.recoveryVerified, true);
  assert.equal(prepared.file.format, "MOTB-8-CONTROL");
  assert.equal(prepared.file.version, "1.0");
  assert.equal(prepared.file.motb8Tag, identity.tag);

  assert.equal(prepared.file.kdf.algorithm, "scrypt");
  assert.equal(prepared.file.encryption.algorithm, "AES-256-GCM");

  const recovered = await unlockBrowserControlFile(
    prepared.file,
    passphrase,
    identity.genesis
  );

  assert.equal(recovered.type, "private");
  assert.equal(recovered.extractable, false);
});

test("rejects incorrect Control File passphrase", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");
  const { unlockBrowserControlFile } =
    await import("motb-8/browser");

  const identity = await generateMotb8Identity(approvedInput());
  const prepared = await prepareMotb8ControlFile(
    identity,
    "Synthetic-Control-Test-2026"
  );

  await assert.rejects(
    unlockBrowserControlFile(
      prepared.file,
      "Incorrect-Control-Test-2026",
      identity.genesis
    )
  );
});

test("rejects tampered Control File ciphertext", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");
  const { unlockBrowserControlFile } =
    await import("motb-8/browser");

  const identity = await generateMotb8Identity(approvedInput());
  const passphrase = "Synthetic-Control-Test-2026";
  const prepared = await prepareMotb8ControlFile(identity, passphrase);

  const tampered = {
    ...prepared.file,
    ciphertext:
      (prepared.file.ciphertext[0] === "A" ? "B" : "A") +
      prepared.file.ciphertext.slice(1)
  };

  await assert.rejects(
    unlockBrowserControlFile(tampered, passphrase, identity.genesis)
  );
});

test("rejects unrelated Genesis during Control File recovery", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");
  const { unlockBrowserControlFile } =
    await import("motb-8/browser");

  const identity = await generateMotb8Identity(approvedInput());
  const unrelated = await generateMotb8Identity(approvedInput());
  const passphrase = "Synthetic-Control-Test-2026";

  const prepared = await prepareMotb8ControlFile(
    identity,
    passphrase
  );

  await assert.rejects(
    unlockBrowserControlFile(
      prepared.file,
      passphrase,
      unrelated.genesis
    ),
    /Tag mismatch/
  );
});

test("rejects mismatched controller before Control File encryption", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");
  const { generateBrowserControllerKeyPair } =
    await import("motb-8/browser");

  const identity = await generateMotb8Identity(approvedInput());
  const unrelatedController = await generateBrowserControllerKeyPair();

  await assert.rejects(
    prepareMotb8ControlFile(
      { ...identity, controller: unrelatedController },
      "Synthetic-Control-Test-2026"
    ),
    /Identity verification failed before encryption/
  );
});

test("packages public and private identity artifacts separately", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");
  const { prepareIdentityArtifacts } =
    await import("../src/lib/motb8/artifacts.ts");

  const identity = await generateMotb8Identity(approvedInput());
  const passphrase = "Synthetic-Packaging-Test-2026";
  const control = await prepareMotb8ControlFile(identity, passphrase);

  const artifacts = await prepareIdentityArtifacts(identity, control, passphrase);

  assert.deepEqual(
    Object.keys(artifacts.public).sort(),
    ["beacon", "genesis", "tag"]
  );

  assert.deepEqual(
    Object.keys(artifacts.private),
    ["controlFile"]
  );

  assert.equal(artifacts.public.tag.content.trim(), identity.tag);

  assert.equal(
    JSON.parse(artifacts.public.genesis.content).motb8Tag,
    identity.tag
  );

  assert.equal(
    JSON.parse(artifacts.public.beacon.content).motb8Tag,
    identity.tag
  );

  assert.equal(
    JSON.parse(artifacts.private.controlFile.content).motb8Tag,
    identity.tag
  );

  const publicContents = Object.values(artifacts.public)
    .map((artifact) => artifact.content)
    .join("\n");

  assert.equal(publicContents.includes(passphrase), false);
  assert.equal(publicContents.includes('"ciphertext"'), false);
  assert.equal(publicContents.includes('"privateKey"'), false);
  assert.equal(publicContents.includes('"authTag"'), false);

  assert.equal(artifacts.private.controlFile.mimeType, "application/json");
});

test("rejects a substituted Control File with the same Tag", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");
  const { prepareIdentityArtifacts } =
    await import("../src/lib/motb8/artifacts.ts");
  const {
    generateBrowserControllerKeyPair,
    encryptBrowserControlFile
  } = await import("motb-8/browser");

  const identity = await generateMotb8Identity(approvedInput());
  const passphrase = "Synthetic-Substitution-Test-2026";

  const original = await prepareMotb8ControlFile(
    identity,
    passphrase
  );

  const unrelatedController = await generateBrowserControllerKeyPair();

  const substitutedFile = await encryptBrowserControlFile(
    identity.tag,
    unrelatedController,
    passphrase
  );

  assert.equal(substitutedFile.motb8Tag, identity.tag);
  assert.notEqual(
    unrelatedController.publicKeyJwk.x,
    identity.genesis.controller.publicKeyJwk.x
  );

  await assert.rejects(
    prepareIdentityArtifacts(
      identity,
      { ...original, file: substitutedFile },
      passphrase
    ),
    /Recovered controller does not match Genesis/
  );
});

test("lifecycle prepares one identity and reuses its artifacts", async () => {
  const lifecycle = new Motb8CreationLifecycle();
  const input = approvedInput();
  const passphrase = "Synthetic-Lifecycle-Test-2026";

  const first = await lifecycle.prepare(input, passphrase);
  const snapshot = lifecycle.getSnapshot();

  assert.equal(snapshot.stage, "ready-for-download");
  assert.equal(snapshot.artifactsReady, true);
  assert.ok(snapshot.tag);
  assert.equal(first.public.tag.content.trim(), snapshot.tag);

  await assert.rejects(
    lifecycle.prepare(input, passphrase),
    /Identity already prepared/
  );

  assert.equal(lifecycle.getSnapshot().tag, snapshot.tag);
  assert.strictEqual(lifecycle.getArtifacts(), first);
});

test("lifecycle rejects changed registration and withdrawn acknowledgment", async () => {
  const lifecycle = new Motb8CreationLifecycle();
  const input = approvedInput();
  const passphrase = "Synthetic-Lifecycle-Test-2026";

  await lifecycle.prepare(input, passphrase);
  const originalTag = lifecycle.getSnapshot().tag;

  const changed = approvedInput();
  changed.formData.description =
    "A different description after the identity was generated.";

  await assert.rejects(
    lifecycle.prepare(changed, passphrase)
  );

  await assert.rejects(
    lifecycle.prepare(
      { ...input, acknowledged: false },
      passphrase
    ),
    /Good-Faith acknowledgment is required/
  );

  assert.equal(lifecycle.getSnapshot().tag, originalTag);
  assert.equal(lifecycle.getSnapshot().stage, "ready-for-download");
});

test("lifecycle rejects concurrent generation requests", async () => {
  const lifecycle = new Motb8CreationLifecycle();
  const input = approvedInput();
  const passphrase = "Synthetic-Concurrency-Test-2026";

  const first = lifecycle.prepare(input, passphrase);

  await assert.rejects(
    lifecycle.prepare(input, passphrase),
    /already in progress/
  );

  const artifacts = await first;

  assert.equal(lifecycle.getSnapshot().stage, "ready-for-download");
  assert.equal(
    artifacts.public.tag.content.trim(),
    lifecycle.getSnapshot().tag
  );
});

test("lifecycle recovers from encryption failure without regenerating", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");
  const { prepareIdentityArtifacts } =
    await import("../src/lib/motb8/artifacts.ts");

  let generationCount = 0;
  let encryptionCount = 0;

  const lifecycle = new Motb8CreationLifecycle({
    generate: async (input) => {
      generationCount++;
      return generateMotb8Identity(input);
    },
    encrypt: async (identity, passphrase) => {
      encryptionCount++;

      if (encryptionCount === 1) {
        throw new Error("Synthetic encryption failure");
      }

      return prepareMotb8ControlFile(identity, passphrase);
    },
    packageArtifacts: prepareIdentityArtifacts
  });

  const input = approvedInput();
  const passphrase = "Synthetic-Recovery-Test-2026";

  await assert.rejects(
    lifecycle.prepare(input, passphrase),
    /Synthetic encryption failure/
  );

  const failed = lifecycle.getSnapshot();

  assert.equal(failed.stage, "error");
  assert.ok(failed.tag);
  assert.equal(failed.artifactsReady, false);
  assert.equal(generationCount, 1);

  const artifacts = await lifecycle.prepare(input, passphrase);

  assert.equal(generationCount, 1);
  assert.equal(encryptionCount, 2);
  assert.equal(lifecycle.getSnapshot().stage, "ready-for-download");
  assert.equal(lifecycle.getSnapshot().tag, failed.tag);
  assert.equal(artifacts.public.tag.content.trim(), failed.tag);
});

test("lifecycle recovers from packaging failure without regenerating", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");
  const { prepareIdentityArtifacts } =
    await import("../src/lib/motb8/artifacts.ts");

  let generationCount = 0;
  let encryptionCount = 0;
  let packagingCount = 0;

  const lifecycle = new Motb8CreationLifecycle({
    generate: async (input) => {
      generationCount++;
      return generateMotb8Identity(input);
    },
    encrypt: async (identity, passphrase) => {
      encryptionCount++;
      return prepareMotb8ControlFile(identity, passphrase);
    },
    packageArtifacts: async (identity, control, passphrase) => {
      packagingCount++;

      if (packagingCount === 1) {
        throw new Error("Synthetic packaging failure");
      }

      return prepareIdentityArtifacts(identity, control, passphrase);
    }
  });

  const input = approvedInput();
  const passphrase = "Synthetic-Packaging-Recovery-2026";

  await assert.rejects(
    lifecycle.prepare(input, passphrase),
    /Synthetic packaging failure/
  );

  const failed = lifecycle.getSnapshot();

  assert.equal(failed.stage, "error");
  assert.ok(failed.tag);
  assert.equal(failed.artifactsReady, false);
  assert.equal(generationCount, 1);
  assert.equal(packagingCount, 1);

  const artifacts = await lifecycle.prepare(input, passphrase);

  assert.equal(generationCount, 1);
  assert.equal(encryptionCount, 1);
  assert.equal(packagingCount, 2);
  assert.equal(lifecycle.getSnapshot().stage, "ready-for-download");
  assert.equal(lifecycle.getSnapshot().tag, failed.tag);
  assert.equal(artifacts.public.tag.content.trim(), failed.tag);
});

test("lifecycle rejects incorrect passphrase after packaging failure", async () => {
  const { prepareMotb8ControlFile } =
    await import("../src/lib/motb8/control-file.ts");
  const { prepareIdentityArtifacts } =
    await import("../src/lib/motb8/artifacts.ts");

  let generationCount = 0;
  let encryptionCount = 0;
  let packagingCount = 0;
  let originalCiphertext: string | null = null;

  const lifecycle = new Motb8CreationLifecycle({
    generate: async (input) => {
      generationCount++;
      return generateMotb8Identity(input);
    },
    encrypt: async (identity, passphrase) => {
      encryptionCount++;
      const control = await prepareMotb8ControlFile(identity, passphrase);
      originalCiphertext = control.file.ciphertext;
      return control;
    },
    packageArtifacts: async (identity, control, passphrase) => {
      packagingCount++;

      if (packagingCount === 1) {
        throw new Error("Synthetic packaging failure");
      }

      return prepareIdentityArtifacts(identity, control, passphrase);
    }
  });

  const input = approvedInput();
  const passphrase = "Synthetic-Original-Passphrase-2026";

  await assert.rejects(
    lifecycle.prepare(input, passphrase),
    /Synthetic packaging failure/
  );

  const originalTag = lifecycle.getSnapshot().tag;
  assert.ok(originalTag);
  assert.ok(originalCiphertext);

  await assert.rejects(
    lifecycle.prepare(input, "Incorrect-Retry-Passphrase-2026")
  );

  assert.equal(lifecycle.getSnapshot().tag, originalTag);
  assert.equal(generationCount, 1);
  assert.equal(encryptionCount, 1);
  assert.equal(packagingCount, 2);
  assert.equal(lifecycle.getArtifacts(), null);
  assert.equal(lifecycle.getSnapshot().artifactsReady, false);

  const artifacts = await lifecycle.prepare(input, passphrase);

  assert.equal(generationCount, 1);
  assert.equal(encryptionCount, 1);
  assert.equal(packagingCount, 3);
  assert.equal(lifecycle.getSnapshot().stage, "ready-for-download");
  assert.equal(artifacts.public.tag.content.trim(), originalTag);

  const savedControl = JSON.parse(
    artifacts.private.controlFile.content
  );

  assert.equal(savedControl.ciphertext, originalCiphertext);
});
