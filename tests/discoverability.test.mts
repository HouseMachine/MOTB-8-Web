import test from "node:test";
import assert from "node:assert/strict";

import { calculateDiscoverability } from "../src/components/discoverability/scoring.ts";
import type { BeaconFormData } from "../src/components/beacon/types.ts";

function baseline(): BeaconFormData {
  return {
    name: "",
    description: "",
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

test("discoverability maximum is exactly 100 points", () => {
  const data = baseline();

  const result = calculateDiscoverability(data, false, []);

  assert.equal(result.maximum, 10000);
  assert.equal(result.categories.length, 13);

  const totalMaximum = result.categories.reduce(
    (sum, category) => sum + category.maximum,
    0
  );

  assert.equal(totalMaximum, 10000);
});

test("missing name and description earn no points", () => {
  const result = calculateDiscoverability(baseline(), false, []);

  const name = result.categories.find(
    (category) => category.category === "machineName"
  );

  const description = result.categories.find(
    (category) => category.category === "description"
  );

  assert.equal(name?.earned, 0);
  assert.equal(description?.earned, 0);
});

test("valid name and description earn their fixed allocations", () => {
  const data = baseline();

  data.name = "Research Assistant";
  data.description =
    "An autonomous assistant that researches and analyzes information.";

  const result = calculateDiscoverability(data, false, []);

  assert.equal(
    result.categories.find((c) => c.category === "machineName")?.earned,
    1541
  );

  assert.equal(
    result.categories.find((c) => c.category === "description")?.earned,
    1538
  );
});
test("one valid capability earns 7.69 points", () => {
  const data = baseline();

  data.capabilities = [
    { id: "research", name: "Research Analysis" },
  ];

  const result = calculateDiscoverability(data, false, []);

  const capability = result.categories.find(
    (category) => category.category === "capabilities"
  );

  assert.equal(capability?.earned, 769);
});

test("multiple capabilities cannot exceed the category maximum", () => {
  const data = baseline();

  data.capabilities = Array.from({ length: 100 }, (_, index) => ({
    id: `capability-${index}`,
    name: `Capability ${index}`,
  }));

  const result = calculateDiscoverability(data, false, []);

  const capability = result.categories.find(
    (category) => category.category === "capabilities"
  );

  assert.equal(capability?.earned, 769);
});

test("incomplete capabilities earn no points", () => {
  const data = baseline();

  data.capabilities = [
    { id: "", name: "" },
    { id: "research", name: "" },
  ];

  const result = calculateDiscoverability(data, false, []);

  const capability = result.categories.find(
    (category) => category.category === "capabilities"
  );

  assert.equal(capability?.earned, 0);
});

test("untouched registration starts at zero percent", () => {
  const result = calculateDiscoverability(baseline(), false, []);

  assert.equal(result.baseline, 0);
  assert.equal(result.bonus, 0);
  assert.equal(result.earned, 0);
  assert.equal(result.percentage, 0);
});

test("required information earns 38.48 points", () => {
  const data = baseline();

  data.name = "Research Assistant";
  data.description =
    "An autonomous assistant that researches and analyzes information.";

  const beforeAcknowledgment = calculateDiscoverability(data, false, []);

  assert.equal(beforeAcknowledgment.earned, 3079);
  assert.equal(beforeAcknowledgment.percentage, 30.79);

  const afterAcknowledgment = calculateDiscoverability(data, true, []);

  assert.equal(afterAcknowledgment.earned, 3848);
  assert.equal(afterAcknowledgment.percentage, 38.48);
});
test("additional capabilities increase the combined score", () => {
  const data = baseline();

  data.capabilities = [
    { id: "research", name: "Research" },
    { id: "translation", name: "Translation" },
    { id: "classification", name: "Classification" },
  ];

  const result = calculateDiscoverability(data, false, []);

  assert.equal(result.baseline, 769);
  assert.equal(result.bonus, 512);
  assert.equal(result.earned, 1281);
  assert.equal(result.percentage, 12.81);
});

test("removing an additional entry reduces the score", () => {
  const data = baseline();

  data.capabilities = [
    { id: "research", name: "Research" },
    { id: "translation", name: "Translation" },
    { id: "classification", name: "Classification" },
  ];

  const before = calculateDiscoverability(data, false, []);

  data.capabilities.pop();

  const after = calculateDiscoverability(data, false, []);

  assert.equal(before.earned, 1281);
  assert.equal(after.earned, 1025);
});

test("additional optional entries can compensate for an omitted category", () => {
  const data = baseline();

  data.name = "Research Assistant";
  data.description =
    "An autonomous assistant that researches and analyzes information.";

  data.taxonomy = [{ domain: "Technology", category: "Research" }];
  data.capabilities = [
    { id: "research", name: "Research" },
    { id: "translation", name: "Translation" },
    { id: "classification", name: "Classification" },
    { id: "summarization", name: "Summarization" },
    { id: "extraction", name: "Extraction" },
  ];

  data.reachability = [
    { type: "website", value: "https://example.com" },
    { type: "email", value: "operator@example.com" },
  ];

  data.profiles.developers = ["Developer"];
  data.profiles.organizations = ["Organization"];
  data.profiles.links = [
    { type: "website", url: "https://example.com/profile" },
  ];

  data.catalogs.native = [
    {
      id: "catalog-1",
      name: "Research Services",
      description: "Available research capabilities.",
      direction: "OFFER",
    },
  ];

  data.catalogs.external = [
    { url: "https://example.com/catalog" },
  ];

  data.protocols = [
    {
      id: "https",
      endpoints: ["https://example.com/api"],
      documentation: "https://example.com/docs",
    },
  ];

  data.relationships = [
    { type: "operator", target: "Example Organization" },
  ];

  // No structured attachment is supplied.
  const result = calculateDiscoverability(data, true, []);

  assert.equal(
    result.categories.find((c) => c.category === "attachments")?.earned,
    0
  );

  assert.equal(result.earned, 10000);
  assert.equal(result.percentage, 100);
});

test("visual score never exceeds 100 percent", () => {
  const data = baseline();

  data.capabilities = Array.from({ length: 100 }, (_, index) => ({
    id: `capability-${index}`,
    name: `Capability ${index}`,
  }));

  const result = calculateDiscoverability(data, false, []);

  assert.equal(result.earned, 10000);
  assert.equal(result.percentage, 100);
});
