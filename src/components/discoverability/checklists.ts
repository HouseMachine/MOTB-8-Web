export const DISCOVERABILITY_CHECKLISTS = {
  reachability: {
    publicWebsite: 257,
    machineEndpoint: 256,
    contactPathway: 256,
  },
  profiles: {
    developer: 257,
    organization: 256,
    publicLink: 256,
  },
  catalogs: {
    native: 385,
    external: 384,
  },
  protocols: {
    identified: 257,
    endpoint: 256,
    documentation: 256,
  },
} as const;

export const REACHABILITY_SCORING_TYPES = {
  publicWebsite: ["website", "web", "homepage"],
  machineEndpoint: ["api", "endpoint", "agent-endpoint"],
  contactPathway: ["email", "contact", "support"],
} as const;
