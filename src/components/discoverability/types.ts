export const DISCOVERABILITY_WEIGHTS = {
  machineName: 1541,
  description: 1538,
  presenceScope: 0,
  presenceType: 0,
  goodFaith: 769,
  industry: 769,
  capabilities: 769,
  reachability: 769,
  profiles: 769,
  catalogs: 769,
  protocols: 769,
  relationships: 769,
  attachments: 769,
} as const;

export type DiscoverabilityCategory =
  keyof typeof DISCOVERABILITY_WEIGHTS;

export interface DiscoverabilityCategoryScore {
  category: DiscoverabilityCategory;
  earned: number;
  maximum: number;
}

export interface DiscoverabilityResult {
  baseline: number;
  bonus: number;
  earned: number;
  maximum: 10000;
  percentage: number;
  categories: DiscoverabilityCategoryScore[];
}

export const DISCOVERABILITY_MAXIMUM = 10000;
