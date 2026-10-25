import test from "node:test";
import assert from "node:assert/strict";

import { normalizeBeaconRegistration } from "../src/components/beacon/normalize.ts";
import { validateRegistrationSchema } from "../src/components/beacon/schema-validation.ts";
import type { BeaconFormData } from "../src/components/beacon/types.ts";

function baseline(): BeaconFormData {
  return {
    name: "Research Assistant",
    description: "An autonomous machine that researches and analyzes information.",
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

test("valid required registration information passes", () => {
  const normalized = normalizeBeaconRegistration(baseline());
  const result = validateRegistrationSchema(normalized);

  assert.equal(result.valid, true, result.errors.join("; "));
});

test("optional sections may be omitted", () => {
  const normalized = normalizeBeaconRegistration(baseline());

  assert.equal(normalized.taxonomy, undefined);
  assert.equal(normalized.attachments, undefined);
  assert.equal(validateRegistrationSchema(normalized).valid, true);
});

test("invalid required description is rejected", () => {
  const data = baseline();
  data.description = "Short";

  const result = validateRegistrationSchema(
    normalizeBeaconRegistration(data)
  );

  assert.equal(result.valid, false);
});

test("invalid profile URL is rejected", () => {
  const data = baseline();
  data.profiles.links = [
    { type: "website", url: "not-a-valid-uri" },
  ];

  const result = validateRegistrationSchema(
    normalizeBeaconRegistration(data)
  );

  assert.equal(result.valid, false);
});

test("valid optional capability passes", () => {
  const data = baseline();
  data.capabilities = [
    { id: "research", name: "Research Analysis" },
  ];

  const result = validateRegistrationSchema(
    normalizeBeaconRegistration(data)
  );

  assert.equal(result.valid, true, result.errors.join("; "));
});
test("valid composite presence passes schema validation", () => {
  const data = baseline();
  data.presenceScope = "composite";
  data.representedSystemCount = 3;

  const result = validateRegistrationSchema(
    normalizeBeaconRegistration(data)
  );

  assert.equal(result.valid, true, result.errors.join("; "));
});

test("invalid composite count is rejected by form validation", async () => {
  const { validateBeaconForm } = await import(
    "../src/components/beacon/validation.ts"
  );

  const data = baseline();
  data.presenceScope = "composite";
  data.representedSystemCount = 1;

  const result = validateBeaconForm(data, []);

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) =>
    error.includes("at least two systems")
  ));
});

test("valid custom presence type passes schema validation", () => {
  const data = baseline();
  data.presenceType = "other";
  data.customPresenceType = "Autonomous Research System";

  const result = validateRegistrationSchema(
    normalizeBeaconRegistration(data)
  );

  assert.equal(result.valid, true, result.errors.join("; "));
});

test("invalid custom presence type is rejected by form validation", async () => {
  const { validateBeaconForm } = await import(
    "../src/components/beacon/validation.ts"
  );

  const data = baseline();
  data.presenceType = "other";
  data.customPresenceType = "X";

  const result = validateBeaconForm(data, []);

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) =>
    error.includes("Custom presence type")
  ));
});
