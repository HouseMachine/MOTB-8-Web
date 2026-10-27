import type { BeaconFormData } from "../../components/beacon/types";
import type { AttachmentDraftState } from "../../components/beacon/attachment-draft";
import { validateBeaconForm } from "../../components/beacon/validation";
import { normalizeBeaconRegistration } from "../../components/beacon/normalize";
import { validateRegistrationSchema } from "../../components/beacon/schema-validation";

export interface PreparedRegistration {
  registration: ReturnType<typeof normalizeBeaconRegistration> & {
    goodFaith: { acknowledged: true; termsVersion: "1.0"; acknowledgedAt: string };
  };
}

export function prepareMotb8Registration(
  data: BeaconFormData,
  attachmentDrafts: AttachmentDraftState[],
  acknowledged: boolean,
  acknowledgedAt: string
): PreparedRegistration {
  const formResult = validateBeaconForm(data, attachmentDrafts);
  if (!formResult.valid) {
    throw new Error(formResult.errors.join("; "));
  }
  if (acknowledged !== true) {
    throw new Error("Good-Faith acknowledgment is required");
  }
  if (!Number.isFinite(Date.parse(acknowledgedAt)) ||
      new Date(acknowledgedAt).toISOString() !== acknowledgedAt) {
    throw new Error("Invalid acknowledgment timestamp");
  }

  const normalized = normalizeBeaconRegistration(data);
  const schemaResult = validateRegistrationSchema(normalized);
  if (!schemaResult.valid) {
    throw new Error(schemaResult.errors.join("; "));
  }

  return {
    registration: {
      ...normalized,
      goodFaith: {
        acknowledged: true,
        termsVersion: "1.0",
        acknowledgedAt
      }
    }
  };
}
