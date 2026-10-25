import type { BeaconFormData } from "../beacon/types";
import type { AttachmentDraftState } from "../beacon/attachment-draft";
import {
  DISCOVERABILITY_WEIGHTS,
  DISCOVERABILITY_MAXIMUM,
  type DiscoverabilityCategory,
  type DiscoverabilityCategoryScore,
  type DiscoverabilityResult,
} from "./types";
import {
  DISCOVERABILITY_CHECKLISTS,
  REACHABILITY_SCORING_TYPES,
} from "./checklists";
import { calculateDiscoverabilityBonuses } from "./calculate-bonuses";

function validText(value: string | undefined, min = 1, max = Infinity): boolean {
  const text = value?.trim() ?? "";
  return text.length >= min && text.length <= max;
}

function validUrl(value: string | undefined): boolean {
  if (!value || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function matchesType(type: string, options: readonly string[]): boolean {
  return options.includes(type.trim().toLowerCase());
}

export function calculateDiscoverability(
  data: BeaconFormData,
  goodFaithAcknowledged: boolean,
  attachmentDrafts: AttachmentDraftState[]
): DiscoverabilityResult {
  const earned: Record<DiscoverabilityCategory, number> = {
    machineName: 0,
    description: 0,
    presenceScope: 0,
    presenceType: 0,
    goodFaith: 0,
    industry: 0,
    capabilities: 0,
    reachability: 0,
    profiles: 0,
    catalogs: 0,
    protocols: 0,
    relationships: 0,
    attachments: 0,
  };

  if (validText(data.name, 1, 150)) {
    earned.machineName = DISCOVERABILITY_WEIGHTS.machineName;
  }

  if (validText(data.description, 20, 500)) {
    earned.description = DISCOVERABILITY_WEIGHTS.description;
  }

  if (
    data.presenceScope === "single" ||
    (data.presenceScope === "composite" &&
      Number.isInteger(data.representedSystemCount) &&
      (data.representedSystemCount ?? 0) >= 2)
  ) {
    earned.presenceScope = DISCOVERABILITY_WEIGHTS.presenceScope;
  }

  if (
    data.presenceType !== "other" ||
    validText(data.customPresenceType, 2, 80)
  ) {
    earned.presenceType = DISCOVERABILITY_WEIGHTS.presenceType;
  }

  if (goodFaithAcknowledged) {
    earned.goodFaith = DISCOVERABILITY_WEIGHTS.goodFaith;
  }

  if (data.taxonomy.some((entry) =>
    validText(entry.domain, 1, 120) &&
    validText(entry.category, 1, 120)
  )) {
    earned.industry = DISCOVERABILITY_WEIGHTS.industry;
  }

  if (data.capabilities.some((entry) =>
    validText(entry.id, 1, 160) &&
    validText(entry.name, 1, 160)
  )) {
    earned.capabilities = DISCOVERABILITY_WEIGHTS.capabilities;
  }
  // Reachability: three distinct discovery pathways.
  const reachability = data.reachability.filter((entry) =>
    validText(entry.type, 1, 100) &&
    validText(entry.value, 1, 2048) &&
    (entry.label === undefined || validText(entry.label, 1, 160))
  );

  if (reachability.some((entry) =>
    matchesType(entry.type, REACHABILITY_SCORING_TYPES.publicWebsite) &&
    validUrl(entry.value)
  )) {
    earned.reachability += DISCOVERABILITY_CHECKLISTS.reachability.publicWebsite;
  }

  if (reachability.some((entry) =>
    matchesType(entry.type, REACHABILITY_SCORING_TYPES.machineEndpoint) &&
    validUrl(entry.value)
  )) {
    earned.reachability += DISCOVERABILITY_CHECKLISTS.reachability.machineEndpoint;
  }

  if (reachability.some((entry) =>
    matchesType(entry.type, REACHABILITY_SCORING_TYPES.contactPathway)
  )) {
    earned.reachability += DISCOVERABILITY_CHECKLISTS.reachability.contactPathway;
  }

  // Profiles: developer, organization, and public profile link.
  if (data.profiles.developers.some((entry) => validText(entry, 1, 160))) {
    earned.profiles += DISCOVERABILITY_CHECKLISTS.profiles.developer;
  }

  if (data.profiles.organizations.some((entry) => validText(entry, 1, 160))) {
    earned.profiles += DISCOVERABILITY_CHECKLISTS.profiles.organization;
  }

  if (data.profiles.links.some((entry) =>
    validText(entry.type, 1, 100) &&
    validUrl(entry.url) &&
    (entry.label === undefined || validText(entry.label, 1, 160))
  )) {
    earned.profiles += DISCOVERABILITY_CHECKLISTS.profiles.publicLink;
  }

  // Catalogs: native and external pathways.
  if (data.catalogs.native.some((entry) =>
    validText(entry.id, 1, 160) &&
    validText(entry.name, 1, 160) &&
    validText(entry.description, 1, 500) &&
    (entry.direction === "OFFER" || entry.direction === "SEEK") &&
    (entry.resourceUrl === undefined || validUrl(entry.resourceUrl))
  )) {
    earned.catalogs += DISCOVERABILITY_CHECKLISTS.catalogs.native;
  }

  if (data.catalogs.external.some((entry) =>
    validUrl(entry.url) &&
    (entry.label === undefined || validText(entry.label, 1, 160)) &&
    (entry.format === undefined || entry.format.length <= 100)
  )) {
    earned.catalogs += DISCOVERABILITY_CHECKLISTS.catalogs.external;
  }

  // Protocols: identification, endpoint, and documentation.
  const validProtocols = data.protocols.filter((entry) =>
    validText(entry.id, 1, 120) &&
    (entry.version === undefined || entry.version.length <= 80) &&
    (entry.documentation === undefined || validUrl(entry.documentation)) &&
    (entry.endpoints === undefined ||
      entry.endpoints.every((endpoint) => validUrl(endpoint)))
  );

  if (validProtocols.length > 0) {
    earned.protocols += DISCOVERABILITY_CHECKLISTS.protocols.identified;
  }

  if (validProtocols.some((entry) =>
    entry.endpoints?.some((endpoint) => validUrl(endpoint))
  )) {
    earned.protocols += DISCOVERABILITY_CHECKLISTS.protocols.endpoint;
  }

  if (validProtocols.some((entry) =>
    entry.documentation !== undefined && validUrl(entry.documentation)
  )) {
    earned.protocols += DISCOVERABILITY_CHECKLISTS.protocols.documentation;
  }
  // Relationships: at least one complete relationship.
  if (data.relationships.some((entry) =>
    validText(entry.type, 1, 120) &&
    validText(entry.target, 1, 2048) &&
    (entry.label === undefined || validText(entry.label, 1, 160))
  )) {
    earned.relationships = DISCOVERABILITY_WEIGHTS.relationships;
  }

  // Attachments: at least one complete, valid draft attachment.
  if (data.attachments.some((entry, index) =>
    validText(entry.type, 1, 200) &&
    validText(entry.version, 1, 40) &&
    typeof entry.data === "object" &&
    entry.data !== null &&
    !Array.isArray(entry.data) &&
    attachmentDrafts[index]?.valid === true
  )) {
    earned.attachments = DISCOVERABILITY_WEIGHTS.attachments;
  }

  // Apply each category's maximum independently.
  const categories: DiscoverabilityCategoryScore[] = (
    Object.keys(DISCOVERABILITY_WEIGHTS) as DiscoverabilityCategory[]
  ).map((category) => {
    const maximum = DISCOVERABILITY_WEIGHTS[category];

    return {
      category,
      earned: Math.min(Math.max(earned[category], 0), maximum),
      maximum,
    };
  });

  const baseline = categories.reduce(
    (sum, category) => sum + category.earned,
    0
  );

  const bonus = calculateDiscoverabilityBonuses(data);
  const totalScore = Math.min(
    baseline + bonus,
    DISCOVERABILITY_MAXIMUM
  );

  return {
    baseline,
    bonus,
    earned: totalScore,
    maximum: DISCOVERABILITY_MAXIMUM,
    percentage: totalScore / 100,
    categories,
  };
}
