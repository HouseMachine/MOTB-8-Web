import test from "node:test";
import assert from "node:assert/strict";
import { registrationFingerprint } from "../src/lib/motb8/fingerprint.ts";
import type { NormalizedBeaconRegistration } from "../src/components/beacon/normalize.ts";

function baseline(): NormalizedBeaconRegistration {
  return {
    name: "Research Assistant",
    description: "An autonomous research and analysis machine.",
    presenceScope: "single",
    presenceType: "agent"
  };
}

test("identical registrations produce identical fingerprints", () => {
  assert.equal(registrationFingerprint(baseline()), registrationFingerprint(baseline()));
});

test("property ordering does not change the fingerprint", () => {
  const first = baseline();
  const reordered: NormalizedBeaconRegistration = {
    presenceType: first.presenceType,
    description: first.description,
    name: first.name,
    presenceScope: first.presenceScope
  };
  assert.equal(registrationFingerprint(first), registrationFingerprint(reordered));
});

test("changing the machine description changes the fingerprint", () => {
  const first = baseline();
  const modified = { ...first, description: "A different public machine description." };
  assert.notEqual(registrationFingerprint(first), registrationFingerprint(modified));
});

test("changing optional capabilities changes the fingerprint", () => {
  const first = baseline();
  const modified = { ...first, capabilities: [{ id: "research", name: "Research Analysis" }] };
  assert.notEqual(registrationFingerprint(first), registrationFingerprint(modified));
});

test("changing attachment data changes the fingerprint", () => {
  const first = { ...baseline(), attachments: [{ type: "example", version: "1.0", data: { enabled: true } }] };
  const modified = structuredClone(first);
  modified.attachments[0].data.enabled = false;
  assert.notEqual(registrationFingerprint(first), registrationFingerprint(modified));
});
