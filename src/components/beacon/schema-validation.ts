import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";

import beaconSchema from "@/schemas/beacon-v1.1.schema.json";
import type { NormalizedBeaconRegistration } from "./normalize";

const REGISTRATION_FIELDS = [
  "name",
  "description",
  "presenceScope",
  "presenceType",
  "representedSystemCount",
  "customPresenceType",
  "taxonomy",
  "capabilities",
  "reachability",
  "profiles",
  "catalogs",
  "protocols",
  "relationships",
  "attachments",
] as const;

const sourceProperties = beaconSchema.properties as Record<
  string,
  Record<string, unknown>
>;

const registrationProperties = Object.fromEntries(
  REGISTRATION_FIELDS.map((field) => [
    field,
    sourceProperties[field],
  ])
);

const registrationSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  additionalProperties: false,
  required: [
    "name",
    "description",
    "presenceScope",
    "presenceType",
  ],
  properties: registrationProperties,
};

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
});

addFormats(ajv);

const validate = ajv.compile(registrationSchema);

export interface RegistrationSchemaResult {
  valid: boolean;
  errors: string[];
}

export function validateRegistrationSchema(
  data: NormalizedBeaconRegistration
): RegistrationSchemaResult {
  const valid = validate(data);

  return {
    valid: Boolean(valid),
    errors: (validate.errors ?? []).map((error) => {
      const location = error.instancePath || "registration";
      return `${location}: ${error.message ?? "Invalid value"}`;
    }),
  };
}
