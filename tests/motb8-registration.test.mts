import test from "node:test";
import assert from "node:assert/strict";
import { prepareMotb8Registration } from "../src/lib/motb8/registration.ts";
import type { BeaconFormData } from "../src/components/beacon/types.ts";

const timestamp = "2026-10-26T20:00:00.000Z";

function baseline(): BeaconFormData {
  return {
    name: " Research Assistant ",
    description: " An autonomous machine that researches and analyzes information. ",
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

test("prepares valid registration with signed Good-Faith fields", () => {
  const result = prepareMotb8Registration(baseline(), [], true, timestamp);
  assert.equal(result.registration.name, "Research Assistant");
  assert.deepEqual(result.registration.goodFaith, {
    acknowledged: true,
    termsVersion: "1.0",
    acknowledgedAt: timestamp
  });
  assert.equal("motb8Tag" in result.registration, false);
  assert.equal("controller" in result.registration, false);
  assert.equal("proof" in result.registration, false);
});

test("rejects missing Good-Faith acknowledgment", () => {
  assert.throws(
    () => prepareMotb8Registration(baseline(), [], false, timestamp),
    /Good-Faith acknowledgment is required/
  );
});

test("rejects invalid acknowledgment timestamps", () => {
  assert.throws(
    () => prepareMotb8Registration(baseline(), [], true, "not-a-date"),
    /Invalid acknowledgment timestamp/
  );
});

test("preserves composite and custom presence fields", () => {
  const data = baseline();
  data.presenceScope = "composite";
  data.representedSystemCount = 3;
  data.presenceType = "other";
  data.customPresenceType = "Website Service";
  const result = prepareMotb8Registration(data, [], true, timestamp);
  assert.equal(result.registration.representedSystemCount, 3);
  assert.equal(result.registration.customPresenceType, "Website Service");
});

test("rejects invalid registration description", () => {
  const data = baseline();
  data.description = "Short";
  assert.throws(() => prepareMotb8Registration(data, [], true, timestamp));
});

test("preserves optional capability and taxonomy", () => {
  const data = baseline();
  data.capabilities = [{ id: "research", name: "Research Analysis" }];
  data.taxonomy = [{ domain: "Software", category: "AI Services" }];
  const result = prepareMotb8Registration(data, [], true, timestamp);
  assert.equal(result.registration.capabilities?.[0]?.id, "research");
  assert.equal(result.registration.taxonomy?.[0]?.domain, "Software");
});

test("rejects attachment without valid draft state", () => {
  const data = baseline();
  data.attachments = [{ type: "example", version: "1.0", data: { enabled: true } }];
  assert.throws(() => prepareMotb8Registration(data, [], true, timestamp));
});

import { validateUnsignedBrowserBeaconStructure, generateDiscoverySummary } from "motb-8/browser";

test("prepared registration is compatible with core unsigned Beacon schema", () => {
  const prepared = prepareMotb8Registration(baseline(), [], true, timestamp);
  const unsigned = {
    ...prepared.registration,
    schemaVersion: "1.1",
    motb8Tag: "([[!MOTB-8:1:00000000000000000000000000000000:6S]])",
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
    revision: 1,
    controller: {
      id: "#controller-1",
      type: "Ed25519",
      publicKeyJwk: { kty: "OKP", crv: "Ed25519", x: "A".repeat(43) }
    },
    discoverySummary: generateDiscoverySummary(prepared.registration)
  };
  assert.equal(validateUnsignedBrowserBeaconStructure(unsigned), true);
});

test("preparation does not mutate the original form", () => {
  const data = baseline();
  const original = structuredClone(data);
  prepareMotb8Registration(data, [], true, timestamp);
  assert.deepEqual(data, original);
});

test("registration excludes generated identity fields", () => {
  const prepared = prepareMotb8Registration(baseline(), [], true, timestamp);
  for (const field of ["schemaVersion", "motb8Tag", "status", "createdAt", "updatedAt", "controller", "discoverySummary", "proof", "revision", "previousBeaconHash"]) {
    assert.equal(Object.hasOwn(prepared.registration, field), false, field);
  }
});
