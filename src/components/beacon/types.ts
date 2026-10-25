export type PresenceScope = "single" | "composite";

export type PresenceType =
  | "agent"
  | "machine"
  | "swarm"
  | "gateway"
  | "robot"
  | "iot-system"
  | "other";

export interface BeaconFormData {
  name: string;
  description: string;
  presenceScope: PresenceScope;
  presenceType: PresenceType;
  representedSystemCount?: number;
  customPresenceType?: string;

  taxonomy: {
    domain: string;
    category: string;
    subcategory?: string;
  }[];

  capabilities: {
    id: string;
    name: string;
    vocabulary?: string;
    description?: string;
  }[];

  reachability: {
    type: string;
    value: string;
    label?: string;
  }[];

  profiles: {
    developers: string[];
    organizations: string[];
    links: {
      type: string;
      url: string;
      label?: string;
    }[];
  };

  catalogs: {
    native: {
      id: string;
      direction: "OFFER" | "SEEK";
      name: string;
      description: string;
      resourceUrl?: string;
    }[];
    external: {
      url: string;
      label?: string;
      format?: string;
    }[];
  };

  protocols: {
    id: string;
    version?: string;
    documentation?: string;
    endpoints?: string[];
  }[];

  relationships: {
    type: string;
    target: string;
    label?: string;
  }[];

  attachments: {
    type: string;
    version: string;
    data: Record<string, unknown>;
  }[];
}
