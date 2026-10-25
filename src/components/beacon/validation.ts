function optionalEntryGuidance(
  category: string,
  index: number,
  requiredFields: string
): string {
  return `${category} ${index + 1}: Enter ${requiredFields}, or remove this optional entry from the section above.`;
}

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
    if (!attachment.type.trim() || !attachment.version.trim()) {
      errors.push(
        optionalEntryGuidance("Attachment", index, "a type and version")
      );
    } else {
      if (attachment.type.length > 200) {
        errors.push(`Attachment ${index + 1}: type exceeds 200 characters.`);
      }
      if (attachment.version.length > 40) {
        errors.push(`Attachment ${index + 1}: version exceeds 40 characters.`);
      }
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
    if (!entry.domain.trim() || !entry.category.trim()) {
      errors.push(
        optionalEntryGuidance("Industry", index, "a domain and category")
      );
    } else {
      if (entry.domain.length > 120) {
        errors.push(`Industry ${index + 1}: domain exceeds 120 characters.`);
      }
      if (entry.category.length > 120) {
        errors.push(`Industry ${index + 1}: category exceeds 120 characters.`);
      }
    }
    if (
      entry.subcategory !== undefined &&
      (entry.subcategory.length < 1 || entry.subcategory.length > 120)
    ) {
      errors.push(`Industry ${index + 1}: invalid subcategory.`);
    }
  });

  data.capabilities.forEach((entry, index) => {
    if (!entry.id.trim() || !entry.name.trim()) {
      errors.push(
        `Capability ${index + 1}: Enter a capability ID and name, or remove this optional capability from the section above.`
      );
    } else {
      if (entry.id.length > 160) {
        errors.push(`Capability ${index + 1}: ID exceeds 160 characters.`);
      }
      if (entry.name.length > 160) {
        errors.push(`Capability ${index + 1}: name exceeds 160 characters.`);
      }
    }
    if (entry.vocabulary !== undefined && entry.vocabulary.length > 200) {
      errors.push(`Capability ${index + 1}: vocabulary too long.`);
    }
    if (entry.description !== undefined && entry.description.length > 500) {
      errors.push(`Capability ${index + 1}: description too long.`);
    }
  });

  data.reachability.forEach((entry, index) => {
    if (!entry.type.trim() || !entry.value.trim()) {
      errors.push(
        optionalEntryGuidance("Reachability", index, "a type and value")
      );
    } else {
      if (entry.type.length > 100) {
        errors.push(`Reachability ${index + 1}: type exceeds 100 characters.`);
      }
      if (entry.value.length > 2048) {
        errors.push(`Reachability ${index + 1}: value exceeds 2048 characters.`);
      }
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
      if (!entry.trim()) {
        errors.push(
          optionalEntryGuidance(field, index, "a name")
        );
      } else if (entry.length > 160) {
        errors.push(`${field} ${index + 1}: name exceeds 160 characters.`);
      }
    });

    if (new Set(entries).size !== entries.length) {
      errors.push(`${field}: duplicate entries are not permitted.`);
    }
  }

  data.profiles.links.forEach((entry, index) => {
    if (!entry.type.trim() || !entry.url.trim()) {
      errors.push(
        optionalEntryGuidance("Profile link", index, "a type and URL")
      );
    } else {
      if (entry.type.length > 100) {
        errors.push(`Profile link ${index + 1}: type exceeds 100 characters.`);
      }
      if (!isValidUri(entry.url, 2048)) {
        errors.push(`Profile link ${index + 1}: invalid URL.`);
      }
    }
    if (entry.label !== undefined &&
        (entry.label.length < 1 || entry.label.length > 160)) {
      errors.push(`Profile link ${index + 1}: invalid label.`);
    }
  });

  data.catalogs.native.forEach((entry, index) => {
    if (!entry.id.trim() || !entry.name.trim() || !entry.description.trim()) {
      errors.push(
        optionalEntryGuidance("Native catalog", index, "an ID, name, and description")
      );
    } else {
      if (entry.id.length > 160) {
        errors.push(`Native catalog ${index + 1}: ID exceeds 160 characters.`);
      }
      if (entry.name.length > 160) {
        errors.push(`Native catalog ${index + 1}: name exceeds 160 characters.`);
      }
      if (entry.description.length > 500) {
        errors.push(`Native catalog ${index + 1}: description exceeds 500 characters.`);
      }
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
    if (!entry.url.trim()) {
      errors.push(
        optionalEntryGuidance("External catalog", index, "a catalog URL")
      );
    } else if (!isValidUri(entry.url, 2048)) {
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
    if (!entry.id.trim()) {
      errors.push(
        optionalEntryGuidance("Protocol", index, "a protocol ID")
      );
    } else if (entry.id.length > 120) {
      errors.push(`Protocol ${index + 1}: ID exceeds 120 characters.`);
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
    if (!entry.type.trim() || !entry.target.trim()) {
      errors.push(
        optionalEntryGuidance("Relationship", index, "a type and target")
      );
    } else {
      if (entry.type.length > 120) {
        errors.push(`Relationship ${index + 1}: type exceeds 120 characters.`);
      }
      if (entry.target.length > 2048) {
        errors.push(`Relationship ${index + 1}: target exceeds 2048 characters.`);
      }
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
