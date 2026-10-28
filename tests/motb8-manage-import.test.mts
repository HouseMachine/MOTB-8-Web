import test from "node:test";
import assert from "node:assert/strict";

import {
  createFixture,
  passphrase
} from "./motb8-manage-fixture.ts";

import {
  generateBrowserMotb8Tag,
  generateBrowserControllerKeyPair,
  encryptBrowserControlFile
} from "motb-8/browser";

import { importManageIdentity } from "../src/lib/motb8/manage-import.ts";

test("imports verified identity and reconstructs editable form", async () => {
  const fixture = await createFixture();

  const result = await importManageIdentity({
    genesis: fixture.genesis,
    beacon: fixture.beacon,
    controlFile: fixture.controlFile,
    passphrase
  });

  assert.equal(result.beacon.motb8Tag, fixture.tag);
  assert.equal(result.formData.name, fixture.beacon.name);
  assert.equal(result.formData.description, fixture.beacon.description);
  assert.deepEqual(result.formData.capabilities, []);
});

test("rejects incorrect Control File passphrase", async () => {
  const fixture = await createFixture();

  await assert.rejects(
    importManageIdentity({
      genesis: fixture.genesis,
      beacon: fixture.beacon,
      controlFile: fixture.controlFile,
      passphrase: "Incorrect-Manage-Passphrase"
    })
  );
});
test("rejects tampered Genesis", async () => {
  const fixture = await createFixture();

  await assert.rejects(
    importManageIdentity({
      genesis: {
        ...fixture.genesis,
        createdAt: "2020-01-01T00:00:00.000Z"
      },
      beacon: fixture.beacon,
      controlFile: fixture.controlFile,
      passphrase
    }),
    /Genesis verification failed/
  );
});

test("rejects tampered signed Beacon", async () => {
  const fixture = await createFixture();

  await assert.rejects(
    importManageIdentity({
      genesis: fixture.genesis,
      beacon: {
        ...fixture.beacon,
        description: "Unauthorized modification after signing."
      },
      controlFile: fixture.controlFile,
      passphrase
    }),
    /Beacon verification failed/
  );
});
test("rejects unrelated Control File Tag", async () => {
  const fixture = await createFixture();
  const unrelatedTag = await generateBrowserMotb8Tag();

  await assert.rejects(
    importManageIdentity({
      genesis: fixture.genesis,
      beacon: fixture.beacon,
      controlFile: {
        ...fixture.controlFile,
        motb8Tag: unrelatedTag
      },
      passphrase
    }),
    /Identity Tag mismatch/
  );
});

test("rejects unrelated controller credentials", async () => {
  const fixture = await createFixture();
  const unrelatedController = await generateBrowserControllerKeyPair();

  const unrelatedFile = await encryptBrowserControlFile(
    fixture.tag,
    unrelatedController,
    passphrase
  );

  await assert.rejects(
    importManageIdentity({
      genesis: fixture.genesis,
      beacon: fixture.beacon,
      controlFile: unrelatedFile,
      passphrase
    }),
    /Recovered controller does not match Genesis/
  );
});
