import type { MOTB8BeaconV11 } from "motb-8";
import type { BeaconFormData } from "../../components/beacon/types";

export function beaconToManageForm(
  beacon: MOTB8BeaconV11
): BeaconFormData {
  return {
    name: beacon.name,
    description: beacon.description,
    presenceScope: beacon.presenceScope,
    presenceType: beacon.presenceType,
    ...(beacon.representedSystemCount !== undefined
      ? { representedSystemCount: beacon.representedSystemCount }
      : {}),
    ...(beacon.customPresenceType !== undefined
      ? { customPresenceType: beacon.customPresenceType }
      : {}),
    taxonomy: structuredClone(beacon.taxonomy ?? []),
    capabilities: structuredClone(beacon.capabilities ?? []),
    reachability: structuredClone(beacon.reachability ?? []),
    profiles: {
      developers: structuredClone(beacon.profiles?.developers ?? []),
      organizations: structuredClone(beacon.profiles?.organizations ?? []),
      links: structuredClone(beacon.profiles?.links ?? [])
    },
    catalogs: {
      native: structuredClone(beacon.catalogs?.native ?? []),
      external: structuredClone(beacon.catalogs?.external ?? [])
    },
    protocols: structuredClone(beacon.protocols ?? []),
    relationships: structuredClone(beacon.relationships ?? []),
    attachments: structuredClone(beacon.attachments ?? [])
  };
}
