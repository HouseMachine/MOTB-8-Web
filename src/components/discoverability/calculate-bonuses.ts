import type { BeaconFormData } from "../beacon/types";
import { calculateDiscoveryBonus } from "./bonuses";

function validText(
  value: string | undefined,
  min = 1,
  max = Infinity
): boolean {
  const text = value?.trim() ?? "";
  return text.length >= min && text.length <= max;
}

export function calculateDiscoverabilityBonuses(
  data: BeaconFormData
): number {
  const validCapabilities = data.capabilities.filter((entry) =>
    validText(entry.id, 1, 160) &&
    validText(entry.name, 1, 160) &&
    (entry.vocabulary === undefined ||
      entry.vocabulary.length <= 200) &&
    (entry.description === undefined ||
      entry.description.length <= 500)
  );

  let bonus = calculateDiscoveryBonus(validCapabilities.length);

  // Additional valid industry classifications.
  const validIndustries = data.taxonomy.filter((entry) =>
    validText(entry.domain, 1, 120) &&
    validText(entry.category, 1, 120) &&
    (entry.subcategory === undefined ||
      validText(entry.subcategory, 1, 120))
  );

  bonus += calculateDiscoveryBonus(validIndustries.length);

  // Additional reachability entries.
  const validReachability = data.reachability.filter((entry) =>
    validText(entry.type, 1, 100) &&
    validText(entry.value, 1, 2048) &&
    (entry.label === undefined ||
      validText(entry.label, 1, 160))
  );

  bonus += calculateDiscoveryBonus(validReachability.length);

  // Additional developer and organization entries.
  const validDevelopers = data.profiles.developers.filter((entry) =>
    validText(entry, 1, 160)
  );

  const validOrganizations = data.profiles.organizations.filter((entry) =>
    validText(entry, 1, 160)
  );

  bonus += calculateDiscoveryBonus(validDevelopers.length);
  bonus += calculateDiscoveryBonus(validOrganizations.length);

  // Additional public profile links.
  const validProfileLinks = data.profiles.links.filter((entry) =>
    validText(entry.type, 1, 100) &&
    validText(entry.url, 1, 2048)
  );

  bonus += calculateDiscoveryBonus(validProfileLinks.length);

  // Additional native catalog entries.
  const validNativeCatalogs = data.catalogs.native.filter((entry) =>
    validText(entry.id, 1, 160) &&
    validText(entry.name, 1, 160) &&
    validText(entry.description, 1, 500) &&
    (entry.direction === "OFFER" || entry.direction === "SEEK")
  );

  bonus += calculateDiscoveryBonus(validNativeCatalogs.length);

  // Additional external catalog entries.
  const validExternalCatalogs = data.catalogs.external.filter((entry) =>
    validText(entry.url, 1, 2048)
  );

  bonus += calculateDiscoveryBonus(validExternalCatalogs.length);

  // Additional protocol declarations.
  const validProtocols = data.protocols.filter((entry) =>
    validText(entry.id, 1, 120)
  );

  bonus += calculateDiscoveryBonus(validProtocols.length);

  // Additional relationships.
  const validRelationships = data.relationships.filter((entry) =>
    validText(entry.type, 1, 120) &&
    validText(entry.target, 1, 2048)
  );

  bonus += calculateDiscoveryBonus(validRelationships.length);

  // Additional structured attachments.
  const validAttachments = data.attachments.filter((entry) =>
    validText(entry.type, 1, 200) &&
    validText(entry.version, 1, 40) &&
    typeof entry.data === "object" &&
    entry.data !== null &&
    !Array.isArray(entry.data)
  );

  bonus += calculateDiscoveryBonus(validAttachments.length);

  return bonus;
}
