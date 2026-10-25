import type { BeaconFormData } from "./types";

export interface NormalizedBeaconRegistration {
  name: string;
  description: string;
  presenceScope: BeaconFormData["presenceScope"];
  presenceType: BeaconFormData["presenceType"];
  representedSystemCount?: number;
  customPresenceType?: string;
  taxonomy?: BeaconFormData["taxonomy"];
  capabilities?: BeaconFormData["capabilities"];
  reachability?: BeaconFormData["reachability"];
  profiles?: {
    developers?: string[];
    organizations?: string[];
    links?: BeaconFormData["profiles"]["links"];
  };
  catalogs?: {
    native?: BeaconFormData["catalogs"]["native"];
    external?: BeaconFormData["catalogs"]["external"];
  };
  protocols?: BeaconFormData["protocols"];
  relationships?: BeaconFormData["relationships"];
  attachments?: BeaconFormData["attachments"];
}

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function normalizeBeaconRegistration(
  data: BeaconFormData
): NormalizedBeaconRegistration {
  const result: NormalizedBeaconRegistration = {
    name: data.name.trim(),
    description: data.description.trim(),
    presenceScope: data.presenceScope,
    presenceType: data.presenceType,
  };

  if (data.presenceScope === "composite") {
    result.representedSystemCount = data.representedSystemCount;
  }

  if (data.presenceType === "other") {
    result.customPresenceType = data.customPresenceType?.trim();
  }
  // Industry classifications
  if (data.taxonomy.length > 0) {
    result.taxonomy = data.taxonomy.map((entry) => ({
      domain: entry.domain.trim(),
      category: entry.category.trim(),
      ...(optionalText(entry.subcategory) !== undefined
        ? { subcategory: optionalText(entry.subcategory) }
        : {}),
    }));
  }

  // Machine capabilities
  if (data.capabilities.length > 0) {
    result.capabilities = data.capabilities.map((entry) => ({
      id: entry.id.trim(),
      name: entry.name.trim(),
      ...(optionalText(entry.vocabulary) !== undefined
        ? { vocabulary: optionalText(entry.vocabulary) }
        : {}),
      ...(optionalText(entry.description) !== undefined
        ? { description: optionalText(entry.description) }
        : {}),
    }));
  }

  // Reachability and contact
  if (data.reachability.length > 0) {
    result.reachability = data.reachability.map((entry) => ({
      type: entry.type.trim(),
      value: entry.value.trim(),
      ...(optionalText(entry.label) !== undefined
        ? { label: optionalText(entry.label) }
        : {}),
    }));
  }
  // Developer and organization profiles
  const profiles: NonNullable<NormalizedBeaconRegistration["profiles"]> = {};

  if (data.profiles.developers.length > 0) {
    profiles.developers = data.profiles.developers.map((entry) => entry.trim());
  }

  if (data.profiles.organizations.length > 0) {
    profiles.organizations = data.profiles.organizations.map((entry) => entry.trim());
  }

  if (data.profiles.links.length > 0) {
    profiles.links = data.profiles.links.map((entry) => ({
      type: entry.type.trim(),
      url: entry.url.trim(),
      ...(optionalText(entry.label) !== undefined
        ? { label: optionalText(entry.label) }
        : {}),
    }));
  }

  if (Object.keys(profiles).length > 0) {
    result.profiles = profiles;
  }

  // Native and external catalogs
  const catalogs: NonNullable<NormalizedBeaconRegistration["catalogs"]> = {};

  if (data.catalogs.native.length > 0) {
    catalogs.native = data.catalogs.native.map((entry) => ({
      id: entry.id.trim(),
      direction: entry.direction,
      name: entry.name.trim(),
      description: entry.description.trim(),
      ...(optionalText(entry.resourceUrl) !== undefined
        ? { resourceUrl: optionalText(entry.resourceUrl) }
        : {}),
    }));
  }

  if (data.catalogs.external.length > 0) {
    catalogs.external = data.catalogs.external.map((entry) => ({
      url: entry.url.trim(),
      ...(optionalText(entry.label) !== undefined
        ? { label: optionalText(entry.label) }
        : {}),
      ...(optionalText(entry.format) !== undefined
        ? { format: optionalText(entry.format) }
        : {}),
    }));
  }

  if (Object.keys(catalogs).length > 0) {
    result.catalogs = catalogs;
  }
  // Protocol declarations
  if (data.protocols.length > 0) {
    result.protocols = data.protocols.map((entry) => ({
      id: entry.id.trim(),
      ...(optionalText(entry.version) !== undefined
        ? { version: optionalText(entry.version) }
        : {}),
      ...(optionalText(entry.documentation) !== undefined
        ? { documentation: optionalText(entry.documentation) }
        : {}),
      ...(entry.endpoints !== undefined && entry.endpoints.length > 0
        ? { endpoints: entry.endpoints.map((endpoint) => endpoint.trim()) }
        : {}),
    }));
  }

  // Machine relationships
  if (data.relationships.length > 0) {
    result.relationships = data.relationships.map((entry) => ({
      type: entry.type.trim(),
      target: entry.target.trim(),
      ...(optionalText(entry.label) !== undefined
        ? { label: optionalText(entry.label) }
        : {}),
    }));
  }

  // Structured attachments
  if (data.attachments.length > 0) {
    result.attachments = data.attachments.map((entry) => ({
      type: entry.type.trim(),
      version: entry.version.trim(),
      data: entry.data,
    }));
  }

  return result;
}
