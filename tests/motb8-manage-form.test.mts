import test from "node:test";
import assert from "node:assert/strict";

import { beaconToManageForm } from "../src/lib/motb8/manage-form.ts";
import type { MOTB8BeaconV11 } from "motb-8";

const beacon = {
  name: "Research Machine",
  description: "A synthetic machine for testing Beacon management.",
  presenceScope: "composite",
  presenceType: "other",
  representedSystemCount: 3,
  customPresenceType: "Research Cluster",
  taxonomy: [{ domain: "Technology", category: "AI" }],
  capabilities: [{ id: "research", name: "Research" }],
  reachability: [{ type: "website", value: "https://example.com" }],
  profiles: {
    developers: ["Developer A"],
    organizations: ["Organization A"],
    links: [{ type: "website", url: "https://example.com" }]
  },
  catalogs: {
    native: [{
      id: "research-service",
      direction: "OFFER",
      name: "Research Service",
      description: "Synthetic research service."
    }],
    external: []
  },
  protocols: [{ id: "https", endpoints: ["https://example.com/api"] }],
  relationships: [{ type: "related", target: "https://example.com" }],
  attachments: [{
    type: "application/example",
    version: "1.0",
    data: { nested: { enabled: true } }
  }]
} as unknown as MOTB8BeaconV11;

test("Manage adapter preserves mutable Beacon fields", () => {
  const form = beaconToManageForm(beacon);

  assert.equal(form.name, beacon.name);
  assert.equal(form.description, beacon.description);
  assert.equal(form.representedSystemCount, 3);
  assert.equal(form.customPresenceType, "Research Cluster");
  assert.deepEqual(form.taxonomy, beacon.taxonomy);
  assert.deepEqual(form.capabilities, beacon.capabilities);
  assert.deepEqual(form.profiles, beacon.profiles);
  assert.deepEqual(form.catalogs, beacon.catalogs);
  assert.deepEqual(form.attachments, beacon.attachments);
});

test("Manage adapter does not mutate original Beacon", () => {
  const form = beaconToManageForm(beacon);

  form.name = "Changed Name";
  form.capabilities[0].name = "Changed Capability";
  form.attachments[0].data.nested = { enabled: false };

  assert.equal(beacon.name, "Research Machine");
  assert.equal(beacon.capabilities?.[0].name, "Research");
  assert.deepEqual(beacon.attachments?.[0].data.nested, { enabled: true });
});

test("Manage adapter initializes omitted optional sections", () => {
  const minimal = {
    name: beacon.name,
    description: beacon.description,
    presenceScope: "single",
    presenceType: "agent"
  } as unknown as MOTB8BeaconV11;

  const form = beaconToManageForm(minimal);

  assert.deepEqual(form.taxonomy, []);
  assert.deepEqual(form.capabilities, []);
  assert.deepEqual(form.reachability, []);
  assert.deepEqual(form.profiles, {
    developers: [],
    organizations: [],
    links: []
  });
  assert.deepEqual(form.catalogs, { native: [], external: [] });
  assert.deepEqual(form.protocols, []);
  assert.deepEqual(form.relationships, []);
  assert.deepEqual(form.attachments, []);
});

