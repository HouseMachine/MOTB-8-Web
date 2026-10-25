import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateDiscoveryBonus,
  DISCOVERABILITY_BONUS_PER_ENTRY,
} from "../src/components/discoverability/bonuses.ts";

test("bonus increment is 2.56 points", () => {
  assert.equal(DISCOVERABILITY_BONUS_PER_ENTRY, 256);
});

test("zero or one entry earns no bonus", () => {
  assert.equal(calculateDiscoveryBonus(0), 0);
  assert.equal(calculateDiscoveryBonus(1), 0);
});

test("each additional entry earns equal points", () => {
  assert.equal(calculateDiscoveryBonus(2), 256);
  assert.equal(calculateDiscoveryBonus(3), 512);
  assert.equal(calculateDiscoveryBonus(5), 1024);
});

test("bonus scoring has no ten-entry cap", () => {
  assert.equal(calculateDiscoveryBonus(10), 2304);
  assert.equal(calculateDiscoveryBonus(11), 2560);
  assert.equal(calculateDiscoveryBonus(100), 25344);
});

test("invalid counts earn no bonus", () => {
  assert.equal(calculateDiscoveryBonus(-1), 0);
  assert.equal(calculateDiscoveryBonus(2.5), 0);
  assert.equal(calculateDiscoveryBonus(Number.NaN), 0);
  assert.equal(calculateDiscoveryBonus(Number.POSITIVE_INFINITY), 0);
});

test("removing entries reduces the recalculated bonus", () => {
  const before = calculateDiscoveryBonus(8);
  const after = calculateDiscoveryBonus(3);

  assert.equal(before, 1792);
  assert.equal(after, 512);
  assert.ok(after < before);
});
