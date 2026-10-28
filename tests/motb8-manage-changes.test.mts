import test from "node:test";
import assert from "node:assert/strict";

import { prepareManageChanges } from "../src/lib/motb8/manage-changes.ts";
import type { MOTB8BeaconV11 } from "motb-8";
import type { BeaconFormData } from "../src/components/beacon/types";

test("removing capabilities produces an explicit removal", () => {
  const previous = {
    capabilities: [{ id: "research", name: "Research" }]
  } as unknown as MOTB8BeaconV11;

  const form = {
    capabilities: [],
    taxonomy: [],
    reachability: [],
    profiles: { developers: [], organizations: [], links: [] },
    catalogs: { native: [], external: [] },
    protocols: [],
    relationships: [],
    attachments: [],
    name: "Test Machine",
    description: "A synthetic machine for testing removal.",
    presenceScope: "single",
    presenceType: "agent"
  } as BeaconFormData;

  const changes = prepareManageChanges(previous, form);

  assert.equal(changes.capabilities, null);
});
test("unchanged Beacon information produces no changes", () => {
  const previous = {
    name: "Test Machine",
    description: "A synthetic machine for testing removal.",
    presenceScope: "single",
    presenceType: "agent"
  } as unknown as MOTB8BeaconV11;

  const form = {
    name: previous.name,
    description: previous.description,
    presenceScope: previous.presenceScope,
    presenceType: previous.presenceType,
    taxonomy: [],
    capabilities: [],
    reachability: [],
    profiles: { developers: [], organizations: [], links: [] },
    catalogs: { native: [], external: [] },
    protocols: [],
    relationships: [],
    attachments: []
  } as BeaconFormData;

  assert.deepEqual(prepareManageChanges(previous, form), {});
});

test("nested property ordering does not create changes", () => {
  const previous = {
    name: "Test Machine",
    description: "A synthetic machine for testing removal.",
    presenceScope: "single",
    presenceType: "agent",
    capabilities: [{ id: "research", name: "Research" }]
  } as unknown as MOTB8BeaconV11;

  const form = {
    name: previous.name,
    description: previous.description,
    presenceScope: previous.presenceScope,
    presenceType: previous.presenceType,
    capabilities: [{ name: "Research", id: "research" }],
    taxonomy: [],
    reachability: [],
    profiles: { developers: [], organizations: [], links: [] },
    catalogs: { native: [], external: [] },
    protocols: [],
    relationships: [],
    attachments: []
  } as BeaconFormData;

  assert.deepEqual(prepareManageChanges(previous, form), {});
});
test("changing composite to single removes system count", () => {
  const previous = {
    name: "Test Machine",
    description: "A synthetic machine for testing removal.",
    presenceScope: "composite",
    presenceType: "agent",
    representedSystemCount: 3
  } as unknown as MOTB8BeaconV11;

  const form = {
    ...previous,
    presenceScope: "single",
    taxonomy: [],
    capabilities: [],
    reachability: [],
    profiles: { developers: [], organizations: [], links: [] },
    catalogs: { native: [], external: [] },
    protocols: [],
    relationships: [],
    attachments: []
  } as BeaconFormData;

  const changes = prepareManageChanges(previous, form);

  assert.equal(changes.presenceScope, "single");
  assert.equal(changes.representedSystemCount, null);
});

test("changing custom type to agent removes custom type", () => {
  const previous = {
    name: "Test Machine",
    description: "A synthetic machine for testing removal.",
    presenceScope: "single",
    presenceType: "other",
    customPresenceType: "Research Cluster"
  } as unknown as MOTB8BeaconV11;

  const form = {
    ...previous,
    presenceType: "agent",
    taxonomy: [],
    capabilities: [],
    reachability: [],
    profiles: { developers: [], organizations: [], links: [] },
    catalogs: { native: [], external: [] },
    protocols: [],
    relationships: [],
    attachments: []
  } as BeaconFormData;

  const changes = prepareManageChanges(previous, form);

  assert.equal(changes.presenceType, "agent");
  assert.equal(changes.customPresenceType, null);
});
