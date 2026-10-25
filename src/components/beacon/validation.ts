function isValidUri(value: string, maxLength: number): boolean {
  if (!value || value.length > maxLength) return false;

  try {
    const parsed = new URL(value);
    return Boolean(parsed.protocol);
  } catch {
    return false;
  }
}

import type { BeaconFormData } from "./types";
import type { AttachmentDraftState } from "./attachment-draft";

export interface BeaconFormValidation {
  valid: boolean;
  errors: string[];
}

export function validateBeaconForm(
  data: BeaconFormData,
  attachmentDrafts: AttachmentDraftState[]
): BeaconFormValidation {
  const errors: string[] = [];

  const name = data.name.trim();
  const description = data.description.trim();

  if (name.length < 1 || name.length > 150) {
    errors.push("Machine name must contain 1–150 characters.");
  }

  if (description.length < 20 || description.length > 500) {
    errors.push("Description must contain 20–500 characters.");
  }

  if (
    data.presenceScope === "composite" &&
    (!Number.isInteger(data.representedSystemCount) ||
      (data.representedSystemCount ?? 0) < 2)
  ) {
    errors.push("Composite presences require at least two systems.");
  }

  if (data.presenceType === "other") {
    const custom = data.customPresenceType?.trim() ?? "";

    if (custom.length < 2 || custom.length > 80) {
      errors.push("Custom presence type must contain 2–80 characters.");
    }
  }

  if (attachmentDrafts.length !== data.attachments.length) {
    errors.push("Attachment validation state is incomplete.");
  }

  data.attachments.forEach((attachment, index) => {
    if (
      attachment.type.trim().length < 1 ||
      attachment.type.length > 200
    ) {
      errors.push(`Attachment ${index + 1}: invalid type.`);
    }

    if (
      attachment.version.trim().length < 1 ||
      attachment.version.length > 40
    ) {
      errors.push(`Attachment ${index + 1}: invalid version.`);
    }

    if (
      typeof attachment.data !== "object" ||
      attachment.data === null ||
      Array.isArray(attachment.data)
    ) {
      errors.push(`Attachment ${index + 1}: data must be a JSON object.`);
    }

    if (!attachmentDrafts[index]?.valid) {
      errors.push(`Attachment ${index + 1}: invalid JSON draft.`);
    }
  });

  data.taxonomy.forEach((entry, index) => {
    if (!entry.domain.trim() || entry.domain.length > 120) {
      errors.push(`Industry ${index + 1}: invalid domain.`);
    }
    if (!entry.category.trim() || entry.category.length > 120) {
      errors.push(`Industry ${index + 1}: invalid category.`);
    }
    if (
      entry.subcategory !== undefined &&
      (entry.subcategory.length < 1 || entry.subcategory.length > 120)
    ) {
      errors.push(`Industry ${index + 1}: invalid subcategory.`);
    }
  });

  data.capabilities.forEach((entry, index) => {
    if (!entry.id.trim() || entry.id.length > 160) {
      errors.push(`Capability ${index + 1}: invalid ID.`);
    }
    if (!entry.name.trim() || entry.name.length > 160) {
      errors.push(`Capability ${index + 1}: invalid name.`);
    }
    if (entry.vocabulary !== undefined && entry.vocabulary.length > 200) {
      errors.push(`Capability ${index + 1}: vocabulary too long.`);
    }
    if (entry.description !== undefined && entry.description.length > 500) {
      errors.push(`Capability ${index + 1}: description too long.`);
    }
  });

  data.reachability.forEach((entry, index) => {
    if (!entry.type.trim() || entry.type.length > 100) {
      errors.push(`Reachability ${index + 1}: invalid type.`);
    }
    if (!entry.value.trim() || entry.value.length > 2048) {
      errors.push(`Reachability ${index + 1}: invalid value.`);
    }
    if (
      entry.label !== undefined &&
      (entry.label.length < 1 || entry.label.length > 160)
    ) {
      errors.push(`Reachability ${index + 1}: invalid label.`);
    }
  });

  for (const field of ["developers", "organizations"] as const) {
    const entries = data.profiles[field];

    entries.forEach((entry, index) => {
      if (!entry.trim() || entry.length > 160) {
        errors.push(`${field} ${index + 1}: invalid value.`);
      }
    });

    if (new Set(entries).size !== entries.length) {
      errors.push(`${field}: duplicate entries are not permitted.`);
    }
  }

  data.profiles.links.forEach((entry, index) => {
    if (!entry.type.trim() || entry.type.length > 100) {
      errors.push(`Profile link ${index + 1}: invalid type.`);
    }
    if (!isValidUri(entry.url, 2048)) {
      errors.push(`Profile link ${index + 1}: invalid URL.`);
    }
    if (entry.label !== undefined &&
        (entry.label.length < 1 || entry.label.length > 160)) {
      errors.push(`Profile link ${index + 1}: invalid label.`);
    }
  });

  data.catalogs.native.forEach((entry, index) => {
    if (!entry.id.trim() || entry.id.length > 160) {
      errors.push(`Native catalog ${index + 1}: invalid ID.`);
    }
    if (!entry.name.trim() || entry.name.length > 160) {
      errors.push(`Native catalog ${index + 1}: invalid name.`);
    }
    if (!entry.description.trim() || entry.description.length > 500) {
      errors.push(`Native catalog ${index + 1}: invalid description.`);
    }
    if (entry.direction !== "OFFER" && entry.direction !== "SEEK") {
      errors.push(`Native catalog ${index + 1}: invalid direction.`);
    }
    if (entry.resourceUrl !== undefined &&
        !isValidUri(entry.resourceUrl, 2048)) {
      errors.push(`Native catalog ${index + 1}: invalid resource URL.`);
    }
  });

  data.catalogs.external.forEach((entry, index) => {
    if (!isValidUri(entry.url, 2048)) {
      errors.push(`External catalog ${index + 1}: invalid URL.`);
    }
    if (entry.label !== undefined &&
        (entry.label.length < 1 || entry.label.length > 160)) {
      errors.push(`External catalog ${index + 1}: invalid label.`);
    }
    if (entry.format !== undefined && entry.format.length > 100) {
      errors.push(`External catalog ${index + 1}: format too long.`);
    }
  });

  data.protocols.forEach((entry, index) => {
    if (!entry.id.trim() || entry.id.length > 120) {
      errors.push(`Protocol ${index + 1}: invalid ID.`);
    }

    if (entry.version !== undefined && entry.version.length > 80) {
      errors.push(`Protocol ${index + 1}: version too long.`);
    }

    if (entry.documentation !== undefined &&
        !isValidUri(entry.documentation, 2048)) {
      errors.push(`Protocol ${index + 1}: invalid documentation URL.`);
    }

    entry.endpoints?.forEach((endpoint, endpointIndex) => {
      if (!isValidUri(endpoint, 2048)) {
        errors.push(
          `Protocol ${index + 1}, endpoint ${endpointIndex + 1}: invalid URL.`
        );
      }
    });
  });

  data.relationships.forEach((entry, index) => {
    if (!entry.type.trim() || entry.type.length > 120) {
      errors.push(`Relationship ${index + 1}: invalid type.`);
    }

    if (!entry.target.trim() || entry.target.length > 2048) {
      errors.push(`Relationship ${index + 1}: invalid target.`);
    }

    if (entry.label !== undefined &&
        (entry.label.length < 1 || entry.label.length > 160)) {
      errors.push(`Relationship ${index + 1}: invalid label.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
