import test from "node:test";
import assert from "node:assert/strict";

import { signManageRevision } from "../src/lib/motb8/manage-sign.ts";
import { importManageIdentity } from "../src/lib/motb8/manage-import.ts";
import { createFixture } from "./motb8-manage-fixture.ts";
import { verifyBrowserBeaconRevision } from "motb-8/browser";

test("signs and packages an authorized Beacon revision", async () => {
  const fixture = await createFixture();

  const identity = await importManageIdentity({
    genesis: fixture.genesis,
    beacon: fixture.beacon,
    controlFile: fixture.controlFile,
    passphrase: "Synthetic-Manage-Import-2026"
  });

  const result = await signManageRevision(
    identity,
    {
      description:
        "An updated synthetic machine for verified Beacon revision testing."
    },
    "Synthetic-Manage-Import-2026"
  );

  assert.equal(result.beacon.revision, 2);
  assert.equal(result.beacon.motb8Tag, fixture.tag);
  assert.equal(result.beacon.createdAt, fixture.beacon.createdAt);
  assert.deepEqual(result.beacon.controller, fixture.beacon.controller);

  const verification = await verifyBrowserBeaconRevision(
    fixture.beacon,
    result.beacon,
    fixture.genesis
  );

  assert.equal(verification.valid, true);
  assert.equal(result.artifact.mimeType, "application/json");
  assert.deepEqual(JSON.parse(result.artifact.content), result.beacon);
});
