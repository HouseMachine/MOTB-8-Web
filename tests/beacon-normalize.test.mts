import test from "node:test";
import assert from "node:assert/strict";

import { normalizeBeaconRegistration } from "../src/components/beacon/normalize.ts";
import type { BeaconFormData } from "../src/components/beacon/types.ts";

function baseline(): BeaconFormData {
  return {
    name: " Research Assistant ",
    description: " An autonomous machine that analyzes research sources. ",
    presenceScope: "single",
    presenceType: "agent",
    taxonomy: [],
    capabilities: [],
    reachability: [],
    profiles: {
      developers: [],
      organizations: [],
      links: [],
    },
    catalogs: {
      native: [],
      external: [],
    },
    protocols: [],
    relationships: [],
    attachments: [],
  };
}

test("normalization trims required fields", () => {
  const result = normalizeBeaconRegistration(baseline());

  assert.equal(result.name, "Research Assistant");
  assert.equal(
    result.description,
    "An autonomous machine that analyzes research sources."
  );
});

test("empty optional sections are omitted", () => {
  const result = normalizeBeaconRegistration(baseline());

  assert.equal(result.taxonomy, undefined);
  assert.equal(result.capabilities, undefined);
  assert.equal(result.reachability, undefined);
  assert.equal(result.profiles, undefined);
  assert.equal(result.catalogs, undefined);
  assert.equal(result.protocols, undefined);
  assert.equal(result.relationships, undefined);
  assert.equal(result.attachments, undefined);
});

test("conditional fields are included only when applicable", () => {
  const data = baseline();

  data.representedSystemCount = 5;
  data.customPresenceType = "Custom Robot";

  const single = normalizeBeaconRegistration(data);

  assert.equal(single.representedSystemCount, undefined);
  assert.equal(single.customPresenceType, undefined);

  data.presenceScope = "composite";
  data.presenceType = "other";

  const composite = normalizeBeaconRegistration(data);

  assert.equal(composite.representedSystemCount, 5);
  assert.equal(composite.customPresenceType, "Custom Robot");
});

test("empty optional properties are omitted from populated entries", () => {
  const data = baseline();

  data.capabilities = [
    {
      id: " research ",
      name: " Research Analysis ",
      vocabulary: "",
      description: " ",
    },
  ];

  const result = normalizeBeaconRegistration(data);

  assert.deepEqual(result.capabilities, [
    {
      id: "research",
      name: "Research Analysis",
    },
  ]);
});

test("structured attachment data is preserved", () => {
  const data = baseline();

  data.attachments = [
    {
      type: "example",
      version: "1.0",
      data: {
        enabled: true,
        count: 3,
      },
    },
  ];

  const result = normalizeBeaconRegistration(data);

  assert.deepEqual(result.attachments?.[0]?.data, {
    enabled: true,
    count: 3,
  });
});
